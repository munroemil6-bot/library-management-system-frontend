import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  if (!book) return null;

  const { id, title, author, category, available } = book;

  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body d-flex flex-column p-4">
        <div className="mb-2">
          <span
            className={`badge ${available ? "bg-success" : "bg-secondary"}`}
          >
            {available ? "Available" : "Unavailable"}
          </span>
        </div>

        <h6 className="card-title fw-semibold text-dark mb-1">{title}</h6>

        {author && (
          <p className="text-muted small mb-1">
            By {author}
          </p>
        )}

        {category && (
          <p className="text-muted small mb-3">
            {category}
          </p>
        )}

        <div className="mt-auto">
          <Link
            to={`/books/${id}`}
            className="btn btn-outline-primary btn-sm w-100"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
