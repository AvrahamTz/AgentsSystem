import { Navigate } from "react-router";

type Props = {
  user: any;
  children: React.ReactNode;
};

export default function ProtectedRoute({ user, children }: Props) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}