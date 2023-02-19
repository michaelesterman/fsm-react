export const wizardMachineConfig = {
  initialState: "emailEntry",
  states: {
    emailEntry: {
      NEXT: "step2",
    },
    step2: {
      NEXT: "step3",
      BACK: "emailEntry",
    },
    step3: {
      BACK: "step2",
      SUBMIT: "submitting",
    },
    submitting: {
      SUBMIT_SUCCESS: "success",
      SUBMIT_FAILURE: "failure",
    },
    success: {},
    failure: {},
  },
};
