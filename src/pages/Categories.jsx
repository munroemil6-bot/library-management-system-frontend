
/*
==========================================================
MEMBER 2 — NAOMI

PAGE

CATEGORIES

Responsibilities

• Display categories
• Add categories
• Edit categories
• Delete categories

Backend Routes

GET /categories
POST /categories
PATCH /categories/:id
DELETE /categories/:id

==========================================================
*/
import React, { useEffect, useState } from 'react';
import { fetchCategories, createCategory, deleteCategory } from '../api/catalogApi';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await fetchCategories();
    setCategories(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Category name is required');

    await createCategory({ name, description });
    setName('');
    setDescription('');
    loadCategories();
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete category');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🏷️ Categories</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Category</button>
      </form>

      <ul>
        {categories.map((c) => (
          <li key={c.id}>
            <strong>{c.name}</strong> - {c.description}{' '}
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default function Categories() {
  return <div className="container py-4"><h2>Categories</h2></div>;
}
