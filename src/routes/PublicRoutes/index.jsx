import { useContext } from "react";
import { UserContext } from "../../providers/UserContext";
import { Navigate, Outlet } from "react-router-dom";

export const PublicRoutes = () => {
  const { user, loading } = useContext(UserContext);

  
  if (loading) {
    return null; 
  }

  return !user ? <Outlet /> : <Navigate to="/dashboard" />;
};