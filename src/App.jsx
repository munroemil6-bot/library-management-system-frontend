import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
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

function AppShell({ children }) {
  const { user } = useAuth();
  const Layout = user?.role === "admin" ? AdminLayout : UserLayout;
  return <Layout>{children}</Layout>;
}

function HomeRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/dashboard" : "/profile"} replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.role === "admin" ? "/dashboard" : "/profile"} replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              
              {/* Protected — any logged-in user */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <Profile />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/borrow-books"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <BorrowBooks />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-borrowed-books"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <MyBorrowedBooks />
                    </AppShell>
                  </ProtectedRoute>
                }
             />

              {/* Protected — any logged-in user */}
              <Route
                path="/books"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <Books />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/borrow"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <BorrowBooks />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-borrowed"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <MyBorrowedBooks />
                    </AppShell>
                  </ProtectedRoute>
                }
              />

              {/* Protected — admin only */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute adminOnly>
                    <AppShell>
                      <Dashboard />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/authors"
                element={
                  <ProtectedRoute adminOnly>
                    <AppShell>
                      <Authors />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute adminOnly>
                    <AppShell>
                      <Categories />
                    </AppShell>
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
