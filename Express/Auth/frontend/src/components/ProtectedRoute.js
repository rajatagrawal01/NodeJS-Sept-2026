
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";

function ProtectedRoute({ children, role }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const verifyUser = async () => {

            try {

                const response = await API.get("/auth/me");

                setUser(response.data.user);

            } catch (error) {

                localStorage.removeItem("token");

                setUser(null);

            } finally {

                setLoading(false);

            }
        };

        verifyUser();

    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    // Not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Wrong role
    if (role && user.role !== role) {

        if (user.role === "admin") {
            return <Navigate to="/admin" replace />;
        }

        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default ProtectedRoute;
