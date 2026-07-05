import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function EditBook() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        author: "",
        isbn: "",
        category: "",
        description: "",
        total_copies: 1,
        available_copies: 1,
    });

    const [coverImage, setCoverImage] = useState(null);
    const [currentCover, setCurrentCover] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchBook() {
        try {
            const response = await api.get(`/books/${id}`);

            setForm({
            title: response.data.title ?? "",
            author: response.data.author ?? "",
            isbn: response.data.isbn ?? "",
            category: response.data.category ?? "",
            description: response.data.description ?? "",
            total_copies: response.data.total_copies ?? 1,
            available_copies: response.data.available_copies ?? 0,
            });

            setCurrentCover(response.data.cover_image_url ?? "");
        } catch (error) {
            setError("Failed to load book.");
        } finally {
            setLoading(false);
        }
        }

        fetchBook();
    }, [id]);

    function handleChange(event) {
        setForm({
        ...form,
        [event.target.name]: event.target.value,
        });
    }

    function handleFileChange(event) {
        setCoverImage(event.target.files[0]);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSaving(true);

        const data = new FormData();

        data.append("title", form.title);
        data.append("author", form.author);
        data.append("isbn", form.isbn);
        data.append("category", form.category);
        data.append("description", form.description);
        data.append("total_copies", Number(form.total_copies));
        data.append("available_copies", Number(form.available_copies));
        data.append("_method", "PUT");

        if (coverImage) {
        data.append("cover_image", coverImage);
        }

        try {
        await api.post(`/books/${id}`, data, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        });

        navigate("/books");
        } catch (error) {
        setError("Failed to update book.");
        } finally {
        setSaving(false);
        }
    }

    if (loading) {
        return (
        <main className="page">
            <p>Loading book...</p>
        </main>
        );
    }

    return (
        <main className="page">
        <Link className="back-link" to="/books">
            Back to books
        </Link>

        <div className="auth-card book-form-card">
            <h1>Edit Book</h1>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="cover-upload-section">
                    {currentCover ? (
                        <div className="current-cover-preview">
                            <p>Current Cover</p>
                            <img src={currentCover} alt="Current book cover" />
                        </div>
                    ) : (
                        <div className="current-cover-preview">
                            <p>Current Cover</p>
                        <div className="empty-cover-preview">No Cover</div>
                </div>
                )}

                    <div className="form-group">
                            <label className="file-label">Upload New Cover</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                </div>

                <div className="form-group">
                    <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <input
                    name="author"
                    placeholder="Author"
                    value={form.author}
                    onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <input
                    name="isbn"
                    placeholder="ISBN"
                    value={form.isbn}
                    onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <input
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                    <input
                        name="total_copies"
                        type="number"
                        min="1"
                        placeholder="Total copies"
                        value={form.total_copies}
                        onChange={handleChange}
                    />
                    </div>

                <div className="form-group">
                <input
                    name="available_copies"
                    type="number"
                    min="0"
                    placeholder="Available copies"
                    value={form.available_copies}
                    onChange={handleChange}
                />
                </div>
            </div>

            <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
            </button>
            </form>
        </div>
        </main>
    );
}

export default EditBook;