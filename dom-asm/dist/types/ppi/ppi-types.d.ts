export interface ParserOptions {
    optimize?: boolean;
    minify?: boolean;
    sourceMap?: boolean;
}
export interface ParseResult {
    ast: ASTNode;
    sourceMap?: SourceMap;
    errors: ParseError[];
}
export interface ParseError {
    message: string;
    line: number;
    column: number;
}
