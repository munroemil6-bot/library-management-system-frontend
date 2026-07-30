import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Authors from "./pages/Authors";
import Categories from "./pages/Categories";
import BorrowBooks from "./pages/BorrowBooks";
import MyBorrowedBooks from "./pages/MyBorrowedBooks";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected — any logged-in user */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
              <Route path="/borrow" element={<ProtectedRoute><BorrowBooks /></ProtectedRoute>} />
              <Route path="/my-borrowed" element={<ProtectedRoute><MyBorrowedBooks /></ProtectedRoute>} />

              {/* Protected — admin only */}
              <Route path="/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
              <Route path="/authors" element={<ProtectedRoute adminOnly><Authors /></ProtectedRoute>} />
              <Route path="/categories" element={<ProtectedRoute adminOnly><Categories /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
