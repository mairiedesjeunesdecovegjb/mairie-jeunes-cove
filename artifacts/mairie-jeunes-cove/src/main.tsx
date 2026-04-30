import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@workspace/api-client-react";

const apiUrl = import.meta.env.VITE_API_URL;
if (apiUrl) {
  setBaseUrl(apiUrl);
}

// Include credentials (cookies) with every API request
const originalFetch = window.fetch;
window.fetch = (input, init) => {
  return originalFetch(input, {
    credentials: "include",
    ...init,
  });
};

createRoot(document.getElementById("root")!).render(<App />);
