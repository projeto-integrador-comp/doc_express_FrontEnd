import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ErrorPage } from "../pages/ErrorPage";
import { PublicRoutes } from "./PublicRoutes";
import { PrivateRoutes } from "./PrivateRoutes";
import { ModelListPage } from "../pages/ModelListPage";
import UploadPage from "../pages/UploadPage/UploadPage";

export const RoutesMain = () => {
  return (
    <Routes>
      <Route element={<PublicRoutes />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/models" element={<ModelListPage />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route path="/upload" element={<UploadPage />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};
