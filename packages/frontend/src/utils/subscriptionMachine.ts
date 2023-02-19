import { createMachine, assign } from "xstate";

export const subscriptionMachine = createMachine(
  {
    predictableActionArguments: true,
    id: "subscription",
    initial: "enterEmail",
    context: {
      email: "",
      newsletters: {},
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
        email: (context, event: any) => {
          return event.email;
        },
      }),
      updateNewsletters: assign({
        newsletters: (context, event: any) => {
          console.log(event);
          console.log(context.newsletters);

          return {
            ...context.newsletters,
            [event.newsletter]: event.isChecked,
          };
          // console.log(event);
          // console.log(context.newsletters);
          // const newsletterInContext = context.newsletters.find(
          //   (n) =>
          // );
          // if (event.isChecked && !newsletterInContext) {
          //   return [...context.newsletters, event.newsletter];
          // } else if (!event.isChecked && newsletterInContext) {
          //   return context.newsletters.filter((n) => n !== event.newsletter);
          // }
          // return context.newsletters;
        },
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
