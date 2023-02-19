import React from "react";
import { createRoot } from "react-dom/client";
import Wizard from "./containers/Wizard";

const App = () => {
  return (
    <div>
      <h1>Hello World!</h1>

      <Wizard />
    </div>
  );
};

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
