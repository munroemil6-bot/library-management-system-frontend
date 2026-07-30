import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Loader from "../components/Loader";

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", email: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({ username: user.username || "", email: user.email || "" });
  }, [user]);

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) {
      errs.username = "Username is required.";
    } else if (form.username.trim().length < 3) {
      errs.username = "Username must be at least 3 characters.";
    }
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
    setSuccess("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!user?.id) { setServerError("Session expired. Please log in again."); return; }

    setLoading(true);
    try {
      const res = await api.patch(`/users/${user.id}`, {
        username: form.username.trim(),
        email: form.email.trim(),
      });
      const updatedUser = res.data;
      if (!updatedUser?.id) {
        setServerError("Unexpected response from server. Please try again.");
        return;
      }
      login(updatedUser);
      setSuccess("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      setServerError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setErrors({});
    setServerError("");
    setSuccess("");
    if (user) setForm({ username: user.username || "", email: user.email || "" });
  };

  const handleLogout = async () => {
    try { await api.post("/logout"); } catch (_) {}
    logout();
    navigate("/login");
  };

  if (!user) return null;
  if (loading) return <Loader message="Saving changes..." />;

  return (
    <UserLayout>
      <div className="p-4" style={{ maxWidth: 680 }}>

        {/* Profile header */}
        <div
          className="rounded-4 p-4 mb-4 d-flex align-items-center justify-content-between"
          style={{ background: "linear-gradient(135deg, #1e293b, #1e3a5f)", color: "#fff" }}
        >
          <div className="d-flex align-items-center gap-3">
            <div className="avatar-lg">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h5 className="mb-1 fw-bold">{user.username}</h5>
              <span
                className="badge px-2 py-1 text-capitalize"
                style={{
                  background: user.role === "admin" ? "#fbbf24" : "#22c55e",
                  color: "#1e293b",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                {user.role}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm"
            style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "0.5rem", background: "transparent" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Details card */}
        <div className="card border-0 rounded-4" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <div
            className="card-header border-0 d-flex align-items-center justify-content-between px-4 pt-4 pb-3"
            style={{ background: "#fff", borderRadius: "1rem 1rem 0 0" }}
          >
            <h6 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
              {editing ? "Edit Profile" : "Account Details"}
            </h6>
            {!editing && (
              <button
                type="button"
                className="btn btn-sm fw-medium"
                style={{ background: "#eff6ff", color: "#2563eb", borderRadius: "0.5rem", border: "none" }}
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            )}
          </div>

          <div className="card-body px-4 pb-4">
            {serverError && (
              <div className="alert alert-danger alert-dismissible py-2 small mb-3" role="alert">
                {serverError}
                <button type="button" className="btn-close" onClick={() => setServerError("")} aria-label="Close" />
              </div>
            )}
            {success && (
              <div className="alert alert-success alert-dismissible py-2 small mb-3" role="alert">
                {success}
                <button type="button" className="btn-close" onClick={() => setSuccess("")} aria-label="Close" />
              </div>
            )}

            {!editing ? (
              <div className="d-flex flex-column gap-3">
                {[
                  { label: "Username", value: user.username, icon: "bi bi-person" },
                  { label: "Email Address", value: user.email, icon: "bi bi-envelope" },
                  { label: "Role", value: user.role, icon: "bi bi-shield-check" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="d-flex align-items-center gap-3 p-3 rounded-3"
                    style={{ background: "#f8fafc" }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                      style={{ width: 36, height: 36, background: "#eff6ff", color: "#2563eb" }}
                    >
                      <i className={row.icon} />
                    </div>
                    <div>
                      <p className="mb-0 text-capitalize" style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.05em" }}>
                        {row.label}
                      </p>
                      <p className="mb-0 fw-medium text-capitalize" style={{ color: "#1e293b" }}>
                        {row.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSave} noValidate>
                <div className="mb-3">
                  <label htmlFor="profile-username" className="form-label fw-medium small">Username</label>
                  <input
                    id="profile-username"
                    type="text"
                    name="username"
                    className={`form-control form-control-lg ${errors.username ? "is-invalid" : ""}`}
                    value={form.username}
                    onChange={handleChange}
                    autoComplete="username"
                    disabled={loading}
                  />
                  {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="profile-email" className="form-label fw-medium small">Email Address</label>
                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    className={`form-control form-control-lg ${errors.email ? "is-invalid" : ""}`}
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    disabled={loading}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn fw-semibold px-4"
                    style={{ background: "#2563eb", color: "#fff", borderRadius: "0.5rem" }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Saving...
                      </>
                    ) : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary fw-medium px-4"
                    style={{ borderRadius: "0.5rem" }}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
  );
}
