import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center px-3">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h2 className="fw-semibold text-dark mb-3">Page Not Found</h2>
        <p className="text-muted mb-4">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary px-4">
          Go Home
        </Link>
      </div>
    </div>
  );
}
