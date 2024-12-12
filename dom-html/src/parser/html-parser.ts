import { HTMLTokenizer } from '../tokenizer/html-tokenizer';
import { HTMLASTBuilder } from '../ast/html-ast-builder';
import { Token } from '../tokenizer/types';
import { ASTNode } from '../ast/types';

export interface ParserOptions {
  preserveWhitespace?: boolean;
  comments?: boolean;
  sourceMap?: boolean;
}

export interface ParseResult {
  ast: ASTNode;
  tokens: Token[];
  errors: ParseError[];
}

export interface ParseError {
  message: string;
  line: number;
  column: number;
}

export class HTMLParser {
  private tokenizer: HTMLTokenizer;
  private astBuilder: HTMLASTBuilder;
  private options: ParserOptions;

  constructor(options: ParserOptions = {}) {
    this.tokenizer = new HTMLTokenizer();
    this.astBuilder = new HTMLASTBuilder();
    this.options = options;
  }

  parse(input: string): ParseResult {
    const tokens = this.tokenizer.tokenize(input);
    const ast = this.astBuilder.build(tokens);
    
    return {
      ast,
      tokens,
      errors: []
    };
  }
}
