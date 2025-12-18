import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const RoleRedirect = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "Admin") return <Navigate to="/dashboard/admin" replace />;
  if (user.role === "Creator")
    return <Navigate to="/dashboard/creator" replace />;
  return <Navigate to="/dashboard/user" replace />;
};

export default RoleRedirect;
