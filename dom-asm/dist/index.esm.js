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

function validateConfig(config) {
    return config.mode === 'html' || config.mode === 'css';
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

export { CLIPPI, CSSAutomaton, CSSPPI, CSSTokenizer, HTMLASTBuilder, HTMLASTOptimizer, HTMLAutomaton, HTMLPPI, HTMLParser, HTMLTokenizer, StateMinimizer, validateConfig };
//# sourceMappingURL=index.esm.js.map
