import { Navigate } from "react-router";
import { useAuthStore } from "../store/AuthStore";

type Props = {
  children: any;
  role?: "admin" | "agent";
};

export default function ProtectedRoute({ children, role }: Props) {
  const { token, user } = useAuthStore();

  if (!token) {
    return <Navigate to="/" />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}