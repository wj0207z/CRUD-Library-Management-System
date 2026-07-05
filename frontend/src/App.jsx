import { Link, Route, Routes } from "react-router-dom";
import AddBook from "./pages/AddBook";
import BookDetail from "./pages/BookDetail";
import Books from "./pages/Books";
import EditBook from "./pages/EditBook";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <div className="navbar">
        <strong>Library System</strong>

        <nav>
          <Link to="/home">Home</Link>
          <Link to="/books">Books</Link>

          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>

      <main className="page">
        <div className="status-box">
          <h1>Library Management System</h1>

          {user ? (
            <p>
              Logged in as {user.name} ({user.role})
            </p>
          ) : (
            <p>You are browsing as guest.</p>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/books/:id/edit" element={<EditBook />} />
        <Route path="/books/add" element={<AddBook />} />
      </Routes>
    </div>
  );
}

export default App;