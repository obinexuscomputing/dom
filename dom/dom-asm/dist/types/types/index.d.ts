export interface Token {
    type: string;
    value: string;
    position: number;
}
export interface HTMLToken extends Token {
    tagName?: string;
    attributes?: Record<string, string>;
}
export interface CSSToken extends Token {
    selector?: string;
    property?: string;
}
export interface ParserOptions {
    strict?: boolean;
    preserveWhitespace?: boolean;
}
