interface ASTNode {
    type: string;
    children?: ASTNode[];
    value?: string;
}
interface ASTBuilder {
    build(input: string): ASTNode;
}
interface ASTOptimizer {
    optimize(node: ASTNode): ASTNode;
}

declare class HTMLASTBuilder implements ASTBuilder {
    build(input: string): ASTNode;
}

declare class HTMLASTOptimizer implements ASTOptimizer {
    optimize(node: ASTNode): ASTNode;
}

interface State {
    id: string;
    transitions: Map<string, State>;
    isAccepting: boolean;
}
interface Automaton {
    minimize(): void;
    addState(state: State): void;
    getStates(): Set<State>;
}

declare class HTMLAutomaton implements Automaton {
    private states;
    minimize(): void;
    addState(state: State): void;
    getStates(): Set<State>;
}

declare class CSSAutomaton implements Automaton {
    private states;
    minimize(): void;
    addState(state: State): void;
    getStates(): Set<State>;
}

declare class StateMinimizer {
    minimize(states: Set<State>): Set<State>;
}

declare class HTMLParser {
    parse(tokens: HTMLToken[]): {};
}

interface PPIConfig {
    mode: 'html' | 'css';
    optimize?: boolean;
}
interface PPI {
    process(input: string, config: PPIConfig): string;
}

declare class HTMLPPI implements PPI {
    process(input: string, config: PPIConfig): string;
}

declare class CSSPPI implements PPI {
    process(input: string, config: PPIConfig): string;
}

declare class CLIPPI implements PPI {
    process(input: string, config: PPIConfig): string;
}

declare function validateConfig(config: PPIConfig): boolean;

declare class CSSTokenizer {
    tokenize(input: string): Token[];
}

declare class HTMLTokenizer {
    tokenize(input: string): Token[];
}

interface Token$1 {
    type: string;
    value: string;
    position: number;
}

export { type ASTBuilder, type ASTNode, type ASTOptimizer, type Automaton, CLIPPI, CSSAutomaton, CSSPPI, CSSTokenizer, HTMLASTBuilder, HTMLASTOptimizer, HTMLAutomaton, HTMLPPI, HTMLParser, HTMLTokenizer, type PPI, type PPIConfig, type State, StateMinimizer, type Token$1 as Token, validateConfig };
