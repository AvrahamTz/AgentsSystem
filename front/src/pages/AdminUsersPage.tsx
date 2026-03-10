import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import CreateUserForm from "../components/CreateUserForm";
import "../styles/adminUsers.css";

type User = {
  _id: string;
  agentCode: string;
  fullName: string;
  role: "admin" | "agent";
};

export default function AdminUsersPage() {
  const { token } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/admin/users", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then((r) => r.json())
      .then((data) => setUsers(data.user));
  }, []);

  return (
    <div className="admin-users-page">
      <h1 className="page-title">Admin Users</h1>

      <CreateUserForm
        onUserCreated={(user) =>
          setUsers((prev) => [...prev, user])
        }
      />

      <table className="users-table">
        <thead>
          <tr>
            <th>Agent Code</th>
            <th>Full Name</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.agentCode}</td>
              <td>{u.fullName}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
