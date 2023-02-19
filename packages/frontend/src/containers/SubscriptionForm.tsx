import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { subscriptionMachine } from "../utils/subscriptionMachine";

const SubscriptionForm = () => {
  const [state, send] = useMachine(subscriptionMachine);

  useEffect(() => {
    const getNewsletters = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/newsletters");
        const result = await response.json();
        return result;
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    getNewsletters().then((newsletters) => {
      send({ type: "SEED_NEWSLETTERS", newsletters });
    });
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: state.context.email,
        newsletters: state.context.newsletters,
        agreedToTerms: true,
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

  // const newsletters = [
  //   { id: "1", title: "Newsletter 1", checked: true },
  //   { id: "2", title: "Newsletter 2" },
  //   { id: "3", title: "Newsletter 3" },
  // ];

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

            {state.context.newsletters.map(({ _id, title, isChecked }) => (
              <label key={_id} htmlFor={`${_id}`}>
                <input
                  type="checkbox"
                  id={_id}
                  value={_id}
                  checked={isChecked || false}
                  // disabled={isChecked}
                  onChange={handleNewsletterChange}
                />
                {title}
              </label>
            ))}
          </fieldset>
        )}

        {(state.matches("acceptTerms") ||
          state.matches("chooseNewsletters")) && (
          <button type="button" onClick={() => send("BACK")}>
            Back
          </button>
        )}

        {(state.matches("enterEmail") ||
          state.matches("chooseNewsletters")) && (
          <button type="button" onClick={() => send("NEXT")}>
            Next
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
