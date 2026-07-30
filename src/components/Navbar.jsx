import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try { await api.post("/logout"); } catch (_) {}
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md shadow-sm" style={{ background: "#1e293b" }}>
      <div className="container">
        <Link
          className="navbar-brand fw-bold text-white d-flex align-items-center gap-1"
          to={user ? (user.role === "admin" ? "/dashboard" : "/profile") : "/"}
        >
          BookBarn
          <span className="brand-dot" />
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          style={{ color: "#94a3b8" }}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-md-center gap-2">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-white-50"
                    to="/login"
                    onClick={() => setOpen(false)}
                  >
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-sm px-3 fw-medium"
                    style={{ background: "#2563eb", color: "#fff", borderRadius: "0.5rem" }}
                    to="/register"
                    onClick={() => setOpen(false)}
                  >
                    Get Started
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2"
                    style={{
                      width: 32, height: 32, fontSize: "0.8rem",
                      background: "linear-gradient(135deg, #2563eb, #1e40af)",
                      flexShrink: 0,
                    }}
                  >
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="small fw-medium" style={{ color: "#e2e8f0" }}>
                    {user.username}
                  </span>
                </li>
                <li className="nav-item">
                 <Link
                   className="nav-link"
                   to="/borrow-books"
                   onClick={() => setOpen(false)}
                >
                   Borrow Books
                 </Link>
               </li>
                <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/my-borrowed-books"
                  onClick={() => setOpen(false)}
                >
                   My Borrowed Books
                  </Link>
                  </li>
                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      style={{ color: "#94a3b8" }}
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    style={{ color: "#94a3b8" }}
                    to="/profile"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-sm px-3"
                    style={{
                      border: "1px solid #334155",
                      color: "#94a3b8",
                      borderRadius: "0.5rem",
                      background: "transparent",
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
