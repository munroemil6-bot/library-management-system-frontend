import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Loader from "../components/Loader";
import AdminLayout from "../layouts/AdminLayout";

const NAV_CARDS = [
  { label: "Manage Books", to: "/admin/books", description: "Add, edit or remove books" },
  { label: "Manage Authors", to: "/admin/authors", description: "Manage author records" },
  { label: "Manage Categories", to: "/admin/categories", description: "Organise book categories" },
  { label: "Borrow Records", to: "/admin/borrows", description: "View all borrow activity" },
  { label: "Manage Users", to: "/admin/users", description: "View and manage user accounts" },
];

const STAT_CONFIG = [
  { key: "total_books", label: "Total Books", color: "primary" },
  { key: "total_users", label: "Total Users", color: "success" },
  { key: "active_borrows", label: "Active Borrows", color: "warning" },
  { key: "overdue", label: "Overdue", color: "danger" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard/stats")
      .then((res) => {
        if (res.data && typeof res.data === "object") {
          setStats(res.data);
        } else {
          setError("Invalid data received from server.");
        }
      })
      .catch(() => {
        setError("Failed to load statistics. Please refresh the page.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="container-fluid">

        {/* Page Header */}
        <div className="mb-4">
          <h2 className="fw-bold text-dark mb-1">Admin Dashboard</h2>
          {user?.username && (
            <p className="text-muted mb-0">
              Welcome back, <span className="fw-medium">{user.username}</span>
            </p>
          )}
        </div>

        {/* Statistics Section */}
        <div className="mb-5">
          <h5 className="fw-semibold text-dark mb-3">System Statistics</h5>

          {loading && <Loader message="Loading statistics..." />}

          {!loading && error && (
            <div className="alert alert-warning d-flex align-items-center" role="alert">
              <span>{error}</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-warning ms-auto"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && !stats && (
            <p className="text-muted">No statistics available.</p>
          )}

          {!loading && !error && stats && (
            <div className="row g-3">
              {STAT_CONFIG.map((item) => (
                <div className="col-6 col-md-3" key={item.key}>
                  <div className={`card border-0 text-white bg-${item.color} shadow-sm h-100`}>
                    <div className="card-body p-3">
                      <p className="card-text small mb-1 opacity-75">{item.label}</p>
                      <h2 className="fw-bold mb-0">
                        {stats[item.key] ?? "—"}
                      </h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Section */}
        <div>
          <h5 className="fw-semibold text-dark mb-3">Quick Actions</h5>
          <div className="row g-3">
            {NAV_CARDS.map((card) => (
              <div className="col-12 col-sm-6 col-lg-4" key={card.to}>
                <Link to={card.to} className="text-decoration-none">
                  <div className="card border-0 shadow-sm h-100 rounded-3 card-hover">
                    <div className="card-body p-4">
                      <h6 className="fw-semibold text-dark mb-1">{card.label}</h6>
                      <p className="text-muted small mb-0">{card.description}</p>
                    </div>
                    <div className="card-footer bg-transparent border-top-0 px-4 pb-3">
                      <span className="text-primary small fw-medium">Go to {card.label} &rarr;</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
