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
    if (!form.pwd.trim()) {
      errs.pwd = "Password is required.";
    }
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
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/login", {
        email: form.email.trim(),
        password: form.pwd,
      });

      const userData = res.data?.user;
      const token = res.data?.token;

      if (!userData || !token) {
        setServerError("Unexpected response from server. Please try again.");
        return;
      }

      login(userData, token);
      navigate(userData.role === "admin" ? "/dashboard" : "/profile");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-6 col-lg-5">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-4 p-md-5">

                <div className="text-center mb-4">
                  <h2 className="fw-bold text-dark mb-1">Welcome Back</h2>
                  <p className="text-muted small">Sign in to your BookBarn account</p>
                </div>

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

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="login-email" className="form-label fw-medium">
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
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="login-pwd" className="form-label fw-medium">
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
                    {errors.pwd && (
                      <div className="invalid-feedback">{errors.pwd}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <hr className="my-4" />

                <p className="text-center text-muted mb-0 small">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="text-primary fw-medium text-decoration-none">
                    Create one
                  </Link>
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
