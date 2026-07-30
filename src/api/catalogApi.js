import api from "./axios";

export const fetchBooks = (search = "") => {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  return api.get(`/books${params}`);
};

export const createBook = (data) => api.post("/books", data);
export const updateBook = (id, data) => api.patch(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

export const fetchAuthors = () => api.get("/authors");
export const createAuthor = (data) => api.post("/authors", data);
export const deleteAuthor = (id) => api.delete(`/authors/${id}`);

export const fetchCategories = () => api.get("/categories");
export const createCategory = (data) => api.post("/categories", data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
