import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ErrorPage } from "../pages/ErrorPage";
import { DocumentProvider } from "../providers/DocumentContext";

export const RoutesMain = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <DocumentProvider>
        <Route path="/dashboard" element={<DashboardPage />} />
      </DocumentProvider>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};
