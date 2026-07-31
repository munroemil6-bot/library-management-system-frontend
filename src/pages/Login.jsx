import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", pwd: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.pwd.trim()) errs.pwd = "Password is required.";
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
      const res = await api.post("/login", {
        email: form.email.trim(),
        password: form.pwd,
      });
      const userData = res.data;
      if (!userData?.id) {
        setServerError("Unexpected response from server. Please try again.");
        return;
      }

      const token = userData?.token || userData?.access_token || userData?.auth_token || null;
      login(userData, token);
      navigate(userData.role === "admin" ? "/dashboard" : "/profile");
    } catch (err) {
      setServerError(
        err.response?.data?.error || err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: "calc(100vh - 56px)", background: "#f0f2f5" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div className="mb-4 text-center">
          <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>Welcome back</h2>
          <p className="text-muted small mb-0">Sign in to your BookBarn account</p>
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
              <label htmlFor="login-email" className="form-label fw-medium small">
                Email Address
              </label>
              <input
                id="login-email"
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

            <div className="mb-4">
              <label htmlFor="login-pwd" className="form-label fw-medium small">
                Password
              </label>
              <input
                id="login-pwd"
                type="password"
                name="pwd"
                className={`form-control form-control-lg ${errors.pwd ? "is-invalid" : ""}`}
                placeholder="Enter your password"
                value={form.pwd}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
              />
              {errors.pwd && <div className="invalid-feedback">{errors.pwd}</div>}
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
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-muted small mt-3 mb-0">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: "#2563eb" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
