
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  fetchBooks, 
  createBook, 
  updateBook, 
  deleteBook, 
  fetchAuthors, 
  fetchCategories 
} from '../api/catalogApi';

export default function Books({ currentUser }) {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);

  const initialForm = {
    title: '',
    isbn: '',
    description: '',
    published_year: '',
    copies: 1,
    available_copies: 1,
    author_id: '',
    category_id: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      const [booksRes, authorsRes, categoriesRes] = await Promise.all([
        fetchBooks(),
        fetchAuthors(),
        fetchCategories()
      ]);
      setBooks(booksRes.data);
      setAuthors(authorsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Error fetching catalog data:', err);
    }
  };

  
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchBooks(search);
      setBooks(res.data);
    } catch (err) {
      console.error('Error searching books:', err);
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

    if (isNaN(copies) || copies < 0) errs.copies = 'Copies cannot be negative.';
    if (isNaN(avail) || avail < 0) errs.available_copies = 'Available copies cannot be negative.';
    if (!isNaN(copies) && !isNaN(avail) && avail > copies) {
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
      category_id: book.category_id
    });
    setErrors({});
    setApiError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    const payload = {
      ...formData,
      copies: parseInt(formData.copies),
      available_copies: parseInt(formData.available_copies),
      author_id: parseInt(formData.author_id),
      category_id: parseInt(formData.category_id),
      published_year: formData.published_year ? parseInt(formData.published_year) : null
    };

    try {
      if (editingBookId) {
  
        await updateBook(editingBookId, payload);
      } else {
        
        await createBook(payload);
      }

      setIsModalOpen(false);
      loadCatalog();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save book. Verify unique ISBN.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        loadCatalog();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete book.');
      }
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>📖 Books Management</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '8px', width: '250px' }}
          />
          <button type="submit" style={{ padding: '8px 16px' }}>Search</button>
        </form>

        {isAdmin && (
          <button 
            onClick={handleOpenAddModal} 
            style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Add New Book
          </button>
        )}
      </div>

      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th>Title</th>
            <th>ISBN</th>
            <th>Copies</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No books found.</td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book.id}>
                <td><strong>{book.title}</strong></td>
                <td>{book.isbn}</td>
                <td>{book.copies}</td>
                <td>{book.available_copies}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                
                  <Link to={`/books/${book.id}`}>
                    <button style={{ padding: '4px 8px' }}>View Details</button>
                  </Link>
                  {isAdmin && (
                    <>
                      <button onClick={() => handleOpenEditModal(book)} style={{ padding: '4px 8px', backgroundColor: '#ffc107', border: 'none', cursor: 'pointer' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(book.id)} style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', width: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>{editingBookId ? 'Edit Book' : 'Add New Book'}</h3>
            
            {apiError && <p style={{ color: 'red', fontSize: '14px' }}>{apiError}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label>Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%' }} />
                {errors.title && <small style={{ color: 'red' }}>{errors.title}</small>}
              </div>

              <div>
                <label>ISBN *</label>
                <input type="text" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} style={{ width: '100%' }} />
                {errors.isbn && <small style={{ color: 'red' }}>{errors.isbn}</small>}
              </div>

              <div>
                <label>Author *</label>
                <select value={formData.author_id} onChange={(e) => setFormData({ ...formData, author_id: e.target.value })} style={{ width: '100%' }}>
                  <option value="">Select Author</option>
                  {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                {errors.author_id && <small style={{ color: 'red' }}>{errors.author_id}</small>}
              </div>

              <div>
                <label>Category *</label>
                <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} style={{ width: '100%' }}>
                  <option value="">Select Category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.category_id && <small style={{ color: 'red' }}>{errors.category_id}</small>}
              </div>

              <div>
                <label>Total Copies</label>
                <input type="number" value={formData.copies} onChange={(e) => setFormData({ ...formData, copies: e.target.value })} style={{ width: '100%' }} />
                {errors.copies && <small style={{ color: 'red' }}>{errors.copies}</small>}
              </div>

              <div>
                <label>Available Copies</label>
                <input type="number" value={formData.available_copies} onChange={(e) => setFormData({ ...formData, available_copies: e.target.value })} style={{ width: '100%' }} />
                {errors.available_copies && <small style={{ color: 'red' }}>{errors.available_copies}</small>}
              </div>

              <div>
                <label>Published Year</label>
                <input type="number" value={formData.published_year} onChange={(e) => setFormData({ ...formData, published_year: e.target.value })} style={{ width: '100%' }} />
              </div>

              <div>
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '6px 12px' }}>
                  {editingBookId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}/*

==========================================================
MEMBER 2 — NAOMI

PAGE

BOOKS

Responsibilities

• Display all books
• Search books
• View book details
• Add books (Admin)
• Edit books (Admin)
• Delete books (Admin)

Backend Routes

GET /books
POST /books
PATCH /books/:id
DELETE /books/:id

==========================================================
*/

export default function Books() {
  return <div className="container py-4"><h2>Books</h2></div>;
}
