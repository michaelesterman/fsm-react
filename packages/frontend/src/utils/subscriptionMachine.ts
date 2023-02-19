import { createMachine, assign } from "xstate";

export const subscriptionMachine = createMachine(
  {
    predictableActionArguments: true,
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
          },
          UPDATE_EMAIL: {
            actions: ["updateEmail"],
          },
          SEED_NEWSLETTERS: {
            actions: ["seedNewsletters"],
          },
        },
      },
      chooseNewsletters: {
        on: {
          NEXT: {
            target: "acceptTerms",
          },
          UPDATE_NEWSLETTERS: {
            actions: ["updateNewsletters"],
          },
          BACK: "enterEmail",
        },
      },
      acceptTerms: {
        on: {
          UPDATE_TERMS: {
            actions: ["updateTermsAccepted"],
          },
          NEXT: {
            target: "submit",
            // actions: ["updateTermsAccepted"],
          },
          BACK: "chooseNewsletters",
          SUBSCRIBE_SUCCESS: {
            target: "success",
          },
          SUBSCRIBE_ERROR: {
            target: "error",
            actions: ["updateError"],
          },
        },
      },
      submit: {
        on: {
          SUBSCRIBE_SUCCESS: {
            target: "success",
          },
          SUBSCRIBE_ERROR: {
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
        email: (context, event: any) => {
          return event.email;
        },
      }),
      seedNewsletters: assign({
        newsletters: (context, event: any) => {
          console.log(event);
          console.log(`Seeding ${Date.now()}`);
          return event.newsletters;
        },
      }),
      updateNewsletters: assign({
        newsletters: (context, event: any) => {
          console.log(event);
          console.log(context.newsletters);

          const newsletterToUpdate = context.newsletters.find((newsletter) => {
            return newsletter._id === event.newsletter;
          });

          console.log(newsletterToUpdate);

          newsletterToUpdate.isChecked = event.isChecked;

          return context.newsletters;
        },
      }),
      updateTermsAccepted: assign({
        termsAccepted: true,
      }),
      updateError: assign({
        error: (context, event: any) => {
          console.error(event);
          return event.error;
        },
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
