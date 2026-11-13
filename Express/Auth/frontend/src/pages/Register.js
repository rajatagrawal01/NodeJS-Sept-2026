import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            const response = await API.post("/auth/register", {
                name,
                email,
                password
            });

            alert(response.data.message);

            navigate("/login");

        } catch (error) {

            alert(error.response?.data?.message || "Registration failed");

        }
    };

    return (
        <div>

            <h2>Register</h2>

            <form onSubmit={handleRegister}>

                <p>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </p>

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

                <button type="submit">Register</button>

            </form>

            <p>
                Already registered?
                <Link to="/login"> Login</Link>
            </p>

        </div>
    );
}

export default Register;