import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchBooks,
  createBook,
  updateBook,
  deleteBook,
  fetchAuthors,
  fetchCategories,
} from '../api/catalogApi';

const initialForm = {
  title: '',
  isbn: '',
  description: '',
  published_year: '',
  copies: 1,
  available_copies: 1,
  author_id: '',
  category_id: '',
};

export default function Books() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    void loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const [booksRes, authorsRes, categoriesRes] = await Promise.all([
        fetchBooks(),
        fetchAuthors(),
        fetchCategories(),
      ]);
      setBooks(booksRes.data || []);
      setAuthors(authorsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err) {
      setApiError('Unable to load catalog data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchBooks(search);
      setBooks(res.data || []);
    } catch {
      setApiError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errs = {};

    if (!formData.title.trim()) errs.title = 'Title is required.';
    if (!formData.isbn.trim()) errs.isbn = 'ISBN is required.';
    if (!formData.author_id) errs.author_id = 'Please select an author.';
    if (!formData.category_id) errs.category_id = 'Please select a category.';

    const copies = parseInt(formData.copies, 10);
    const avail = parseInt(formData.available_copies, 10);

    if (Number.isNaN(copies) || copies < 0) errs.copies = 'Copies cannot be negative.';
    if (Number.isNaN(avail) || avail < 0) errs.available_copies = 'Available copies cannot be negative.';
    if (!Number.isNaN(copies) && !Number.isNaN(avail) && avail > copies) {
      errs.available_copies = 'Available copies cannot exceed total copies.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenAddModal = () => {
    setEditingBookId(null);
    setFormData(initialForm);
    setErrors({});
    setApiError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book) => {
    setEditingBookId(book.id);
    setFormData({
      title: book.title,
      isbn: book.isbn,
      description: book.description || '',
      published_year: book.published_year || '',
      copies: book.copies,
      available_copies: book.available_copies,
      author_id: book.author_id,
      category_id: book.category_id,
    });
    setErrors({});
    setApiError('');
    setIsModalOpen(true);
  };

  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setIsDetailsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    const payload = {
      ...formData,
      copies: parseInt(formData.copies, 10),
      available_copies: parseInt(formData.available_copies, 10),
      author_id: parseInt(formData.author_id, 10),
      category_id: parseInt(formData.category_id, 10),
      published_year: formData.published_year ? parseInt(formData.published_year, 10) : null,
    };

    try {
      if (editingBookId) {
        await updateBook(editingBookId, payload);
      } else {
        await createBook(payload);
      }
      setIsModalOpen(false);
      await loadCatalog();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save book.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await deleteBook(id);
      await loadCatalog();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to delete book.');
    }
  };

  return (
    <div className="container py-4 py-lg-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: '#1e293b' }}>Books</h3>
          <p className="text-muted mb-0">Browse the catalog and manage books from one place.</p>
        </div>
        {isAdmin && (
          <button className="btn fw-medium" style={{ background: '#2563eb', color: '#fff', borderRadius: '0.5rem' }} onClick={handleOpenAddModal}>
            + Add Book
          </button>
        )}
      </div>

      {apiError && <div className="alert alert-danger py-2 small mb-3">{apiError}</div>}

      <form onSubmit={handleSearch} className="d-flex flex-column flex-md-row gap-2 mb-4">
        <input className="form-control" placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="submit" className="btn" style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0' }}>Search</button>
      </form>

      {loading ? (
        <div className="text-center py-4 text-muted">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="rounded-4 p-5 text-center" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
          <p className="text-muted mb-0">No books found.</p>
        </div>
      ) : (
        <div className="row g-3">
          {books.map((book) => (
            <div className="col-lg-6" key={book.id}>
              <div className="card border-0 rounded-4 h-100 p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: '#1e293b' }}>{book.title}</h6>
                    <p className="text-muted small mb-0">{book.author?.name || 'Unknown author'}</p>
                  </div>
                  <span className="badge" style={{ background: '#eff6ff', color: '#2563eb' }}>{book.category?.name || 'General'}</span>
                </div>
                <p className="text-muted small mb-3">{book.description || 'No description available.'}</p>
                <div className="d-flex flex-wrap gap-2 small text-muted mb-3">
                  <span className="badge" style={{ background: '#f8fafc', color: '#64748b' }}>ISBN {book.isbn}</span>
                  <span className="badge" style={{ background: '#f8fafc', color: '#64748b' }}>{book.copies} copies</span>
                  <span className="badge" style={{ background: '#f8fafc', color: '#64748b' }}>{book.available_copies} available</span>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-auto">
                  <button className="btn btn-sm" style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0' }} onClick={() => handleViewDetails(book)}>View</button>
                  {isAdmin && (
                    <>
                      <button className="btn btn-sm" style={{ background: '#eff6ff', color: '#2563eb', border: 'none' }} onClick={() => handleOpenEditModal(book)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(book.id)}>Delete</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(15,23,42,0.55)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-semibold">{editingBookId ? 'Edit Book' : 'Add Book'}</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)} />
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-medium">Title *</label>
                    <input className="form-control" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    {errors.title && <small className="text-danger">{errors.title}</small>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium">ISBN *</label>
                    <input className="form-control" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} />
                    {errors.isbn && <small className="text-danger">{errors.isbn}</small>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium">Author *</label>
                    <select className="form-select" value={formData.author_id} onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}>
                      <option value="">Select Author</option>
                      {authors.map((author) => <option key={author.id} value={author.id}>{author.name}</option>)}
                    </select>
                    {errors.author_id && <small className="text-danger">{errors.author_id}</small>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium">Category *</label>
                    <select className="form-select" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                      <option value="">Select Category</option>
                      {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                    {errors.category_id && <small className="text-danger">{errors.category_id}</small>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium">Total Copies</label>
                    <input className="form-control" type="number" value={formData.copies} onChange={(e) => setFormData({ ...formData, copies: e.target.value })} />
                    {errors.copies && <small className="text-danger">{errors.copies}</small>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium">Available Copies</label>
                    <input className="form-control" type="number" value={formData.available_copies} onChange={(e) => setFormData({ ...formData, available_copies: e.target.value })} />
                    {errors.available_copies && <small className="text-danger">{errors.available_copies}</small>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium">Published Year</label>
                    <input className="form-control" type="number" value={formData.published_year} onChange={(e) => setFormData({ ...formData, published_year: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-medium">Description</label>
                    <textarea className="form-control" rows="4" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                  <div className="col-12 d-flex justify-content-end gap-2 pt-2">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn" style={{ background: '#2563eb', color: '#fff' }}>{editingBookId ? 'Update' : 'Save'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDetailsOpen && selectedBook && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(15,23,42,0.55)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-semibold">{selectedBook.title}</h5>
                <button type="button" className="btn-close" onClick={() => setIsDetailsOpen(false)} />
              </div>
              <div className="modal-body">
                <p className="text-muted mb-3">{selectedBook.description || 'No description available.'}</p>
                <div className="d-flex flex-wrap gap-2 small text-muted">
                  <span className="badge" style={{ background: '#eff6ff', color: '#2563eb' }}>By {selectedBook.author?.name || 'Unknown'}</span>
                  <span className="badge" style={{ background: '#f8fafc', color: '#64748b' }}>{selectedBook.category?.name || 'General'}</span>
                  <span className="badge" style={{ background: '#f8fafc', color: '#64748b' }}>{selectedBook.available_copies} available</span>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-outline-secondary" onClick={() => setIsDetailsOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
