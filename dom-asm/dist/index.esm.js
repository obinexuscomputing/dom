class HTMLASTBuilder {
    build(input) {
        // Implementation will be added
        return { type: 'root' };
    }
}

class HTMLASTOptimizer {
    optimize(node) {
        // Implementation will be added
        return node;
    }
}

class HTMLAutomaton {
    constructor() {
        this.states = new Set();
    }
    minimize() {
        // Implementation will be added
    }
    addState(state) {
        this.states.add(state);
    }
    getStates() {
        return this.states;
    }
}

class CSSAutomaton {
    constructor() {
        this.states = new Set();
    }
    minimize() {
        // Implementation will be added
    }
    addState(state) {
        this.states.add(state);
    }
    getStates() {
        return this.states;
    }
}

class StateMinimizer {
    minimize(states) {
        // Implementation will be added
        return states;
    }
}

class HTMLParser {
    parse(tokens) {
        return {};
    }
}

class HTMLPPI {
    process(input, config) {
        // Implementation will be added
        return input;
    }
}

class CSSPPI {
    process(input, config) {
        // Implementation will be added
        return input;
    }
}

class CLIPPI {
    process(input, config) {
        // Implementation will be added
        return input;
    }
}

class ProgramInterface {
    async initialize() {
        this.htmlParser = await import('dom-html');
        this.cssParser = await import('dom-css');
    }
    async parseHTML(input, options = {}) {
        const parser = new this.htmlParser({
            optimize: options.optimize,
            sourceMap: options.sourceMap
        });
        return parser.parse(input);
    }
    async parseCSS(input, options = {}) {
        const parser = new this.cssParser({
            optimize: options.optimize,
            sourceMap: options.sourceMap
        });
        return parser.parse(input);
    }
}

class CSSTokenizer {
    tokenize(input) {
        // Implementation will be added
        return [];
    }
}

class HTMLTokenizer {
    tokenize(input) {
        // Implementation will be added
        return [];
    }
}

export { CLIPPI, CSSAutomaton, CSSPPI, CSSTokenizer, HTMLASTBuilder, HTMLASTOptimizer, HTMLAutomaton, HTMLPPI, HTMLParser, HTMLTokenizer, ProgramInterface, StateMinimizer };
//# sourceMappingURL=index.esm.js.map
