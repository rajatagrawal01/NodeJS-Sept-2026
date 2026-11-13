import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await API.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", response.data.token);

            if (response.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }

        } catch (error) {

            alert(error.response?.data?.message || "Login failed");

        }
    };

    return (
        <div>

            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <p>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </p>

                <p>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </p>

                <button type="submit">Login</button>

            </form>

            <p>
                Don't have an account?
                <Link to="/register"> Register</Link>
            </p>

        </div>
    );
}

export default Login;