export interface Token {
    type: TokenType;
    value: string;
    position: {
      start: number;
      end: number;
      line: number;
      column: number;
    };
  }
  
  export enum TokenType {
    TAG_OPEN,
    TAG_CLOSE,
    TAG_SLASH,
    TAG_NAME,
    ATTRIBUTE_NAME,
    ATTRIBUTE_VALUE,
    EQUALS,
    TEXT,
    WHITESPACE,
    COMMENT
  }
  
  // dom-html/src/tokenizer/html-tokenizer.ts
  import { Token, TokenType } from './types';
  
  export class HTMLTokenizer {
    private input: string;
    private position: number;
    private line: number;
    private column: number;
  
    constructor() {
      this.input = '';
      this.position = 0;
      this.line = 1;
      this.column = 1;
    }
  
    tokenize(input: string): Token[] {
      this.input = input;
      this.position = 0;
      this.line = 1;
      this.column = 1;
      
      const tokens: Token[] = [];
      
      while (this.position < this.input.length) {
        // Add token processing logic here
        const token = this.nextToken();
        if (token) {
          tokens.push(token);
        }
      }
      
      return tokens;
    }
  
    private nextToken(): Token | null {
      // Token processing implementation
      return null;
    }
  }
  
  // dom-html/src/ast/types.ts
  export interface ASTNode {
    type: NodeType;
    value?: string;
    children?: ASTNode[];
    attributes?: Map<string, string>;
    position?: {
      start: number;
      end: number;
      line: number;
      column: number;
    };
  }
  
  export enum NodeType {
    ROOT = 'root',
    ELEMENT = 'element',
    TEXT = 'text',
    COMMENT = 'comment'
  }