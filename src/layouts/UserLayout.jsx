import Sidebar from "../components/Sidebar";

export default function UserLayout({ children }) {
    return (
        <div className="d-flex">
        <Sidebar role="user" />
        <div className="flex-grow-1 bg-light min-vh-100 p-4">
            {children}
        </div>
        </div>
    );
}
