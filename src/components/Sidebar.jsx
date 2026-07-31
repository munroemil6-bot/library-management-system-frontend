import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_LINKS = [
  { label: "Dashboard",     to: "/dashboard", icon: "bi bi-speedometer2" },
  { label: "Books",         to: "/books",     icon: "bi bi-book" },
  { label: "Authors",       to: "/authors",   icon: "bi bi-person-lines-fill" },
  { label: "Categories",    to: "/categories",icon: "bi bi-tag" },
  { label: "Borrow Records",to: "/borrow",    icon: "bi bi-arrow-left-right" },
  { label: "Profile",       to: "/profile",   icon: "bi bi-person-circle" },
];

const USER_LINKS = [
  { label: "Profile",          to: "/profile",     icon: "bi bi-person-circle" },
  { label: "Browse Books",     to: "/books",       icon: "bi bi-book" },
  { label: "Borrow a Book",    to: "/borrow",      icon: "bi bi-bookmark-plus" },
  { label: "My Borrowed Books",to: "/my-borrowed", icon: "bi bi-collection" },
];

export default function Sidebar({ role = "user" }) {
  const { user } = useAuth();
  const links = role === "admin" ? ADMIN_LINKS : USER_LINKS;

  return (
    <div className="sidebar d-flex flex-column">
      <p className="sidebar-label mb-3">
        {role === "admin" ? "Admin Panel" : "My Account"}
      </p>
      <ul className="nav flex-column gap-1">
        {links.map((link) => (
          <li className="nav-item" key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
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
