import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
    name: "",
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
        const response = await api.post("/register", form);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        navigate("/books");
        } catch (error) {
        setError("Register failed. Please check your details.");
        }
    }

        return (
            <div className="auth-card">
            <h1>Register</h1>
        
            {error && <p className="error">{error}</p>}
        
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                />
                </div>
        
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
        
                <button type="submit">Register</button>
            </form>

            <div className="auth-links">
                <p>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>

                <Link to="/books">Continue as guest</Link>
                </div>
            </div>
        );
    }

export default Register;