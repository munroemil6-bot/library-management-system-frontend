import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, ready } = useAuth();

  // Still verifying session — render nothing to avoid flash
  if (!ready) return null;

  if (!user) return <Navigate to="/login" replace />;

  // Extra guard — if someone manually edits localStorage to fake admin role
  if (adminOnly && user.role !== "admin") return <Navigate to="/profile" replace />;

  return children;
}
