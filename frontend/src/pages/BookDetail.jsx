import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function BookDetail() {
    const { id } = useParams();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

            <div className="book-description">
            <h2>Description</h2>
            <p>{book.description || "No description available."}</p>
            </div>
        </section>
        </main>
    );
}

export default BookDetail;