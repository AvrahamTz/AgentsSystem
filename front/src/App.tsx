
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import NewReportPage from "./pages/NewReportPage";
import CSVUploadPage from "./pages/CSVUploadPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import { useAuthStore } from "./store/AuthStore";
import AdminUsersPage from "./pages/AdminUsersPage";
export default function App() {
  const { user, token, setAuth, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:3000/auth/me", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(r => r.json())
      .then(data => {
        setAuth(data.user, token);
        setLoading(false);
      })
      .catch(() => {
        logout();
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginPage />} />

    <Route
      path="/dashboard"
      element={
      <ProtectedRoute>
      <Dashboard />
      </ProtectedRoute>
      }
    />

    <Route
      path="/new-report"
      element={
      <ProtectedRoute role="agent">
        <NewReportPage />
      </ProtectedRoute>
      }
    />

    <Route
      path="/upload-csv"
      element={
      <ProtectedRoute role="agent">
        <CSVUploadPage />
      </ProtectedRoute>
      }
    />

    <Route
      path="/admin/users"
      element={
      <ProtectedRoute role="admin">
        <AdminUsersPage />
      </ProtectedRoute>
      }
    />

    {/* <Route
      path="/admin/reports"
      element={
      <ProtectedRoute role="admin">
        {/* <AdminReportsPage />
      </ProtectedRoute>
      }
    /> */}

      </Routes>
    </BrowserRouter>
  );
}