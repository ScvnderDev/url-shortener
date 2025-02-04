import { useAuthStore } from "@/stores/auth.store";
import { ReactNode } from "react";

import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { accessToken } = useAuthStore(); // Check if accessToken exists in cookies

  if (!accessToken) {
    // If no accessToken, redirect to /auth
    return <Navigate to="/auth" replace />;
  }

  // If accessToken exists, render the children (protected component)
  return <>{children}</>;
};

export default ProtectedRoute;
