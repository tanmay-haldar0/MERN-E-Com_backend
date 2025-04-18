import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProtectedRoute = ({ role, children, redirectTo, roleMismatchMessage }) => {
  const { isAuthenticated, userRole } = useSelector((state) => ({
    isAuthenticated: state.user.isAuthenticated || state.seller.isAuthenticated,
    userRole: state.user.role || state.seller.role,
  }));

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  if (role && role !== userRole) {
    toast.error(roleMismatchMessage);
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default ProtectedRoute;
