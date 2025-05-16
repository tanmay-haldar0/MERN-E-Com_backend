// components/ProtectedRoutes.js
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.admin);
  // console.log(loading);
  // console.log(isAuthenticated);

  if (loading) return null; // Avoid redirect during loading

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
