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
};

export default function MyReportsPage() {
  const { token } = useAuthStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/reports/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading reports...</p>;

  return (
    <div className="reports-page">
      <h2>My Reports</h2>

      <table className="reports-table">
        <thead>
          <tr>
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