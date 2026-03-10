
import "../styles/dashboard.css";

export default function Dashboard({ user }: any) {
  return (
    <div className="dashboard">
      <h1>Welcome {user.id}</h1>
      <p>Role: {user.role}</p>
      <p>Login successful.</p>
    </div>
  );
}
