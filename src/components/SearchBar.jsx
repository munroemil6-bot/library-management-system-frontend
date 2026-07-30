import { useState } from "react";

export default function SearchBar({ onSearch, placeholder = "Search..." }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-100">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search"
        />
        {query && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </div>
    </form>
  );
}
