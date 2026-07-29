import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const NAV_CARDS = [
  { label: "Manage Books", to: "/admin/books", icon: "" },
  { label: "Manage Authors", to: "/admin/authors", icon: "" },
  { label: "Manage Categories", to: "/admin/categories", icon: "" },
  { label: "Borrow Records", to: "/admin/borrows", icon: "" },
  { label: "Manage Users", to: "/admin/users", icon: "" },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() => setError("Failed to load statistics."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-4">
      <h3 className="mb-4">Admin Dashboard</h3>

      {/* Stats Cards */}
      <div className="row g-3 mb-5">
        {loading ? (
          <p className="text-muted">Loading stats...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : stats ? (
          <>
            <StatCard label="Total Books" value={stats.total_books} color="primary" />
            <StatCard label="Total Users" value={stats.total_users} color="success" />
            <StatCard label="Active Borrows" value={stats.active_borrows} color="warning" />
            <StatCard label="Overdue" value={stats.overdue} color="danger" />
          </>
        ) : (
          <p className="text-muted">No statistics available.</p>
        )}
      </div>

      {/* Quick Action Nav Cards */}
      <h5 className="mb-3">Quick Actions</h5>
      <div className="row g-3">
        {NAV_CARDS.map((card) => (
          <div className="col-6 col-md-4 col-lg-3" key={card.to}>
            <Link to={card.to} className="text-decoration-none">
              <div className="card text-center p-3 h-100 shadow-sm">
                <div style={{ fontSize: "2rem" }}>{card.icon}</div>
                <p className="mt-2 mb-0 fw-semibold">{card.label}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="col-6 col-md-3">
      <div className={`card text-white bg-${color} p-3 shadow-sm`}>
        <h6 className="mb-1">{label}</h6>
        <h2 className="mb-0">{value ?? "—"}</h2>
      </div>
    </div>
  );
}
