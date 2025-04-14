import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "./styles/global.scss";

export const baseUrl = import.meta.env.VITE_BASE_URL;

import { ContextProvider } from "./context/Context";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </StrictMode>,
);
