export declare class ProgramInterface {
    private htmlParser;
    private cssParser;
    initialize(): Promise<void>;
    parseHTML(input: string, options?: ParserOptions): Promise<ParseResult>;
    parseCSS(input: string, options?: ParserOptions): Promise<ParseResult>;
}
