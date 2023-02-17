import React from "react";
import { createRoot } from 'react-dom/client';

const App = () => {
  return (
    <div>
      <h1>Hello World!</h1>
    </div>
  );
};

const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);