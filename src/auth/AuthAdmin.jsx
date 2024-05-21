import React from "react";
import { useAuth } from "./AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthAdmin = () => {
  const { user, role } = useAuth();
  const location = useLocation();

  return user && role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} replace state={{ path: location.pathname }} />
  );
};

export default AuthAdmin;
