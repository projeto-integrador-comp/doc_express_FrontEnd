import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.scss";
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./providers/UserContext/index.jsx";
import DocumentProvider from "./providers/DocumentContext/index.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <DocumentProvider>
          <App />
        </DocumentProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
