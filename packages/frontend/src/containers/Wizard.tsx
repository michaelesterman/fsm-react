import React, { useEffect, useState } from "react";
import { wizardMachineConfig } from "../utils/WizardMachine";
import { useMachine } from "../utils/useMachine";
import axios from "axios";
import { config } from "../configuration";

const Wizard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newsletters, setNewsletters] = useState([]);
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

  return (
    <div>
      {current.match("step1") && <div>Step 1</div>}

      {current.match("step2") && loading && <div>Loading...</div>}

      {current.match("step2") &&
        newsletters.map((newsletter) => (
          <div key={newsletter._id}>{newsletter.title}</div>
        ))}

      <button onClick={() => send("NEXT")}>Next</button>
    </div>
  );
};

export default Wizard;
