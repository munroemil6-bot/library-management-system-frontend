import React, { useEffect, useState } from 'react';
import { fetchAuthors, createAuthor, deleteAuthor } from '../api/catalogApi';

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [name, setName] = useState('');
  const [biography, setBiography] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  useEffect(() => {
    void loadAuthors();
  }, []);

  const loadAuthors = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAuthors();
      setAuthors(res.data || []);
    } catch {
      setError('Failed to load authors.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Author name is required.');
      return;
    }

    try {
      await createAuthor({ name, biography });
      setName('');
      setBiography('');
      setSuccess('Author added successfully.');
      await loadAuthors();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add author.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this author?')) return;
    try {
      await deleteAuthor(id);
      setSuccess('Author removed.');
      await loadAuthors();
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot delete author.');
    }
  };

  return (
    <div className="container py-4 py-lg-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: '#1e293b' }}>Authors</h3>
          <p className="text-muted mb-0">Add authors and keep their details organised for the catalog.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
      {success && <div className="alert alert-success py-2 small mb-3">{success}</div>}

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 rounded-4 p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <h5 className="fw-semibold mb-3">Add Author</h5>
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <input className="form-control" placeholder="Author Name" value={name} onChange={(e) => setName(e.target.value)} />
              <textarea className="form-control" rows="4" placeholder="Biography" value={biography} onChange={(e) => setBiography(e.target.value)} />
              <button type="submit" className="btn fw-medium" style={{ background: '#2563eb', color: '#fff', borderRadius: '0.5rem' }}>Add Author</button>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 rounded-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div className="card-body p-4">
              {loading ? (
                <div className="text-center py-4 text-muted">Loading authors...</div>
              ) : authors.length === 0 ? (
                <div className="text-center py-4 text-muted">No authors have been added yet.</div>
              ) : (
                <div className="row g-3">
                  {authors.map((author) => (
                    <div className="col-md-6" key={author.id}>
                      <div className="border rounded-4 p-3 h-100 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                          <h6 className="fw-semibold mb-0" style={{ color: '#1e293b' }}>{author.name}</h6>
                          <span className="badge" style={{ background: '#eff6ff', color: '#2563eb' }}>Author</span>
                        </div>
                        <p className="text-muted small mb-3 flex-grow-1">
                          {author.biography || 'No biography provided yet.'}
                        </p>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm" style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0' }} onClick={() => setSelectedAuthor(author)}>View</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(author.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedAuthor && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(15,23,42,0.55)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-semibold">{selectedAuthor.name}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedAuthor(null)} />
              </div>
              <div className="modal-body">
                <p className="text-muted mb-0">{selectedAuthor.biography || 'No biography provided yet.'}</p>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-outline-secondary" onClick={() => setSelectedAuthor(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
