import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_LINKS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Books", to: "/books" },
  { label: "Authors", to: "/authors" },
  { label: "Categories", to: "/categories" },
  { label: "Borrow Records", to: "/borrow" },
  { label: "Profile", to: "/profile" },
];

const USER_LINKS = [
  { label: "Profile", to: "/profile" },
  { label: "Browse Books", to: "/books" },
  { label: "Borrow a Book", to: "/borrow" },
  { label: "My Borrowed Books", to: "/my-borrowed" },
];

export default function Sidebar({ role = "user" }) {
  const { user } = useAuth();
  const links = role === "admin" ? ADMIN_LINKS : USER_LINKS;

  return (
    <div className="bg-white border-end vh-100 p-3" style={{ width: 220, minWidth: 220 }}>
      {user && (
        <Link to="/profile" className="text-decoration-none text-dark d-block mb-3 px-2">
          <div className="fw-semibold">{user.username}</div>
          <div className="small text-muted">View profile</div>
        </Link>
      )}
      <p className="text-muted small fw-semibold text-uppercase px-2 mb-2">
        {role === "admin" ? "Admin Menu" : "Menu"}
      </p>
      <ul className="nav flex-column gap-1">
        {links.map((link) => (
          <li className="nav-item" key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `nav-link rounded px-3 py-2 ${
                  isActive
                    ? "bg-primary text-white fw-medium"
                    : "text-dark"
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
