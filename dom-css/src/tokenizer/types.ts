export interface CSSToken {
    type: CSSTokenType;
    value: string;
    position: {
      start: number;
      end: number;
      line: number;
      column: number;
    };
  }
  
  export enum CSSTokenType {
    SELECTOR,
    PROPERTY,
    VALUE,
    BRACE_OPEN,
    BRACE_CLOSE,
    COLON,
    SEMICOLON,
    WHITESPACE,
    COMMENT
  }