import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", pwd: "", confirmPwd: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = "Username is required.";
    if (!form.email) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.pwd) errs.pwd = "Password is required.";
    else if (form.pwd.length < 8) errs.pwd = "Password must be at least 8 characters.";
    if (!form.confirmPwd) errs.confirmPwd = "Please confirm your password.";
    else if (form.pwd !== form.confirmPwd) errs.confirmPwd = "Passwords do not match.";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await api.post("/register", {
        username: form.username,
        email: form.email,
        password: form.pwd,
        password_confirmation: form.confirmPwd,
      });
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && typeof data.errors === "object") {
        setErrors(data.errors);
      } else {
        setServerError(data?.message || data?.error || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: "calc(100vh - 56px)", background: "#f0f2f5" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div className="mb-4 text-center">
          <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>Create account</h2>
          <p className="text-muted small mb-0">Fill in your details to get started</p>
        </div>

        {serverError && (
          <div className="alert alert-danger alert-dismissible py-2 small" role="alert">
            {serverError}
            <button type="button" className="btn-close" onClick={() => setServerError("")} aria-label="Close" />
          </div>
        )}

        <div className="card form-card p-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="reg-username" className="form-label fw-medium small">Username</label>
              <input
                id="reg-username"
                type="text"
                name="username"
                className={`form-control form-control-lg ${errors.username ? "is-invalid" : ""}`}
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                disabled={loading}
              />
              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="reg-email" className="form-label fw-medium small">Email Address</label>
              <input
                id="reg-email"
                type="email"
                name="email"
                className={`form-control form-control-lg ${errors.email ? "is-invalid" : ""}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="reg-pwd" className="form-label fw-medium small">Password</label>
              <input
                id="reg-pwd"
                type="password"
                name="pwd"
                className={`form-control form-control-lg ${errors.pwd ? "is-invalid" : ""}`}
                placeholder="Minimum 8 characters"
                value={form.pwd}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={loading}
              />
              {errors.pwd && <div className="invalid-feedback">{errors.pwd}</div>}
            </div>

            <div className="mb-4">
              <label htmlFor="reg-confirm-pwd" className="form-label fw-medium small">Confirm Password</label>
              <input
                id="reg-confirm-pwd"
                type="password"
                name="confirmPwd"
                className={`form-control form-control-lg ${errors.confirmPwd ? "is-invalid" : ""}`}
                placeholder="Re-enter your password"
                value={form.confirmPwd}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={loading}
              />
              {errors.confirmPwd && <div className="invalid-feedback">{errors.confirmPwd}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-lg w-100 fw-semibold"
              style={{ background: "#2563eb", color: "#fff", borderRadius: "0.625rem" }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Creating account...
                </>
              ) : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-muted small mt-3 mb-0">
          Already have an account?{" "}
          <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: "#2563eb" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
