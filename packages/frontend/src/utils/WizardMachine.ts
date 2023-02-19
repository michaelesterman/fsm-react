export const wizardMachineConfig = {
  // we start disconnected
  initialState: "step1",
  states: {
    step1: {
      NEXT: "step2",
    },
    step2: {
      NEXT: "step3",
    },
    step3: {},
  },
};
