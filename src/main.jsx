import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.scss";
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./providers/UserContext/index.jsx";
import DocumentProvider from "./providers/DocumentContext/index.jsx";
import { ModelProvider } from "./providers/ModelContext/index.jsx";
import { AttendanceProvider } from "./providers/AttendanceContext/index.jsx";
import { StudentProvider } from "./providers/StudentContext/index.jsx"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <DocumentProvider>
          <ModelProvider>
            <AttendanceProvider>               
              <StudentProvider>
                <App />
              </StudentProvider>
            </AttendanceProvider>
          </ModelProvider>
        </DocumentProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);