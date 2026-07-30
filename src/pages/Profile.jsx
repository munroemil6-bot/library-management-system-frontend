import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

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
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
      });
    }
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
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    if (!user?.id) {
      setServerError("Session expired. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.patch(`/users/${user.id}`, {
        username: form.username.trim(),
        email: form.email.trim(),
      });

      const updatedUser = res.data?.user;
      if (!updatedUser) {
        setServerError("Unexpected response from server. Please try again.");
        return;
      }

      login(updatedUser, localStorage.getItem("token"));
      setSuccess("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Update failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setErrors({});
    setServerError("");
    setSuccess("");
    if (user) {
      setForm({ username: user.username || "", email: user.email || "" });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">

            {/* Profile Header Card */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{ width: 56, height: 56, fontSize: "1.4rem" }}
                    >
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">{user.username}</h5>
                      <span className="badge bg-secondary text-capitalize">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Details Card */}
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-header bg-white border-bottom py-3 px-4">
                <h5 className="mb-0 fw-semibold">
                  {editing ? "Edit Profile" : "Profile Details"}
                </h5>
              </div>

              <div className="card-body p-4">
                {serverError && (
                  <div className="alert alert-danger alert-dismissible" role="alert">
                    {serverError}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setServerError("")}
                      aria-label="Close"
                    />
                  </div>
                )}

                {success && (
                  <div className="alert alert-success alert-dismissible" role="alert">
                    {success}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSuccess("")}
                      aria-label="Close"
                    />
                  </div>
                )}

                {!editing ? (
                  <>
                    <div className="mb-3 pb-3 border-bottom">
                      <p className="text-muted small mb-1">Username</p>
                      <p className="fw-medium mb-0">{user.username}</p>
                    </div>
                    <div className="mb-3 pb-3 border-bottom">
                      <p className="text-muted small mb-1">Email Address</p>
                      <p className="fw-medium mb-0">{user.email}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-muted small mb-1">Role</p>
                      <p className="fw-medium mb-0 text-capitalize">{user.role}</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setEditing(true)}
                    >
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleSave} noValidate>
                    <div className="mb-3">
                      <label htmlFor="profile-username" className="form-label fw-medium">
                        Username
                      </label>
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
                      {errors.username && (
                        <div className="invalid-feedback">{errors.username}</div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="profile-email" className="form-label fw-medium">
                        Email Address
                      </label>
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
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
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
        </div>
      </div>
    </div>
  );
}
