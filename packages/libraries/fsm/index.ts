function createMachine(flowDefinition) {
  return {
    initial: flowDefinition.initial,
    states: flowDefinition.states,
    transition(currentState, event) {
      const transition = currentState.transitions[event.type];
      if (transition) {
        const nextState = this.states[transition.target];
        const actions = transition.actions || [];
        const context = {
          ...currentState.context,
          ...nextState.context,
        };
        actions.forEach((action) => {
          context[action.assign] = action.value;
        });
        return {
          state: nextState,
          context,
        };
      } else {
        throw new Error(
          `Invalid transition: ${currentState.id} -> ${event.type}`
        );
      }
    },
  };
}

function assign(key, value) {
  return {
    assign: key,
    value,
  };
}
