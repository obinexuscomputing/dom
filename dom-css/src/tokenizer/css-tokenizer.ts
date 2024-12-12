import { CSSToken, CSSTokenType } from './types';

export class CSSTokenizer {
  private input: string;
  private position: number;
  private line: number;
  private column: number;
  private tokens: CSSToken[];

  constructor() {
    this.input = '';
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }

  tokenize(input: string): CSSToken[] {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];

    while (this.position < this.input.length) {
      const char = this.peek();

      if (/[a-zA-Z#._-]/.test(char)) {
        this.tokenizeSelector();
      } else if (char === '{') {
        this.addToken(CSSTokenType.BRACE_OPEN, '{');
        this.advance();
      } else if (char === '}') {
        this.addToken(CSSTokenType.BRACE_CLOSE, '}');
        this.advance();
      } else if (char === ':') {
        this.addToken(CSSTokenType.COLON, ':');
        this.advance();
      } else if (char === ';') {
        this.addToken(CSSTokenType.SEMICOLON, ';');
        this.advance();
      } else if (char === '/' && this.peek(1) === '*') {
        this.tokenizeComment();
      } else if (/\s/.test(char)) {
        this.tokenizeWhitespace();
      } else {
        this.tokenizePropertyOrValue();
      }
    }

    return this.tokens;
  }

  private tokenizeSelector() {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;

    while (
      this.position < this.input.length &&
      !/[\s{]/.test(this.peek())
    ) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      this.advance();
    }

    this.addToken(
      CSSTokenType.SELECTOR,
      this.input.slice(start, this.position),
      start,
      this.position,
      startLine,
      startColumn
    );
  }

  private tokenizePropertyOrValue() {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;

    while (
      this.position < this.input.length &&
      !/[;:{}]/.test(this.peek()) &&
      !/\s/.test(this.peek())
    ) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      this.advance();
    }

    const content = this.input.slice(start, this.position);
    if (content) {
      // Determine if this is a property or value based on context
      const type = this.isProperty() ? CSSTokenType.PROPERTY : CSSTokenType.VALUE;
      this.addToken(type, content, start, this.position, startLine, startColumn);
    }
  }

  private isProperty(): boolean {
    // Look backwards to determine if we're in a property context
    let pos = this.position - 1;
    while (pos >= 0 && /\s/.test(this.input[pos])) {
      pos--;
    }
    return this.input[pos] === '{' || this.input[pos] === ';';
  }

  private tokenizeComment() {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;

    // Skip /*
    this.position += 2;
    this.column += 2;

    while (
      this.position < this.input.length &&
      !(this.peek() === '*' && this.peek(1) === '/')
    ) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      this.advance();
    }

    this.addToken(
      CSSTokenType.COMMENT,
      this.input.slice(start + 2, this.position),
      start,
      this.position + 2,
      startLine,
      startColumn
    );

    // Skip */
    this.position += 2;
    this.column += 2;
  }

  private tokenizeWhitespace() {
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
    type: CSSTokenType,
    value: string,
    start?: number,
    end?: number,
    line?: number,
    column?: number
  ): void {
    this.tokens.push({
      type,
      value,
      position: {
        start: start ?? this.position,
        end: end ?? this.position + value.length,
        line: line ?? this.line,
        column: column ?? this.column
      }
    });
  }
}