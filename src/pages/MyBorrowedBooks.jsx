import { useState, useEffect } from "react";
import api from "../api/axios";

export default function MyBorrowedBooks() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/borrow");
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load your borrowed books.");
    } finally {
      setLoading(false);
    }
  };

  const getDisplayStatus = (record) => {
    if (record.status === "returned") return "returned";
    if (new Date(record.due_date) < new Date()) return "overdue";
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

  const STATUS_STYLE = {
    borrowed: { bg: "#eff6ff", color: "#2563eb" },
    returned: { bg: "#f0fdf4", color: "#16a34a" },
    overdue:  { bg: "#fef2f2", color: "#dc2626" },
  };

  if (loading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-3 text-muted">Loading your books...</p>
    </div>
  );

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-1" style={{ color: "#1e293b" }}>My Borrowed Books</h3>
      <p className="text-muted mb-4">Track your current and past borrows.</p>

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

      {records.length === 0 ? (
        <div
          className="rounded-4 p-5 text-center"
          style={{ background: "#f8fafc", border: "1px dashed #cbd5e1" }}
        >
          <p className="text-muted mb-0">You haven&apos;t borrowed any books yet.</p>
        </div>
      ) : (
        <div className="card border-0 rounded-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead style={{ background: "#f8fafc" }}>
                <tr>
                  <th className="px-4 py-3 fw-semibold small" style={{ color: "#64748b" }}>Book</th>
                  <th className="py-3 fw-semibold small" style={{ color: "#64748b" }}>Borrowed</th>
                  <th className="py-3 fw-semibold small" style={{ color: "#64748b" }}>Due</th>
                  <th className="py-3 fw-semibold small" style={{ color: "#64748b" }}>Returned</th>
                  <th className="py-3 fw-semibold small" style={{ color: "#64748b" }}>Status</th>
                  <th className="py-3" />
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const displayStatus = getDisplayStatus(record);
                  const style = STATUS_STYLE[displayStatus] || STATUS_STYLE.borrowed;
                  return (
                    <tr key={record.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                      <td className="px-4 py-3 fw-medium" style={{ color: "#1e293b" }}>
                        {record.book?.title || "—"}
                      </td>
                      <td className="py-3 small text-muted">
                        {new Date(record.borrow_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 small text-muted">
                        {new Date(record.due_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 small text-muted">
                        {record.return_date ? new Date(record.return_date).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3">
                        <span
                          className="badge px-2 py-1 text-capitalize"
                          style={{ background: style.bg, color: style.color, fontWeight: 600 }}
                        >
                          {displayStatus}
                        </span>
                      </td>
                      <td className="py-3 pe-4">
                        {record.status === "borrowed" && (
                          <button
                            type="button"
                            className="btn btn-sm fw-medium"
                            style={{
                              background: "#eff6ff",
                              color: "#2563eb",
                              border: "none",
                              borderRadius: "0.5rem",
                            }}
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
        </div>
      )}
    </div>
  );
}
