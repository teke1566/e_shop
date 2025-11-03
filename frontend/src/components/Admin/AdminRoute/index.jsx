import React from "react";
import { Navigate } from "react-router-dom";
import { hasRole } from "../../../utils/auth";

const AdminRoute = ({ children }) => {
  if (!hasRole("ROLE_ADMIN")) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default AdminRoute;
