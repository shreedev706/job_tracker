import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../features/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

 
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  
  return <>{children}</>;
};

export default ProtectedRoute;
