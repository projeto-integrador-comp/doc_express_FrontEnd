import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../../providers/UserContext";

export const PrivateRoutes = () => {
  const { user, loading } = useContext(UserContext);
  
  if (loading) {
    return null; 
  }
 
  return user ? <Outlet /> : <Navigate to="/" />;
};