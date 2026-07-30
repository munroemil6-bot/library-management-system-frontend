/*
==========================================================
MEMBER 2 — NAOMI

PAGE

AUTHORS

Responsibilities

• Display all authors
• Add authors
• Edit authors
• Delete authors

Backend Routes

GET /authors
POST /authors
PATCH /authors/:id
DELETE /authors/:id

==========================================================
*/
import React, { useEffect, useState } from 'react';
import { fetchAuthors, createAuthor, deleteAuthor } from '../api/catalogApi';

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [name, setName] = useState('');
  const [biography, setBiography] = useState('');

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    const res = await fetchAuthors();
    setAuthors(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Author name is required');

    await createAuthor({ name, biography });
    setName('');
    setBiography('');
    loadAuthors();
  };

  const handleDelete = async (id) => {
    try {
      await deleteAuthor(id);
      loadAuthors();
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete author');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>✍️ Authors</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Author Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Biography"
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
        />
        <button type="submit">Add Author</button>
      </form>

      <ul>
        {authors.map((a) => (
          <li key={a.id}>
            <strong>{a.name}</strong> - {a.biography}{' '}
            <button onClick={() => handleDelete(a.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default function Authors() {
  return <div className="container py-4"><h2>Authors</h2></div>;
}
