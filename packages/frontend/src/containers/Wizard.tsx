import React, { useEffect, useState } from "react";
import { wizardMachineConfig } from "../utils/WizardMachine";
import { useMachine } from "../utils/useMachine";
import axios from "axios";
import { config } from "../configuration";

const Wizard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newsletters, setNewsletters] = useState([]);
  const [email, setEmail] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [current, send] = useMachine(wizardMachineConfig);

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
      const response = await axios.post(
        `${config.API_URL}/subscribe`,
        {
          email,
          newsletters,
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
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response.data.error ?? "Some error happened.";
      setError(errorMessage);
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
        {current.match("emailEntry") && (
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

        {current.match("step2") && loading && <div>Loading...</div>}

        {current.match("step2") && (
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

        {current.match("step3") && (
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

        <button type="button" onClick={() => send("BACK")}>
          Back
        </button>

        <button type="button" onClick={() => send("NEXT")}>
          Next
        </button>
      </form>
    </div>
  );
};

export default Wizard;
