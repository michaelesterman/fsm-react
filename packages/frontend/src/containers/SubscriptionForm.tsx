import React, { useEffect, useState } from "react";
import { subscriptionMachineConfig } from "../utils/subscriptionMachine";
import { useMachine } from "../utils/useMachine";
import axios from "axios";
import { config } from "../configuration";

const SubscriptionForm = () => {
  const [loading, setLoading] = useState(true);
  const [newsletters, setNewsletters] = useState([]);
  const [email, setEmail] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [error, setError] = useState(
    "Something wrong happened. Please try again later"
  );
  const [success, setSuccess] = useState("You've suscribed successfully!");

  const [current, send] = useMachine(subscriptionMachineConfig);

  useEffect(() => {
    let ignore = false;

    const getNewsletters = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/newsletters`);
        const result = response.data;

        if (!ignore) {
          console.log(result);
          setNewsletters(result);
          setLoading(false);
        }
        return () => (ignore = true);
      } catch (error) {
        console.error(error);
        setError("Can't load newsletters");
        return null;
      }
    };

    getNewsletters();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      send("SUBMIT");

      const response = await axios.post(
        `${config.API_URL}/subscribe`,
        {
          email,
          newsletters,
          agreedToTerms: agreement,
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
      setError(error.response.data.error ?? "Some error happened.");
      send("SUBSCRIBE_ERROR");
    }
  };

  const handleEmailChange = (e: any) => {
    console.log(e.target.value);
    setEmail(e.target.value);
    console.log(`In state: ${email}`);
  };

  const handleNewsletterChange = (e: any) => {
    const newsletter = e.target.value;
    const isChecked = e.target.checked;

    console.log(e.target);

    console.log(`Newsletter: ${newsletter}, isChecked: ${isChecked}`);

    const nextNewsletters = newsletters.map((newsletter) => {
      if (newsletter._id === e.target.id) {
        return { ...newsletter, isChecked };
      }
      return newsletter;
    });

    console.log(nextNewsletters);

    setNewsletters(nextNewsletters);
  };

  const handleAgreementChange = (e: any) => {
    const isChecked = e.target.checked;
    console.log(`Terms: ${isChecked}`);
    setAgreement(isChecked);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {current.match("enterEmail") && (
          <>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              onChange={handleEmailChange}
              value={email}
              required
            />
          </>
        )}

        {current.match("error") && <div>{error}</div>}
        {current.match("success") && <div>{success}</div>}

        {current.match("chooseNewsletters") && loading && <div>Loading...</div>}
        {current.match("submitting") && loading && <div>Submitting...</div>}

        {current.match("chooseNewsletters") && (
          <fieldset>
            <legend>Newsletters:</legend>

            {newsletters.map(({ _id, title, isChecked }) => (
              <label key={_id} htmlFor={`${_id}`}>
                <input
                  type="checkbox"
                  id={_id}
                  value={_id}
                  checked={isChecked || false}
                  onChange={handleNewsletterChange}
                />
                {title}
              </label>
            ))}
          </fieldset>
        )}

        {current.match("acceptTerms") && (
          <label htmlFor="terms">
            <input
              type="checkbox"
              id="terms"
              checked={agreement || false}
              onChange={handleAgreementChange}
              required
            />
            I agree to the terms and conditions.
          </label>
        )}

        {(current.match("acceptTerms") ||
          current.match("chooseNewsletters") ||
          current.match("failure")) && (
          <button type="button" onClick={() => send("BACK")}>
            Back
          </button>
        )}

        {(current.match("enterEmail") ||
          current.match("chooseNewsletters")) && (
          <button type="button" onClick={() => send("NEXT")}>
            Next
          </button>
        )}

        {current.match("acceptTerms") && (
          <button type="submit" disabled={current.match("submitting")}>
            Subscribe
          </button>
        )}
      </form>
    </div>
  );
};

export default SubscriptionForm;
