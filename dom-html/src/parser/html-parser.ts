import { Token, TokenType } from '../tokenizer/types';
import { ASTNode, NodeType } from '../ast/types';

export class ParseError extends Error {
  constructor(
    message: string,
    public line: number,
    public column: number,
    public source?: string
  ) {
    super(message);
    this.name = 'ParseError';
  }
}

export class HTMLParser {
  private tokens: Token[];
  private current: number;
  private errors: ParseError[];
  private voidElements: Set<string>;

  constructor() {
    this.tokens = [];
    this.current = 0;
    this.errors = [];
    this.voidElements = new Set([
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
      'link', 'meta', 'param', 'source', 'track', 'wbr'
    ]);
  }

  parse(tokens: Token[]): { ast: ASTNode, errors: ParseError[] } {
    this.tokens = tokens;
    this.current = 0;
    this.errors = [];

    try {
      const ast = this.buildDOM();
      return { ast, errors: this.errors };
    } catch (e) {
      if (e instanceof ParseError) {
        this.errors.push(e);
      } else {
        this.errors.push(new ParseError(
          'Unexpected parsing error',
          this.getCurrentToken()?.position.line || 0,
          this.getCurrentToken()?.position.column || 0
        ));
      }
      // Return partial AST even if there are errors
      return {
        ast: { type: NodeType.ROOT, children: [] },
        errors: this.errors
      };
    }
  }

  private buildDOM(): ASTNode {
    const root: ASTNode = {
      type: NodeType.ROOT,
      children: []
    };

    while (!this.isAtEnd()) {
      try {
        const node = this.parseNode();
        if (node) {
          root.children!.push(node);
        }
      } catch (e) {
        // Record error and try to recover
        if (e instanceof ParseError) {
          this.errors.push(e);
          this.synchronize();
        } else {
          throw e;
        }
      }
    }

    return root;
  }

  private parseNode(): ASTNode | null {
    const token = this.getCurrentToken();
    if (!token) return null;

    switch (token.type) {
      case TokenType.TAG_OPEN:
        return this.parseElement();
      case TokenType.TEXT:
        return this.parseText();
      case TokenType.COMMENT:
        return this.parseComment();
      default:
        this.error(`Unexpected token: ${token.type}`);
        return null;
    }
  }

  private parseElement(): ASTNode {
    // Skip TAG_OPEN
    this.advance();

    const isClosingTag = this.match(TokenType.TAG_SLASH);
    if (isClosingTag) {
      throw this.error('Unexpected closing tag');
    }

    const tagNameToken = this.consume(TokenType.TAG_NAME, 'Expected tag name');
    const element: ASTNode = {
      type: NodeType.ELEMENT,
      tagName: tagNameToken.value,
      attributes: new Map(),
      children: []
    };

    // Parse attributes
    while (this.match(TokenType.ATTRIBUTE_NAME)) {
      const { name, value } = this.parseAttribute();
      element.attributes!.set(name, value);
    }

    const isSelfClosing = this.match(TokenType.TAG_SLASH);
    this.consume(TokenType.TAG_CLOSE, 'Expected >');

    if (!isSelfClosing && !this.voidElements.has(element.tagName!)) {
      // Parse children until closing tag
      try {
        while (!this.isAtEnd() && !this.checkClosingTag(element.tagName!)) {
          const child = this.parseNode();
          if (child) {
            element.children!.push(child);
          }
        }
      } catch (e) {
        if (e instanceof ParseError) {
          this.errors.push(e);
        } else {
          throw e;
        }
      }

      // Consume closing tag
      this.parseClosingTag(element.tagName!);
    }

    return element;
  }

  private parseAttribute(): { name: string, value: string } {
    const nameToken = this.previous();
    let value = '';

    if (this.match(TokenType.EQUALS)) {
      const valueToken = this.consume(TokenType.ATTRIBUTE_VALUE, 'Expected attribute value');
      value = valueToken.value;
    }

    return {
      name: nameToken.value,
      value
    };
  }

  private parseText(): ASTNode {
    const token = this.getCurrentToken();
    this.advance();
    return {
      type: NodeType.TEXT,
      value: token.value
    };
  }

  private parseComment(): ASTNode {
    const token = this.getCurrentToken();
    this.advance();
    return {
      type: NodeType.COMMENT,
      value: token.value
    };
  }

  private parseClosingTag(expectedTag: string): void {
    this.consume(TokenType.TAG_OPEN, 'Expected <');
    this.consume(TokenType.TAG_SLASH, 'Expected /');
    const tagName = this.consume(TokenType.TAG_NAME, 'Expected tag name').value;
    
    if (tagName !== expectedTag) {
      throw this.error(
        `Mismatched closing tag. Expected </${expectedTag}> but found </${tagName}>`
      );
    }
    
    this.consume(TokenType.TAG_CLOSE, 'Expected >');
  }

  // Error handling and recovery methods
  private error(message: string): ParseError {
    const token = this.getCurrentToken();
    return new ParseError(
      message,
      token?.position.line || 0,
      token?.position.column || 0,
      token?.value
    );
  }

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      // Skip until we find a stable point to resume parsing
      if (this.previous().type === TokenType.TAG_CLOSE) {
        return;
      }

      switch (this.getCurrentToken().type) {
        case TokenType.TAG_OPEN:
        case TokenType.TAG_CLOSE:
          return;
      }

      this.advance();
    }
  }

  // Helper methods
  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) {
      return this.advance();
    }
    throw this.error(message);
  }

  private match(type: TokenType): boolean {
    if (this.check(type)) {
      this.advance();
      return true;
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.getCurrentToken().type === type;
  }

  private checkClosingTag(tagName: string): boolean {
    if (this.isAtEnd()) return false;
    return this.getCurrentToken().type === TokenType.TAG_OPEN &&
           this.peekNext()?.type === TokenType.TAG_SLASH &&
           this.peekNext(2)?.type === TokenType.TAG_NAME &&
           this.peekNext(2)?.value === tagName;
  }

  private getCurrentToken(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private peekNext(offset: number = 1): Token | null {
    return this.tokens[this.current + offset] || null;
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }
}

// Error recovery utility
export class ErrorRecovery {
  static recoverFromError(parser: HTMLParser, error: ParseError): void {
    // Add error recovery strategies here
    // For example, skip to next stable parsing point
  }
}

// AST validation and optimization
export class ASTOptimizer {
  optimize(ast: ASTNode): ASTNode {
    return this.visit(ast);
  }

  private visit(node: ASTNode): ASTNode {
    switch (node.type) {
      case NodeType.ROOT:
        return this.optimizeChildren(node);
      case NodeType.ELEMENT:
        return this.optimizeElement(node);
      case NodeType.TEXT:
        return this.optimizeText(node);
      default:
        return node;
    }
  }

  private optimizeChildren(node: ASTNode): ASTNode {
    if (!node.children) return node;

    // Remove empty text nodes
    node.children = node.children
      .map(child => this.visit(child))
      .filter(child => {
        if (child.type === NodeType.TEXT) {
          return child.value?.trim().length > 0;
        }
        return true;
      });

    // Combine adjacent text nodes
    const optimizedChildren: ASTNode[] = [];
    let currentTextNode: ASTNode | null = null;

    for (const child of node.children) {
      if (child.type === NodeType.TEXT) {
        if (currentTextNode) {
          currentTextNode.value += child.value;
        } else {
          currentTextNode = child;
          optimizedChildren.push(child);
        }
      } else {
        currentTextNode = null;
        optimizedChildren.push(child);
      }
    }

    node.children = optimizedChildren;
    return node;
  }

  private optimizeElement(node: ASTNode): ASTNode {
    // Remove redundant attributes
    if (node.attributes) {
      const uniqueAttrs = new Map<string, string>();
      for (const [key, value] of node.attributes) {
        uniqueAttrs.set(key.toLowerCase(), value);
      }
      node.attributes = uniqueAttrs;
    }

    return this.optimizeChildren(node);
  }

  private optimizeText(node: ASTNode): ASTNode {
    if (node.value) {
      // Normalize whitespace
      node.value = node.value.replace(/\s+/g, ' ');
    }
    return node;
  }
}
