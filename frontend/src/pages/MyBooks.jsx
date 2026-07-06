import { useEffect, useState } from "react";
import api from "../api/axios";

function MyBooks() {
    const [borrowings, setBorrowings] = useState([]);
    const [selectedBookIds, setSelectedBookIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [returnMode, setReturnMode] = useState(false);

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
        setReturnMode(false);
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

    function cancelReturnMode() {
        setReturnMode(false);
        setSelectedBookIds([]);
        setError("");
    }

    return (
        <main className="page">
        <div className="my-books-header">
            <h1>My Books</h1>

        <div className="my-books-subheader">
            <p>Books you are currently borrowing.</p>

            <div className="my-books-actions">
                {returnMode ? (
                    <>
                        <button
                            className="return-selected-button"
                            type="button"
                            onClick={handleReturnSelected}
                    >
                            Return Selected
                        </button>

                        <button
                            className="cancel-return-button"
                            type="button"
                            onClick={cancelReturnMode}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        className="return-selected-button"
                        type="button"
                        onClick={() => setReturnMode(true)}
                        >
                        Return
                    </button>
                )}
                </div>
            </div>
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
                <div className={`borrowed-row ${returnMode ? "return-mode" : ""}`}
                    key={borrowing.id}
                >

                    <div className="borrowed-cover">
                        {borrowing.book.cover_image_url ? (
                        <img src={borrowing.book.cover_image_url} alt={borrowing.book.title} />
                        ) : (
                        <span>No Cover</span>
                        )}
                    </div>

                    <div>
                        <h3>{borrowing.book.title}</h3>
                        <p>Borrowed at: {borrowing.borrowed_at}</p>
                    </div>

                    <span>{borrowing.book.category || "Uncategorized"}</span>

                    {returnMode && (
                        <input
                            type="checkbox"
                            checked={selectedBookIds.includes(borrowing.book_id)}
                            onChange={() => toggleSelection(borrowing.book_id)}
                        />
                        )}
                </div>
            ))}
            </div>
        )}
        </main>
    );
}

export default MyBooks;