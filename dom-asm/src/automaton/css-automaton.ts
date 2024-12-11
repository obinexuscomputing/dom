import { State, Automaton } from './automaton-types';

export class CSSAutomaton implements Automaton {
  private states: Set<State> = new Set();

  minimize(): void {
    // Implementation will be added
  }

  addState(state: State): void {
    this.states.add(state);
  }

  getStates(): Set<State> {
    return this.states;
  }
}