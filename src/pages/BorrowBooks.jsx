import { useState, useEffect } from "react";
import api from "../api/axios";

export default function BorrowBooks() {
  const [books, setBooks] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch borrow records — always available
      const borrowRes = await api.get("/borrow");
      setBorrowRecords(borrowRes.data);

      // Fetch books — may not be implemented yet by teammate
      try {
        const booksRes = await api.get("/books");
        setBooks(Array.isArray(booksRes.data) ? booksRes.data : []);
      } catch {
        setBooks([]);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const isBorrowedByMe = (bookId) =>
    borrowRecords.some((r) => r.book_id === bookId && r.status === "borrowed");

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

  if (loading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-3 text-muted">Loading books...</p>
    </div>
  );

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-1" style={{ color: "#1e293b" }}>Borrow a Book</h3>
      <p className="text-muted mb-4">Browse available books and borrow one.</p>

      {error && (
        <div className="alert alert-danger alert-dismissible py-2 small">
          {error}
          <button type="button" className="btn-close" onClick={() => setError("")} aria-label="Close" />
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible py-2 small">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess("")} aria-label="Close" />
        </div>
      )}

      {books.length === 0 ? (
        <div
          className="rounded-4 p-5 text-center"
          style={{ background: "#f8fafc", border: "1px dashed #cbd5e1" }}
        >
          <p className="text-muted mb-0">No books available yet. Check back soon.</p>
        </div>
      ) : (
        <div className="row g-3">
          {books.map((book) => {
            const alreadyBorrowed = isBorrowedByMe(book.id);
            const outOfStock = book.available_copies <= 0;
            return (
              <div className="col-md-4" key={book.id}>
                <div
                  className="card h-100 border-0 rounded-4 p-4 d-flex flex-column"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
                >
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
                    {alreadyBorrowed ? "Already Borrowed"
                      : outOfStock ? "Unavailable"
                      : borrowingId === book.id ? "Borrowing..."
                      : "Borrow"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
