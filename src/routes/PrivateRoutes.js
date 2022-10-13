import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/auth";
function PrivateRoutes({ children }) {
  const { currentUser } = useAuth();

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;
