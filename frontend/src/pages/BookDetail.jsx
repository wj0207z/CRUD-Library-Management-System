import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function BookDetail() {
    const { id } = useParams();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const isStudent = user?.role === "student";

    async function fetchBook() {
        try {
        const response = await api.get(`/books/${id}`);
        setBook(response.data);
        } catch (error) {
        setError("Failed to load book details.");
        } finally {
        setLoading(false);
        }
    }

    async function handleBorrow(){
        setError("");
        setMessage("");
        setActionLoading(true);

        try{
            const response = await api.post(`/books/${id}/borrow`);
            setMessage(response.data.message);
            fetchBook();
        }  catch (error) {
            setError (error.response?.data?.message || "Failed to borrow book.");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleReturn() {
        setError("");
        setMessage("");
        setActionLoading(true);
    
        try {
        const response = await api.post(`/books/${id}/return`);
            setMessage(response.data.message);
            fetchBook();
        } catch (error) {
            setError(error.response?.data?.message || "Failed to return book.");
        } finally {
            setActionLoading(false);
        }
    }

    useEffect(() => {
        fetchBook();
    }, [id]);

    if (loading) {
        return (
        <main className="page">
            <p>Loading book...</p>
        </main>
        );
    }

    if (error) {
        return (
        <main className="page">
            <p className="error">{error}</p>
            <Link to="/books">Back to books</Link>
        </main>
        );
    }

    return (
        <main className="page">
        <Link className="back-link" to="/books">
            Back to books
        </Link>

        <section className="book-detail">
            <div>
            <p className="book-category">{book.category || "Uncategorized"}</p>
            <h1>{book.title}</h1>
            <p className="book-author">by {book.author}</p>
            </div>

            <div className="book-meta">
            <p>
                <strong>ISBN</strong>
                <span>{book.isbn}</span>
            </p>
            <p>
                <strong>Available</strong>
                <span>
                {book.available_copies} / {book.total_copies}
                </span>
            </p>
            </div>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            {isStudent ? (
                <div className="borrow-actions">
                    {book.is_borrowed_by_current_user ? (
                        <button
                            className="return-button"
                            type="button"
                            onClick={handleReturn}
                            disabled={actionLoading}
                        >
                            {actionLoading ? "Processing..." : "Return Book"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleBorrow}
                            disabled={actionLoading || book.available_copies <= 0 }
                        >
                            {actionLoading ? "Processing..." : "Borrow Book"}
                        </button>
                    )}
                </div>
            ) : user ? (
                <p className="status-note">Admin users manage books and cannot borrow.</p>
            ) : (
                <p className="status-note">Login as a student to borrow this book.</p>
            )}

            <div className="book-description">
            <h2>Description</h2>
            <p>{book.description || "No description available."}</p>
            </div>
        </section>
        </main>
    );
}

export default BookDetail;