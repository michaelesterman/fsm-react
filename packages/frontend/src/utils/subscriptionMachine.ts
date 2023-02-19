import { createMachine, assign } from "xstate";

export const subscriptionMachine = createMachine(
  {
    id: "subscription",
    initial: "enterEmail",
    context: {
      email: "",
      newsletters: [],
      termsAccepted: false,
      error: null,
    },
    states: {
      enterEmail: {
        on: {
          NEXT: {
            target: "chooseNewsletters",
            actions: ["updateEmail"],
          },
        },
      },
      chooseNewsletters: {
        on: {
          NEXT: {
            target: "acceptTerms",
            actions: ["updateNewsletters"],
          },
          BACK: "enterEmail",
        },
      },
      acceptTerms: {
        on: {
          NEXT: {
            target: "submit",
            actions: ["updateTermsAccepted"],
          },
          BACK: "chooseNewsletters",
        },
      },
      submit: {
        invoke: {
          src: "submitSubscription",
          onDone: {
            target: "success",
            actions: ["clearForm"],
          },
          onError: {
            target: "error",
            actions: ["updateError"],
          },
        },
      },
      success: {
        type: "final",
      },
      error: {
        on: {
          RETRY: "submit",
          BACK: {
            target: "acceptTerms",
            actions: ["clearError"],
          },
        },
      },
    },
  },
  {
    actions: {
      updateEmail: assign({
        email: (context, event: any) => (context.email = event.value),
      }),
      updateNewsletters: assign({
        newsletters: (context, event: any) =>
          (context.newsletters = event.newsletters),
      }),
      updateTermsAccepted: assign({
        termsAccepted: true,
      }),
      updateError: assign({
        error: (context, event: any) => event.data,
      }),
      clearForm: assign({
        email: "",
        newsletters: [],
        termsAccepted: false,
        error: null,
      }),
      clearError: assign({
        error: null,
      }),
    },
    services: {
      submitForm: (context) => {
        const { email, newsletters, termsAccepted } = context;
        return fetch("/api/subscribe", {
          method: "POST",
          body: JSON.stringify({ email, newsletters, termsAccepted }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      },
    },
  }
);
