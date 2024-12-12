export class ProgramInterface {
  private htmlParser: typeof import('dom-html').HTMLParser;
  private cssParser: typeof import('dom-css').CSSParser;

  async initialize() {
    this.htmlParser = await import('dom-html');
    this.cssParser = await import('dom-css');
  }

  async parseHTML(input: string, options: ParserOptions = {}): Promise<ParseResult> {
    const parser = new this.htmlParser({
      optimize: options.optimize,
      sourceMap: options.sourceMap
    });
    return parser.parse(input);
  }

  async parseCSS(input: string, options: ParserOptions = {}): Promise<ParseResult> {
    const parser = new this.cssParser({
      optimize: options.optimize,
      sourceMap: options.sourceMap
    });
    return parser.parse(input);
  }
}
