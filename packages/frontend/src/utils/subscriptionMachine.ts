export const subscriptionMachineConfig = {
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
      SUBSCRIBE_SUCCESS: "success",
      SUBSCRIBE_ERROR: "error",
    },
    success: {},
    error: {},
  },
};
