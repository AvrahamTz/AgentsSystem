import { useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import "../styles/csvUpload.css";

export default function CSVUploadPage() {
  const { token } = useAuthStore();

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a CSV file");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("csvFile", file);

      const res = await fetch("http://localhost:3000/reports/csv", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage(`Imported ${data.importedCount} reports successfully`);
      setFile(null);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="csv-container">
      <h2>Upload CSV Reports</h2>

      <form className="csv-form" onSubmit={handleUpload}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </form>

      {message && <p className="csv-message">{message}</p>}
    </div>
  );
}