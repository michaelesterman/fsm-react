import React, { useEffect, useState } from "react";
import { wizardMachineConfig } from "../utils/WizardMachine";
import { useMachine } from "../utils/useMachine";

const Wizard = () => {
  const [current, send] = useMachine(wizardMachineConfig);

  return (
    <>
      <div>Wizard</div>

      {current}

      <button onClick={() => send("NEXT")}>Next</button>
    </>
  );
};

export default Wizard;
