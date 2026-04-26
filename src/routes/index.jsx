import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ErrorPage } from "../pages/ErrorPage";
import { PublicRoutes } from "./PublicRoutes";
import { PrivateRoutes } from "./PrivateRoutes";
import { ModelListPage } from "../pages/ModelListPage";
import { AttendancePage } from "../pages/AttendancePage";
import UploadPage from "../pages/UploadPage/UploadPage";
import { AdminManagementPage } from "../pages/AdminManagementPage";

export const RoutesMain = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route element={<PublicRoutes />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Rotas Privadas */}
      <Route element={<PrivateRoutes />}>
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/models" element={<ModelListPage />} />    
        <Route path="/admin/management" element={<AdminManagementPage />} />    
      </Route>

      <Route element={<PrivateRoutes />}>
        <Route path="/upload" element={<UploadPage />} />
      </Route>

      {/* Fallback de Erro */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};