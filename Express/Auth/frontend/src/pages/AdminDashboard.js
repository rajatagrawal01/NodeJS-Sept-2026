import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function AdminDashboard() {

    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    const getUsers = async () => {

        try {

            const response = await API.get("/users");

            setUsers(response.data.users);

        } catch (error) {

            alert(error.response?.data?.message || "Failed to fetch users");

        }
    };

    useEffect(() => {

        getUsers();

    }, []);

    const deleteUser = async (id) => {

        try {

            await API.delete(`/users/${id}`);

            alert("User deleted successfully");

            getUsers();

        } catch (error) {

            alert(error.response?.data?.message || "Delete failed");

        }
    };

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");

    };

    return (
        <div>

            <h2>Admin Dashboard</h2>

            <button onClick={logout}>Logout</button>

            <h3>Registered Users</h3>

            <table border="1" cellPadding="10">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {users.map((user) => (

                        <tr key={user._id}>

                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>

                            <td>
                                <button
                                    disabled={user.role === "admin"}
                                    onClick={() => deleteUser(user._id)}
                                >
                                    Delete
                                </button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default AdminDashboard;