import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Books() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adminMode, setAdminMode] = useState("");
    const [selectedBookIds, setSelectedBookIds] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        async function fetchBooks() {
        try {
            const response = await api.get("/books");
            setBooks(response.data);
        } catch (error) {
            setError("Failed to load books.");
        } finally {
            setLoading(false);
        }
        }

        fetchBooks();
    }, []);

    async function handleLogout() {
        try {
        await api.post("/logout");
        } catch (error) {
        console.log("Logout failed, but local data will still be cleared.");
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    }

    function handleAdminMode(mode) {
        setError("");
        setSelectedBookIds([]);
        setAdminMode(mode);
    }

    function handleBookClick(bookId) {
        if (adminMode === "edit") {
        navigate(`/books/${bookId}/edit`);
        return;
        }

        if (adminMode === "delete") {
        toggleBookSelection(bookId);
        return;
        }

        navigate(`/books/${bookId}`);
    }

    function toggleBookSelection(bookId) {
        if (selectedBookIds.includes(bookId)) {
        setSelectedBookIds(selectedBookIds.filter((id) => id !== bookId));
        return;
        }

        setSelectedBookIds([...selectedBookIds, bookId]);
    }

    async function handleDeleteSelectedBooks() {
        if (selectedBookIds.length === 0) {
        setError("Please select at least one book to delete.");
        return;
        }

        const confirmed = window.confirm(
        `Are you sure you want to delete ${selectedBookIds.length} book(s)?`
        );

        if (!confirmed) {
        return;
        }

        try {
        await Promise.all(
            selectedBookIds.map((bookId) => api.delete(`/books/${bookId}`))
        );

        setBooks(books.filter((book) => !selectedBookIds.includes(book.id)));
        setSelectedBookIds([]);
        setAdminMode("");
        } catch (error) {
        setError("Failed to delete selected books.");
        }
    }

    return (
        <>
        <Navbar user={user} onLogout={handleLogout} />

        <main className="page">
            <div className="page-header">
                <div>
                    <h1>Books</h1>

                    {user ? (
                    <p>
                        Logged in as {user.name} ({user.role})
                    </p>
                    ) : (
                    <p>You are browsing as guest.</p>
                    )}
                </div>

            {isAdmin && (
                <div className="admin-toolbar">
                    <button className="admin-icon-button add-button"
                        type="button"
                        onClick={() => navigate("/books/add")}>
                        
                        <span className="button-icon">+</span>
                        <span className="button-label">Add Book</span>
                    </button>

                    <button
                        className={adminMode === "edit"
                        ? "admin-icon-button edit-mode-button active"
                        : "admin-icon-button edit-mode-button"
                    }
                        type="button"
                        onClick={() => handleAdminMode("edit")}
                    >
                        <span className="button-icon">✎</span>
                        <span className="button-label">Edit</span>
                    </button>

                    <button
                        className={
                        adminMode === "delete"
                        ? "admin-icon-button delete-mode-button active"
                        : "admin-icon-button delete-mode-button"
                        }
                        type="button"
                        onClick={() => handleAdminMode("delete")}
                    >
                        <span className="button-icon">×</span>
                        <span className="button-label">Delete</span>
                    </button>

                    {adminMode && (
                        <button
                        className="admin-icon-button cancel-mode-button"
                        type="button"
                        onClick={() => handleAdminMode("")}
                        >
                        <span className="button-icon">↩</span>
                        <span className="button-label">Cancel</span>
                    </button>
                    )}
                </div>
            )}
            </div>

            {adminMode === "edit" && (
            <p className="admin-mode-message">Select one book to edit.</p>
            )}

            {adminMode === "delete" && (
            <div className="admin-mode-message delete-mode-bar">
                <span>Selected: {selectedBookIds.length}</span>

                <button type="button" onClick={handleDeleteSelectedBooks}>
                Delete Selected
                </button>
            </div>
            )}

            {loading && <p>Loading books...</p>}

            {error && <p className="error">{error}</p>}

            {!loading && !error && books.length === 0 && (
            <div className="status-box">
                <p>No books found.</p>
            </div>
            )}

            {!loading && !error && books.length > 0 && (
            <div className="book-grid">
                {books.map((book) => (
                <div
                    className={`book-card ${
                    selectedBookIds.includes(book.id) ? "selected" : ""
                    }`}
                    key={book.id}
                    onClick={() => handleBookClick(book.id)}
                >
                    {adminMode === "delete" && (
                    <input
                        className="book-select-checkbox"
                        type="checkbox"
                        checked={selectedBookIds.includes(book.id)}
                        onChange={() => toggleBookSelection(book.id)}
                        onClick={(event) => event.stopPropagation()}
                    />
                    )}

                    <div className="book-cover">
                    {book.cover_image_url ? (
                        <img src={book.cover_image_url} alt={book.title} />
                    ) : (
                        <span>No Cover</span>
                    )}
                    </div>

                    <div className="book-card-content">
                    <div className="book-card-header">
                        <span>{book.category || "Uncategorized"}</span>
                        <strong>
                        {book.available_copies > 0 ? "Available" : "Unavailable"}
                        </strong>
                    </div>

                    <h2>{book.title}</h2>

                    <p className="book-author">by {book.author}</p>

                    <p className="book-description-preview">
                        {book.description || "No description available."}
                    </p>

                    <div className="book-card-footer">
                        <span>ISBN: {book.isbn}</span>
                        <span>
                        {book.available_copies} / {book.total_copies}
                        </span>
                    </div>

                    <div className="book-actions">
                        <span className="details-button">
                        {adminMode === "edit" ? "Select to Edit" : "View Details"}
                        </span>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </main>
        </>
    );
    }

    function Navbar({ user, onLogout }) {
    return (
        <div className="navbar">
        <strong>Library System</strong>

        <nav>
            <Link to="/home">Home</Link>
            <Link to="/books">Books</Link>

            {user ? (
            <button className="logout-button" onClick={onLogout}>
                Logout
            </button>
            ) : (
            <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </>
            )}
        </nav>
        </div>
    );
}

export default Books;