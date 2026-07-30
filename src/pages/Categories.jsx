import React, { useEffect, useState } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../api/catalogApi';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetchCategories();
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to load categories.');
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setEditingCategoryId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage('Category name is required.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, { name, description });
        setMessage('Category updated successfully.');
      } else {
        await createCategory({ name, description });
        setMessage('Category added successfully.');
      }

      resetForm();
      await loadCategories();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to save category.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category.id);
    setName(category.name || '');
    setDescription(category.description || '');
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      await deleteCategory(id);
      await loadCategories();
      if (editingCategoryId === id) resetForm();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Cannot delete category');
    }
  };

  return (
    <div className="container py-4 py-lg-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: '#1e293b' }}>Categories</h3>
          <p className="text-muted mb-0">Create, edit, and manage book categories.</p>
        </div>
      </div>

      {message && <div className="alert alert-info py-2 small mb-3">{message}</div>}

      <form onSubmit={handleSubmit} className="card border-0 rounded-4 p-4 mb-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <div className="row g-3">
          <div className="col-md-5">
            <label className="form-label small fw-medium">Category Name</label>
            <input className="form-control" placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="col-md-5">
            <label className="form-label small fw-medium">Description</label>
            <input className="form-control" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="col-md-2 d-flex align-items-end gap-2">
            <button type="submit" className="btn" style={{ background: '#2563eb', color: '#fff', borderRadius: '0.5rem' }} disabled={loading}>
              {editingCategoryId ? 'Update' : 'Add'}
            </button>
            {editingCategoryId && (
              <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </div>
      </form>

      <div className="card border-0 rounded-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th className="px-4 py-3 fw-semibold small" style={{ color: '#64748b' }}>Name</th>
                <th className="py-3 fw-semibold small" style={{ color: '#64748b' }}>Description</th>
                <th className="py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td className="px-4 py-3 fw-medium" style={{ color: '#1e293b' }}>{category.name}</td>
                  <td className="py-3 text-muted">{category.description || '—'}</td>
                  <td className="py-3 pe-4">
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm" style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '0.5rem' }} onClick={() => handleEdit(category)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(category.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
