import { State, Automaton } from './automaton-types';
export declare class HTMLAutomaton implements Automaton {
    private states;
    minimize(): void;
    addState(state: State): void;
    getStates(): Set<State>;
}
