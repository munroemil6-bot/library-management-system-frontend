import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar role="admin" />
      <div className="flex-grow-1 bg-light min-vh-100 p-4">
        {children}
      </div>
    </div>
  );
}
