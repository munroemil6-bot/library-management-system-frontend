import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function BorrowBooks() {
  const { user } = useAuth();

  const [books, setBooks] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [booksRes, borrowRes] = await Promise.all([
        api.get("/books"),
        api.get("/borrow"),
      ]);
      setBooks(booksRes.data);
      setBorrowRecords(borrowRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  const isBorrowedByMe = (bookId) => {
    return borrowRecords.some(
      (record) => record.book_id === bookId && record.status === "borrowed"
    );
  };

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

  if (loading) return <div className="container py-5">Loading books...</div>;

  return (
    <div className="container py-5">
      <h3 className="mb-4">Available Books</h3>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      <div className="row g-3">
        {books.map((book) => {
          const alreadyBorrowed = isBorrowedByMe(book.id);
          const outOfStock = book.available_copies <= 0;

          return (
            <div className="col-md-4" key={book.id}>
              <div className="card p-3 shadow-sm h-100 d-flex flex-column">
                <h5>{book.title}</h5>
                <p className="text-muted mb-1">{book.isbn}</p>
                <p className="mb-2">
                  Copies available: {book.available_copies}
                </p>

                <button
                  type="button"
                  className="btn btn-primary mt-auto"
                  disabled={alreadyBorrowed || outOfStock || borrowingId === book.id}
                  onClick={() => handleBorrow(book.id)}
                >
                  {alreadyBorrowed
                    ? "Already Borrowed"
                    : outOfStock
                    ? "Unavailable"
                    : borrowingId === book.id
                    ? "Borrowing..."
                    : "Borrow"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
