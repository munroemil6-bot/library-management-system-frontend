import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const STATUS_STYLE = {
  borrowed: { bg: "#eff6ff", color: "#2563eb" },
  returned: { bg: "#f0fdf4", color: "#16a34a" },
  overdue: { bg: "#fef2f2", color: "#dc2626" },
};

export default function BorrowBooks() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    void fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [borrowRes, booksRes] = await Promise.all([
        api.get("/borrow"),
        api.get("/books"),
      ]);
      setRecords(Array.isArray(borrowRes.data) ? borrowRes.data : []);
      setBooks(Array.isArray(booksRes.data) ? booksRes.data : []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load borrow information.");
    } finally {
      setLoading(false);
    }
  };

  const getDisplayStatus = (record) => {
    if (record.status === "returned") return "returned";
    if (record.due_date && new Date(record.due_date) < new Date()) return "overdue";
    return "borrowed";
  };

  const isBorrowedByMe = (bookId) =>
    records.some((record) => record.book_id === bookId && record.status === "borrowed");

  const handleBorrow = async (bookId) => {
    setBorrowingId(bookId);
    setError("");
    setSuccess("");
    try {
      await api.post("/borrow", { book_id: bookId });
      setSuccess("Book borrowed successfully.");
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to borrow book.");
    } finally {
      setBorrowingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 text-muted">Loading borrow information...</p>
      </div>
    );
  }

  return (
    <div className="container py-4 py-lg-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
            {isAdmin ? "Borrow Records" : "Borrow a Book"}
          </h3>
          <p className="text-muted mb-0">
            {isAdmin
              ? "Review who borrowed what and whether each item has already been returned."
              : "Browse available books and keep your borrowing activity in one place."}
          </p>
        </div>
        <div className="small text-muted">
          {isAdmin ? `${records.length} tracked borrows` : `${books.filter((book) => book.available_copies > 0).length} available to borrow`}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible py-2 small mb-4" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError("")} aria-label="Close" />
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible py-2 small mb-4" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess("")} aria-label="Close" />
        </div>
      )}

      {!isAdmin && (
        <>
          <div className="row g-3 mb-4">
            {books.length === 0 ? (
              <div className="col-12">
                <div className="rounded-4 p-5 text-center" style={{ background: "#f8fafc", border: "1px dashed #cbd5e1" }}>
                  <p className="text-muted mb-0">No books are available right now.</p>
                </div>
              </div>
            ) : (
              books.map((book) => {
                const alreadyBorrowed = isBorrowedByMe(book.id);
                const outOfStock = book.available_copies <= 0;
                return (
                  <div className="col-md-4" key={book.id}>
                    <div className="card h-100 border-0 rounded-4 p-4 d-flex flex-column" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                      <h6 className="fw-bold mb-1" style={{ color: "#1e293b" }}>{book.title}</h6>
                      <p className="text-muted small mb-1">{book.author?.name || "Unknown author"}</p>
                      <p className="small mb-3">
                        <span
                          className="badge"
                          style={{
                            background: outOfStock ? "#fee2e2" : "#dcfce7",
                            color: outOfStock ? "#dc2626" : "#16a34a",
                          }}
                        >
                          {outOfStock ? "Unavailable" : `${book.available_copies} available`}
                        </span>
                      </p>
                      <button
                        type="button"
                        className="btn btn-sm fw-medium mt-auto"
                        style={{
                          background: alreadyBorrowed || outOfStock ? "#f1f5f9" : "#2563eb",
                          color: alreadyBorrowed || outOfStock ? "#94a3b8" : "#fff",
                          borderRadius: "0.5rem",
                          border: "none",
                        }}
                        disabled={alreadyBorrowed || outOfStock || borrowingId === book.id}
                        onClick={() => handleBorrow(book.id)}
                      >
                        {alreadyBorrowed ? "Already Borrowed" : outOfStock ? "Unavailable" : borrowingId === book.id ? "Borrowing..." : "Borrow"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      <div className="card border-0 rounded-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead style={{ background: "#f8fafc" }}>
                <tr>
                  <th className="px-4 py-3 fw-semibold small" style={{ color: "#64748b" }}>
                    {isAdmin ? "Borrower" : "Book"}
                  </th>
                  <th className="py-3 fw-semibold small" style={{ color: "#64748b" }}>Borrowed</th>
                  <th className="py-3 fw-semibold small" style={{ color: "#64748b" }}>Due</th>
                  <th className="py-3 fw-semibold small" style={{ color: "#64748b" }}>Returned</th>
                  <th className="py-3 fw-semibold small" style={{ color: "#64748b" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-muted" colSpan="5">
                      {isAdmin ? "No borrow records yet." : "You have no active or past borrow records yet."}
                    </td>
                  </tr>
                ) : (
                  records.map((record) => {
                    const displayStatus = getDisplayStatus(record);
                    const style = STATUS_STYLE[displayStatus] || STATUS_STYLE.borrowed;
                    return (
                      <tr key={record.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                        <td className="px-4 py-3">
                          <div className="fw-medium" style={{ color: "#1e293b" }}>
                            {isAdmin ? record.user?.username || "Unknown user" : record.book?.title || "—"}
                          </div>
                          {isAdmin && <div className="small text-muted">{record.book?.title || "—"}</div>}
                        </td>
                        <td className="py-3 small text-muted">
                          {record.borrow_date ? new Date(record.borrow_date).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3 small text-muted">
                          {record.due_date ? new Date(record.due_date).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3 small text-muted">
                          {record.return_date ? new Date(record.return_date).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3">
                          <span className="badge px-2 py-1 text-capitalize" style={{ background: style.bg, color: style.color, fontWeight: 600 }}>
                            {displayStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
