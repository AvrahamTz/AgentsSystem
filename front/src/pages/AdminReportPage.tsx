import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import "../styles/reports.css";

type Report = {
  _id: string;
  category: string;
  urgency: string;
  message: string;
  sourceType: string;
  createdAt: string;
  userId: string;
};

export default function AdminReportsPage() {
  const { token } = useAuthStore();

  const [reports, setReports] = useState<Report[]>([]);
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("");

  const fetchReports = () => {
    const params = new URLSearchParams();

    if (category) params.append("category", category);
    if (urgency) params.append("urgency", urgency);

    fetch(`http://localhost:3000/reports?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setReports);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="reports-page">
      <h2>Admin Reports</h2>

      <div className="filters">

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="intelligence">intelligence</option>
          <option value="logistics">logistics</option>
          <option value="alert">alert</option>
        </select>

        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
        >
          <option value="">All Urgency</option>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>

        <button onClick={fetchReports}>Filter</button>

      </div>

      <table className="reports-table">
        <thead>
          <tr>
            <th>Agent</th>
            <th>Category</th>
            <th>Urgency</th>
            <th>Message</th>
            <th>Source</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td>{report.userId}</td>
              <td>{report.category}</td>
              <td>{report.urgency}</td>
              <td>{report.message}</td>
              <td>{report.sourceType}</td>
              <td>{new Date(report.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {reports.length === 0 && <p>No reports found.</p>}
    </div>
  );
}