import AgentDashboard from "./AgentDashboard";
import AdminDashboard from "./AdminDashboard";
import { useAuthStore } from "../store/AuthStore";

export default function Dashboard() {

  const { user } = useAuthStore();

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  return <AgentDashboard />;
}