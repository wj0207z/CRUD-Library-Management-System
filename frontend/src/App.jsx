import { Link, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AddBook from "./pages/AddBook";
import BookDetail from "./pages/BookDetail";
import Books from "./pages/Books";
import EditBook from "./pages/EditBook";
import Login from "./pages/Login";
import MyBooks from "./pages/MyBooks";
import Register from "./pages/Register";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
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

        {!user && (
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </main>
  );
}

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="app-layout">
      {user && <Sidebar />}

      <div className="app-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/add" element={<AddBook />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/books/:id/edit" element={<EditBook />} />
          <Route path="/my-books" element={<MyBooks />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;