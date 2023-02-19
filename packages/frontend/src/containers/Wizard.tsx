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

    console.log(`Newsletter: ${newsletter}, isChecked: ${isChecked}`);

    // send({ type: "UPDATE_NEWSLETTERS", newsletter, isChecked });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {current.match("step1") && <div>Step 1</div>}

        {current.match("step1") && (
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
                  checked={isChecked}
                  onChange={handleNewsletterChange}
                />
                {title}
              </label>
            ))}
          </fieldset>
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
