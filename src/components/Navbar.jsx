import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to={user ? (user.role === "admin" ? "/dashboard" : "/profile") : "/"}>
          BookBarn
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-md-center gap-1">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-light btn-sm px-3"
                    to="/register"
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span className="nav-link text-white-50 small">
                    {user.username}
                  </span>
                </li>
                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link"
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
                    to="/profile"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm px-3"
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
