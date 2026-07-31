import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Loader from "../components/Loader";

const NAV_CARDS = [
  { label: "Books",          to: "/books",      description: "Add, edit or remove books",       icon: "bi bi-book",              bg: "#eff6ff", color: "#2563eb" },
  { label: "Authors",        to: "/authors",    description: "Manage author records",            icon: "bi bi-person-lines-fill", bg: "#f0fdf4", color: "#16a34a" },
  { label: "Categories",     to: "/categories", description: "Organise book categories",         icon: "bi bi-tag",               bg: "#fefce8", color: "#ca8a04" },
  { label: "Borrow Records", to: "/borrow",     description: "View all borrow activity",         icon: "bi bi-arrow-left-right",  bg: "#fdf4ff", color: "#9333ea" },
  { label: "Profile",        to: "/profile",    description: "View and edit your account",       icon: "bi bi-person-circle",     bg: "#fff7ed", color: "#ea580c" },
];

const STAT_CONFIG = [
  { key: "total_books",    label: "Total Books",    icon: "bi bi-book-fill",          gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)" },
  { key: "total_users",    label: "Total Users",    icon: "bi bi-people-fill",        gradient: "linear-gradient(135deg, #16a34a, #15803d)" },
  { key: "active_borrows", label: "Active Borrows", icon: "bi bi-bookmark-fill",      gradient: "linear-gradient(135deg, #d97706, #b45309)" },
  { key: "overdue",        label: "Overdue",        icon: "bi bi-exclamation-circle-fill", gradient: "linear-gradient(135deg, #dc2626, #b91c1c)" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard/stats")
      .then((res) => {
        if (res.data && typeof res.data === "object") {
          setStats(res.data);
        } else {
          setError("Invalid data received from server.");
        }
      })
      .catch(() => setError("Failed to load statistics. Please refresh the page."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4" style={{ maxWidth: 1100 }}>
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: "#1e293b", fontSize: "1.6rem" }}>
          Admin Dashboard
        </h2>
        {user?.username && (
          <p className="mb-0" style={{ color: "#64748b" }}>
            Welcome back, <span className="fw-semibold" style={{ color: "#2563eb" }}>{user.username}</span>
          </p>
        )}
      </div>

      <div className="mb-4">
        <p className="fw-semibold mb-3 text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "#94a3b8" }}>
          System Overview
        </p>

        {loading && <Loader message="Loading statistics..." />}

        {!loading && error && (
          <div className="alert alert-warning d-flex align-items-center py-2" role="alert">
            <span className="small">{error}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-warning ms-auto"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="row g-3">
            {STAT_CONFIG.map((item) => (
              <div className="col-6 col-lg-3" key={item.key}>
                <div className="card border-0 h-100" style={{ boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)" }}>
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0 small fw-medium" style={{ color: "#64748b" }}>{item.label}</p>
                      <i className={item.icon} style={{ fontSize: "1rem", color: "#2563eb" }} />
                    </div>
                    <h3 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
                      {stats ? (stats[item.key] ?? "—") : "—"}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="fw-semibold mb-3 text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "#94a3b8" }}>
          Quick Actions
        </p>
        <div className="row g-3">
          {NAV_CARDS.map((card) => (
            <div className="col-12 col-sm-6 col-lg-4" key={card.to}>
              <Link to={card.to} className="text-decoration-none">
                <div className="card border-0 h-100" style={{ boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)" }}>
                  <div className="card-body p-4">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                      style={{ width: 44, height: 44, background: card.bg, color: card.color }}
                    >
                      <i className={card.icon} />
                    </div>
                    <h6 className="fw-semibold mb-1" style={{ color: "#1e293b" }}>{card.label}</h6>
                    <p className="small mb-2" style={{ color: "#64748b" }}>{card.description}</p>
                    <span className="small fw-semibold" style={{ color: card.color }}>
                      Open {card.label} &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
