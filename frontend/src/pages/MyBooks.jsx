import { useEffect, useState } from "react";
import api from "../api/axios";

function MyBooks() {
    const [borrowings, setBorrowings] = useState([]);
    const [selectedBookIds, setSelectedBookIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function fetchMyBooks() {
        try {
        const response = await api.get("/my-borrowings");
        setBorrowings(response.data);
        } catch (error) {
        setError("Failed to load borrowed books.");
        } finally {
        setLoading(false);
        }
    }

    function toggleSelection(bookId) {
        if (selectedBookIds.includes(bookId)) {
        setSelectedBookIds(selectedBookIds.filter((id) => id !== bookId));
        return;
        }

        setSelectedBookIds([...selectedBookIds, bookId]);
    }

    async function handleReturnSelected() {
        if (selectedBookIds.length === 0) {
        setError("Please select at least one book to return.");
        return;
        }

        setError("");
        setMessage("");

        try {
        await Promise.all(
            selectedBookIds.map((bookId) => api.post(`/books/${bookId}/return`))
        );

        setBorrowings(
            borrowings.filter(
            (borrowing) => !selectedBookIds.includes(borrowing.book_id)
            )
        );

        setSelectedBookIds([]);
        setMessage("Selected books returned successfully.");
        } catch (error) {
        setError(error.response?.data?.message || "Failed to return selected books.");
        }
    }

    useEffect(() => {
        fetchMyBooks();
    }, []);

    if (loading) {
        return (
        <main className="page">
            <p>Loading borrowed books...</p>
        </main>
        );
    }

    return (
        <main className="page">
        <div className="page-header">
            <div>
            <h1>My Books</h1>
            <p>Books you are currently borrowing.</p>
            </div>

            <button
            className="return-selected-button"
            type="button"
            onClick={handleReturnSelected}
            >
            Return Selected
            </button>
        </div>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        {borrowings.length === 0 ? (
            <div className="status-box">
            <p>You have no borrowed books.</p>
            </div>
        ) : (
            <div className="borrowed-table">
            {borrowings.map((borrowing) => (
                <div className="borrowed-row" key={borrowing.id}>
                <input
                    type="checkbox"
                    checked={selectedBookIds.includes(borrowing.book_id)}
                    onChange={() => toggleSelection(borrowing.book_id)}
                />

                <div>
                    <h3>{borrowing.book.title}</h3>
                    <p>Borrowed at: {borrowing.borrowed_at}</p>
                </div>

                <span>{borrowing.book.category || "Uncategorized"}</span>
                </div>
            ))}
            </div>
        )}
        </main>
    );
}

export default MyBooks;