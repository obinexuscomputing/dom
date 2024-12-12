import { Token, TokenType } from './types';

export class HTMLTokenizer {
  private input: string;
  private position: number;
  private line: number;
  private column: number;
  private tokens: Token[];

  constructor() {
    this.input = '';
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }

  tokenize(input: string): Token[] {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];

    while (this.position < this.input.length) {
      const char = this.peek();

      if (char === '<') {
        if (this.peek(1) === '!') {
          if (this.peek(2) === '-' && this.peek(3) === '-') {
            this.tokenizeComment();
          } else {
            this.tokenizeDoctype();
          }
        } else {
          this.tokenizeTag();
        }
      } else if (char === '\n') {
        this.line++;
        this.column = 1;
        this.position++;
      } else if (/\s/.test(char)) {
        this.tokenizeWhitespace();
      } else {
        this.tokenizeText();
      }
    }

    return this.tokens;
  }

  private tokenizeTag() {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;

    // Handle opening bracket
    this.addToken(TokenType.TAG_OPEN, '<', start, start + 1, startLine, startColumn);
    this.advance();

    // Check for closing tag
    if (this.peek() === '/') {
      this.addToken(TokenType.TAG_SLASH, '/', this.position, this.position + 1, this.line, this.column);
      this.advance();
    }

    // Get tag name
    const tagStart = this.position;
    while (this.position < this.input.length && !/[\s>\/]/.test(this.peek())) {
      this.advance();
    }
    if (this.position > tagStart) {
      this.addToken(
        TokenType.TAG_NAME,
        this.input.slice(tagStart, this.position),
        tagStart,
        this.position,
        startLine,
        startColumn + (tagStart - start)
      );
    }

    // Handle attributes
    while (this.position < this.input.length && this.peek() !== '>' && this.peek() !== '/') {
      this.tokenizeAttribute();
    }

    // Handle self-closing tags
    if (this.peek() === '/') {
      this.addToken(TokenType.TAG_SLASH, '/', this.position, this.position + 1, this.line, this.column);
      this.advance();
    }

    // Handle closing bracket
    if (this.peek() === '>') {
      this.addToken(TokenType.TAG_CLOSE, '>', this.position, this.position + 1, this.line, this.column);
      this.advance();
    }
  }

  private tokenizeAttribute() {
    // Skip whitespace
    while (/\s/.test(this.peek())) {
      this.advance();
    }

    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;

    // Get attribute name
    while (this.position < this.input.length && !/[\s=>\/>]/.test(this.peek())) {
      this.advance();
    }

    if (this.position > start) {
      this.addToken(
        TokenType.ATTRIBUTE_NAME,
        this.input.slice(start, this.position),
        start,
        this.position,
        startLine,
        startColumn
      );
    }

    // Handle equals sign and value
    if (this.peek() === '=') {
      this.addToken(TokenType.EQUALS, '=', this.position, this.position + 1, this.line, this.column);
      this.advance();

      // Skip whitespace
      while (/\s/.test(this.peek())) {
        this.advance();
      }

      // Handle quoted values
      if (this.peek() === '"' || this.peek() === "'") {
        const quote = this.peek();
        const valueStart = this.position + 1;
        const valueStartLine = this.line;
        const valueStartColumn = this.column + 1;
        this.advance();

        while (this.position < this.input.length && this.peek() !== quote) {
          if (this.peek() === '\n') {
            this.line++;
            this.column = 1;
          }
          this.advance();
        }

        this.addToken(
          TokenType.ATTRIBUTE_VALUE,
          this.input.slice(valueStart, this.position),
          valueStart,
          this.position,
          valueStartLine,
          valueStartColumn
        );

        if (this.peek() === quote) {
          this.advance();
        }
      }
    }
  }

  private tokenizeText() {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;

    while (this.position < this.input.length && this.peek() !== '<') {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      this.advance();
    }

    const text = this.input.slice(start, this.position).trim();
    if (text) {
      this.addToken(TokenType.TEXT, text, start, this.position, startLine, startColumn);
    }
  }

  private tokenizeComment() {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;

    // Skip <!--
    this.position += 4;
    this.column += 4;

    const contentStart = this.position;
    while (
      this.position < this.input.length &&
      !(
        this.peek() === '-' &&
        this.peek(1) === '-' &&
        this.peek(2) === '>'
      )
    ) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      this.advance();
    }

    this.addToken(
      TokenType.COMMENT,
      this.input.slice(contentStart, this.position),
      start,
      this.position + 3,
      startLine,
      startColumn
    );

    // Skip -->
    this.position += 3;
    this.column += 3;
  }

  private tokenizeWhitespace() {
    const start = this.position;
    while (this.position < this.input.length && /\s/.test(this.peek())) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      this.advance();
    }
  }

  private advance(): void {
    this.position++;
    this.column++;
  }

  private peek(offset: number = 0): string {
    return this.input[this.position + offset] || '';
  }

  private addToken(
    type: TokenType,
    value: string,
    start: number,
    end: number,
    line: number,
    column: number
  ): void {
    this.tokens.push({
      type,
      value,
      position: {
        start,
        end,
        line,
        column
      }
    });
  }
}
