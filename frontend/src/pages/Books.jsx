import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Books() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

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

    async function handleDeleteBook(bookId) {
        const confirmed = window.confirm("Are you sure you want to delete this book?");

        if (!confirmed) {
        return;
        }

        try {
        await api.delete(`/books/${bookId}`);

        setBooks(books.filter((book) => book.id !== bookId));
        } catch (error) {
        setError("Failed to delete book.");
        }
    }

    return (
        <>
        <Navbar user={user} onLogout={handleLogout} />

        <main className="page">
            <div className="page-header">
            <h1>Books</h1>

            {user ? (
                <p>
                Logged in as {user.name} ({user.role})
                </p>
            ) : (
                <p>You are browsing as guest.</p>
            )}
            </div>

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
                <div className="book-card" key={book.id}>
                    <div className="book-cover">
                    {book.cover_image ? (
                        <img src={book.cover_image} alt={book.title} />
                    ) : (
                        <span>No Cover</span>
                    )}
                    </div>

                    <div className="book-card-content">
                    <div className="book-card-header">
                        <span>{book.category || "Uncategorized"}</span>
                        <strong>
                        {book.available_copies > 0
                            ? "Available"
                            : "Unavailable"}
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
                        <Link className="details-button" to={`/books/${book.id}`}>
                            View Details
                        </Link>

                        {user?.role === "admin" && (
                            <>
                            <Link className="edit-button" to={`/books/${book.id}/edit`}>
                                Edit
                            </Link>

                            <button
                                className="delete-button"
                                type="button"
                                onClick={() => handleDeleteBook(book.id)}
                            >
                                Delete
                            </button>
                            </>
                        )}
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