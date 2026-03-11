import { useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import "../styles/reportPage.css"


export default function NewReportPage() {
  const { token } = useAuthStore();

  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category", category);
    formData.append("urgency", urgency);
    formData.append("message", message);

    if (image) {
      formData.append("image", image);
    }

    const res = await fetch("http://localhost:3000/reports", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    console.log(data);
    setCategory("");
    setUrgency("");
    setMessage("");
    setImage(null);
  };

   return (
    <div className="report-container">
      <h2>New Report</h2>

      <form className="report-form" onSubmit={handleSubmit}>

        <label>Category</label>
        <select
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="intelligence">Intelligence </option>
          <option value="logistics">Logistics</option>
          <option value="alert">Alert</option>
        </select>
        
        <label>Urgency</label>
        <select
          value={urgency}
          onChange={(e)=>setUrgency(e.target.value)}
        >
          <option value="">Select urgency</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label>Message</label>
        <textarea
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
        />

        <label>Image</label>
        <input
          className="file-input"
          type="file"
          onChange={(e)=>setImage(e.target.files?.[0] || null)}
        />

        <button className="submit-btn">
          Send Report
        </button>

      </form>
    </div>
   )
}