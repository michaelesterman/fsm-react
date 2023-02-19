import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { subscriptionMachine } from "../utils/subscriptionMachine";
import axios from "axios";
import { config } from "../configuration";

const SubscriptionForm = () => {
  const [state, send] = useMachine(subscriptionMachine);

  useEffect(() => {
    const getNewsletters = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/newsletters`);
        const result = response.data;
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

    try {
      const response = await axios.post(
        `${config.API_URL}/subscribe`,
        {
          email: state.context.email,
          newsletters: state.context.newsletters,
          agreedToTerms: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Success!");
        send("SUBSCRIBE_SUCCESS");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response.data.error ?? "Some error happened.";
      console.error(errorMessage);
      send({ type: "SUBSCRIBE_ERROR", error: errorMessage });
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

  const handleTermsChange = (e: any) => {
    const isChecked = e.target.checked;
    console.log(`Terms: ${isChecked}`);
    send({ type: "UPDATE_TERMS", isChecked });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {state.matches("error") && <p>{state.context.error}</p>}

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

        {state.matches("acceptTerms") && (
          <label htmlFor="terms">
            <input
              type="checkbox"
              id="terms"
              onChange={handleTermsChange}
              required
            />
            I agree to the terms and conditions.
          </label>
        )}

        {(state.matches("acceptTerms") ||
          state.matches("chooseNewsletters") ||
          state.matches("error")) && (
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

        {state.matches("acceptTerms") && (
          <button type="submit" disabled={state.matches("submitting")}>
            Subscribe
          </button>
        )}

        {state.matches("submitting") && <p>Submitting...</p>}
        {state.matches("success") && <p>Thank you for subscribing!</p>}
      </form>
    </>
  );
};

export default SubscriptionForm;
