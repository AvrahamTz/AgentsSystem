import { Link } from "react-router";
import "../styles/dashboard.css";

export default function AgentDashboard() {
  return (
    <div className="dashboard-container">

      <h2>Agent Dashboard</h2>

      <div className="dashboard-grid">

        <Link to="/new-report" className="dashboard-card">
          <h3>New Report</h3>
          <p>Create a new manual report</p>
        </Link>

        <Link to="/upload-csv" className="dashboard-card">
          <h3>Upload CSV</h3>
          <p>Import reports from CSV file</p>
        </Link>

        <Link to="/my-reports" className="dashboard-card">
          <h3>My Reports</h3>
          <p>View your submitted reports</p>
        </Link>

      </div>

    </div>
  );
}