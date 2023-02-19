import { useReducer } from "react";

const buildMachineReducer =
  (config: any) => (currentState: any, event: any) => {
    try {
      const stateTransitions = config.states[currentState];

      if (stateTransitions === undefined) {
        throw new Error(`No transitions defined for ${currentState}`);
      }

      const nextState = stateTransitions[event];

      if (nextState === undefined) {
        throw new Error(
          `Unknown transition for event ${event} in state ${currentState}`
        );
      }

      return nextState;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

export const useMachine = (config: any) => {
  return useReducer(buildMachineReducer(config), config.initialState);
};
