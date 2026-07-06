import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Sidebar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    async function handleLogout() {
        try {
        await api.post("/logout");
        } catch (error) {
        console.log("Logout request failed, clearing local data anyway.");
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    }

    return (
        <aside className="sidebar">
        <div className="sidebar-brand">
            <span className="sidebar-icon">L</span>
            <span className="sidebar-label">Library</span>
        </div>

        <nav className="sidebar-nav">
            <Link to="/home">
            <span className="sidebar-icon">H</span>
            <span className="sidebar-label">Home</span>
            </Link>

            <Link to="/books">
            <span className="sidebar-icon">B</span>
            <span className="sidebar-label">Books</span>
            </Link>

            {user?.role === "student" && (
            <Link to="/my-books">
                <span className="sidebar-icon">M</span>
                <span className="sidebar-label">My Books</span>
            </Link>
            )}

            {user?.role === "admin" && (
            <Link to="/borrow-records">
                <span className="sidebar-icon">R</span>
                <span className="sidebar-label">Records</span>
            </Link>
            )}
        </nav>

        <div className="sidebar-footer">
            {user ? (
            <button type="button" onClick={handleLogout}>
                <span className="sidebar-icon">O</span>
                <span className="sidebar-label">Logout</span>
            </button>
            ) : (
            <Link to="/login">
                <span className="sidebar-icon">I</span>
                <span className="sidebar-label">Login</span>
            </Link>
            )}
        </div>
        </aside>
    );
}

export default Sidebar;