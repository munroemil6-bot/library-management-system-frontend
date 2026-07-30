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
    if (Object.keys(errs).length) return setErrors(errs);

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
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: 450 }}>
        <h3 className="mb-4 text-center">Create Account</h3>

        {serverError && (
          <div className="alert alert-danger" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="reg-username" className="form-label">
              Username
            </label>
            <input
              id="reg-username"
              type="text"
              name="username"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="reg-email" className="form-label">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="reg-pwd" className="form-label">
              Password
            </label>
            <input
              id="reg-pwd"
              type="password"
              name="pwd"
              className={`form-control ${errors.pwd ? "is-invalid" : ""}`}
              value={form.pwd}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.pwd && (
              <div className="invalid-feedback">{errors.pwd}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="reg-confirm-pwd" className="form-label">
              Confirm Password
            </label>
            <input
              id="reg-confirm-pwd"
              type="password"
              name="confirmPwd"
              className={`form-control ${errors.confirmPwd ? "is-invalid" : ""}`}
              value={form.confirmPwd}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.confirmPwd && (
              <div className="invalid-feedback">{errors.confirmPwd}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-3 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
