export interface State {
    id: string;
    transitions: Map<string, State>;
    isAccepting: boolean;
}
export interface Automaton {
    minimize(): void;
    addState(state: State): void;
    getStates(): Set<State>;
}
