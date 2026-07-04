import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

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

    useEffect(() => {
        fetchBooks();
    }, []);

    if (loading) {
        return (
        <>
            <Navbar user={user} onLogout={handleLogout} />

            <main className="page">
            <p>Loading books...</p>
            </main>
        </>
        );
    }

    return (
        <>
        <Navbar user={user} onLogout={handleLogout} />

        <main className="page">
            <h1>Books</h1>

            {error && <p className="error">{error}</p>}

            {books.length === 0 ? (
            <div className="status-box">
                <p>No books found.</p>
            </div>
            ) : (
            <div className="book-grid">
                {books.map((book) => (
                <div className="book-card" key={book.id}>
                    <Link className="book-card" to={`/books/${book.id}`} key={book.id}>
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
                    </Link>
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
            {user ? (
            <>
                <span className="nav-user">
                {user.name} ({user.role})
                </span>
                <button className="logout-button" onClick={onLogout}>
                Logout
                </button>
            </>
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