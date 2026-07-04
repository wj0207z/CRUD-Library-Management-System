import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    function handleChange(event) {
        setForm({
        ...form,
        [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        try {
        const response = await api.post("/login", form);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        navigate("/books");
        } catch (error) {
        setError("Login failed. Please check your email and password.");
        }
    }

        return (
            <div className="auth-card">
            <h1>Login</h1>
        
            {error && <p className="error">{error}</p>}
        
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />
                </div>
        
                <div className="form-group">
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />
                </div>
        
                <button type="submit">Login</button>
            </form>

            <div className="auth-links">
                <p>
                    New student? <Link to="/register">Register now</Link>
                </p>

                <Link to="/books">Continue as guest</Link>
                </div>
            </div>
        );
    }

export default Login;