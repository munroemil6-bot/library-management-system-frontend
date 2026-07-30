import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    pwd: "",
    confirmPwd: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!form.pwd) {
      errs.pwd = "Password is required.";
    } else if (form.pwd.length < 8) {
      errs.pwd = "Password must be at least 8 characters.";
    }
    if (!form.confirmPwd) {
      errs.confirmPwd = "Please confirm your password.";
    } else if (form.pwd !== form.confirmPwd) {
      errs.confirmPwd = "Passwords do not match.";
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
      await api.post("/register", {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.pwd,
      });
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && typeof data.errors === "object") {
        setErrors(data.errors);
      } else {
        setServerError(data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-4 p-md-5">

                <div className="text-center mb-4">
                  <h2 className="fw-bold text-dark mb-1">Create Account</h2>
                  <p className="text-muted small">Join BookBarn today</p>
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
                    <label htmlFor="reg-username" className="form-label fw-medium">
                      Username
                    </label>
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
                    {errors.username && (
                      <div className="invalid-feedback">{errors.username}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="reg-email" className="form-label fw-medium">
                      Email Address
                    </label>
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
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="reg-pwd" className="form-label fw-medium">
                      Password
                    </label>
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
                    {errors.pwd && (
                      <div className="invalid-feedback">{errors.pwd}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="reg-confirm-pwd" className="form-label fw-medium">
                      Confirm Password
                    </label>
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
                    {errors.confirmPwd && (
                      <div className="invalid-feedback">{errors.confirmPwd}</div>
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
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <hr className="my-4" />

                <p className="text-center text-muted mb-0 small">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary fw-medium text-decoration-none">
                    Sign in
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
