import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function AddBook() {
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
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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

    if (coverImage) {
      data.append("cover_image", coverImage);
    }

    try {
      await api.post("/books", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/books");
    } catch (error) {
      setError("Failed to add book.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page">
      <Link className="back-link" to="/books">
        Back to books
      </Link>

      <div className="auth-card book-form-card">
        <h1>Add Book</h1>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="cover-upload-section">
            <div className="current-cover-preview">
              <p>Book Cover</p>
              <div className="empty-cover-preview">No Cover</div>
            </div>

            <div className="form-group">
              <label className="file-label">Upload Cover</label>
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
            {saving ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default AddBook;