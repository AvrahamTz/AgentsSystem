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
  const [error, setError] = useState("");
  const [sucsses, setSucsses] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ agentCode, fullName, role })
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Failed");
      return;
    }
    setSucsses(`${JSON.stringify(data.user)}`)
    onUserCreated(data.user);

    setAgentCode("");
    setFullName("");
    setRole("agent");
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

      <select value={role} onChange={(e) => setRole(e.target.value as any)}>
        <option value="agent">agent</option>
        <option value="admin">admin</option>
      </select>

      {error && <p className="error">{error}</p>}
      {sucsses && <p className="sucsses">{sucsses}</p>}

      <button type="submit">Create User</button>
    </form>
  );
}