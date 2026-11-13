import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Dashboard() {

    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        const getProfile = async () => {

            try {

                const response = await API.get("/users/profile");

                setUser(response.data.user);

            } catch (error) {

                localStorage.removeItem("token");

                navigate("/login");

            }
        };

        getProfile();

    }, [navigate]);

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");

    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>

            <h2>User Dashboard</h2>

            <p>Welcome: {user.name}</p>

            <p>Email: {user.email}</p>

            <p>Role: {user.role}</p>

            <button onClick={logout}>Logout</button>

        </div>
    );
}

export default Dashboard;