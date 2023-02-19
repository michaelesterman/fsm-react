export const wizardMachineConfig = {
  initialState: "enterEmail",
  states: {
    enterEmail: {
      NEXT: "chooseNewsletters",
    },
    chooseNewsletters: {
      NEXT: "acceptTerms",
      BACK: "enterEmail",
    },
    acceptTerms: {
      BACK: "chooseNewsletters",
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
