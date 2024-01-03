import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user.type === "manager") {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return children;
};
