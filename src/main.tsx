import React from "react";
import ReactDOM from "react-dom/client";
import { initializeBugsnag } from "components/ErrorBoundary";
import App from "./App";

initializeBugsnag();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
