import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../loading/Loading";
import { Navigate, useLocation } from "react-router-dom";

const PrivetRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If no allowedRoles specified, allow any logged-in user
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user.role is in allowedRoles
  if (!allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard or home
    const redirectPath =
      user.role === "Admin"
        ? "/dashboard/admin"
        : user.role === "Creator"
        ? "/dashboard/creator"
        : "/dashboard/user";

    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PrivetRoute;
