import { useState } from "react";
import { useNavigate } from "react-router";
import "../styles/login.css";
import { useAuthStore } from "../store/AuthStore";

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [agentCode, setAgentCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentCode, password })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    setAuth(data.user, data.token);

    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={submit}>
        <h2>Agent Login</h2>

        <input
          placeholder="Agent Code"
          value={agentCode}
          onChange={e => setAgentCode(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}