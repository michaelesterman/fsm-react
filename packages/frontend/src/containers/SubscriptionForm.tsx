import React from "react";
import { useMachine } from "@xstate/react";
import { subscriptionMachine } from "../utils/subscriptionMachine";

const SubscriptionForm = () => {
  const [state, send] = useMachine(subscriptionMachine);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: state.context.email,
        newsletters: state.context.newsletters,
      }),
    });

    if (response.ok) {
      send("SUBSCRIBE_SUCCESS");
    } else {
      send("SUBSCRIBE_FAILURE");
    }
  };

  const handleEmailChange = (e: any) => {
    console.log(e.target.value);
    send({ type: "UPDATE_EMAIL", email: e.target.value });
    console.log(`In state: ${state.context.email}`);
  };

  const handleNewsletterChange = (e: any) => {
    const newsletter = e.target.value;
    const isChecked = e.target.checked;

    console.log(`Newsletter: ${newsletter}, isChecked: ${isChecked}`);

    send({ type: "UPDATE_NEWSLETTERS", newsletter, isChecked });
  };

  const newsletters = [
    { id: "1", title: "Newsletter 1" },
    { id: "2", title: "Newsletter 2" },
    { id: "3", title: "Newsletter 3" },
  ];

  return (
    <>
      <form onSubmit={handleSubmit}>
        {state.matches("enterEmail") && (
          <>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              onChange={handleEmailChange}
              required
            />
          </>
        )}

        {state.matches("chooseNewsletters") && (
          <fieldset>
            <legend>Newsletters:</legend>

            {newsletters.map(({ id, title }) => (
              <label key={id} htmlFor={`${id}`}>
                <input
                  type="checkbox"
                  id={id}
                  value={id}
                  onChange={handleNewsletterChange}
                />
                {title}
              </label>
            ))}
          </fieldset>
        )}

        {(state.matches("enterEmail") ||
          state.matches("chooseNewsletters")) && (
          <button type="button" onClick={() => send("NEXT")}>
            NEXT
          </button>
        )}

        {state.matches("submitting") && <p>Submitting...</p>}
        {state.matches("success") && <p>Thank you for subscribing!</p>}
        {state.matches("failure") && (
          <p>Subscription failed. Please try again.</p>
        )}

        {state.matches("acceptTerms") && (
          <button type="submit" disabled={state.matches("submitting")}>
            Subscribe
          </button>
        )}
      </form>
    </>
  );
};

export default SubscriptionForm;
