import { useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import "../styles/adminUsers.css";

type Props = {
  onUserCreated: (user: any) => void;
};

export default function CreateUserForm({ onUserCreated }: Props) {
  const { token } = useAuthStore();

  const [agentCode, setAgentCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"admin" | "agent">("agent");
  const [password, setPassword] = useState(""); // optional password
  const [error, setError] = useState("");
  const [sucsses, setSucsses] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body: any = { agentCode, fullName, role };

   
    if (password.trim()) {
      body.password = password;
    }

    const res = await fetch("http://localhost:3000/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Failed");
      setSucsses("");
      return;
    }

    setSucsses(`User created: ${data.user.agentCode}`);
    setError("");

    onUserCreated(data.user);

    setAgentCode("");
    setFullName("");
    setRole("agent");
    setPassword("");
  };

  return (
    <form className="create-user-form" onSubmit={submit}>
      <h3>Create User</h3>

      <input
        placeholder="Agent Code"
        value={agentCode}
        onChange={(e) => setAgentCode(e.target.value)}
        required
      />

      <input
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password (optional)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select value={role} onChange={(e) => setRole(e.target.value as "admin" | "agent")}>
        <option value="agent">agent</option>
        <option value="admin">admin</option>
      </select>

      {error && <p className="error">{error}</p>}
      {sucsses && <p className="sucsses">{sucsses}</p>}

      <button type="submit">Create User</button>
    </form>
  );
}