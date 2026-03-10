import { Link } from "react-router";
import "../styles/dashboard.css";

export default function AdminDashboard() {
  return (
    <div className="dashboard-container">

      <h2>Admin Dashboard</h2>

      <div className="dashboard-grid">

        <Link to="/admin/users" className="dashboard-card">
          <h3>Manage Users</h3>
          <p>Create and view system users</p>
        </Link>

        <Link to="/admin/reports" className="dashboard-card">
          <h3>All Reports</h3>
          <p>View and filter all reports</p>
        </Link>

      </div>

    </div>
  );
}