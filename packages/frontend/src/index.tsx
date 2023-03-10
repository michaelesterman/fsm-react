import React from "react";
import { createRoot } from "react-dom/client";
import SubscriptionForm from "./containers/SubscriptionForm";
import "./styles/style.less";

const App = () => {
  return (
    <div>
      <SubscriptionForm />
    </div>
  );
};

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
