import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ErrorPage } from "../pages/ErrorPage";
import { PublicRoutes } from "./PublicRoutes";
import { PrivateRoutes } from "./PrivateRoutes";
import { ModelListPage } from "../pages/ModelListPage";
import { AttendancePage } from "../pages/AttendancePage";
import { AttendanceTrackingPage } from "../pages/AttendanceTrackingPage";
import { AttendanceRegisterPage } from "../pages/AttendanceRegisterPage";
import { AttendanceOverviewPage } from "../pages/AttendanceOverviewPage";
import UploadPage from "../pages/UploadPage/UploadPage";
import { ClassroomManagementPage } from "../pages/ClassroomManagementPage";

import { StudentManagementPage } from "../pages/StudentManagementPage"; 
import { UserManagementPage as TeacherManagementPage } from "../pages/TeacherManagementPage"; 

export const RoutesMain = () => {
  return (
    <Routes>
      <Route element={<PublicRoutes />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<PrivateRoutes />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/classroom-management" element={<ClassroomManagementPage />} />
        <Route path="/teacher-management" element={<TeacherManagementPage />} />
        <Route path="/student-management" element={<StudentManagementPage />} />
        
        <Route path="/models" element={<ModelListPage />} />
        <Route path="/attendancetracking" element={<AttendanceTrackingPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/attendanceregister" element={<AttendanceRegisterPage />} />
        <Route path="/attendanceoverview" element={<AttendanceOverviewPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Route>

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};