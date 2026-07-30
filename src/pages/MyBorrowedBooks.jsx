import { useState, useEffect } from "react";
import api from "../api/axios";

export default function MyBorrowedBooks() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/borrow");
      setRecords(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your borrowed books.");
    } finally {
      setLoading(false);
    }
  };

  const getDisplayStatus = (record) => {
    if (record.status === "returned") return "returned";
    const due = new Date(record.due_date);
    if (due < new Date()) return "overdue";
    return "borrowed";
  };

  const handleReturn = async (recordId) => {
    setReturningId(recordId);
    setError("");
    setSuccess("");
    try {
      await api.patch(`/borrow/${recordId}`);
      setSuccess("Book returned successfully.");
      await fetchRecords();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to return book.");
    } finally {
      setReturningId(null);
    }
  };

  const statusBadge = (status) => {
    const map = {
      borrowed: "bg-primary",
      returned: "bg-success",
      overdue: "bg-danger",
    };
    return `badge ${map[status] || "bg-secondary"}`;
  };

  if (loading) return <div className="container py-5">Loading your books...</div>;

  return (
    <div className="container py-5">
      <h3 className="mb-4">My Borrowed Books</h3>

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

      {records.length === 0 ? (
        <p className="text-muted">You haven't borrowed any books yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Book</th>
                <th>Borrowed</th>
                <th>Due</th>
                <th>Returned</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => {
                const displayStatus = getDisplayStatus(record);
                return (
                  <tr key={record.id}>
                    <td>{record.book?.title}</td>
                    <td>{new Date(record.borrow_date).toLocaleDateString()}</td>
                    <td>{new Date(record.due_date).toLocaleDateString()}</td>
                    <td>
                      {record.return_date
                        ? new Date(record.return_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <span className={statusBadge(displayStatus)}>
                        {displayStatus}
                      </span>
                    </td>
                    <td>
                      {record.status === "borrowed" && (
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          disabled={returningId === record.id}
                          onClick={() => handleReturn(record.id)}
                        >
                          {returningId === record.id ? "Returning..." : "Return"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function MyBorrowedBooks() {
  return <div className="container py-4"><h2>My Borrowed Books</h2></div>;
}
