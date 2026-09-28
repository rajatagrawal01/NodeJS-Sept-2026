// =========================
// LOAD USERS
// =========================

function loadUsers() {

    fetch("/users")

        .then(response => response.json())

        .then(users => {

            const table =
                document.getElementById("userTable");

            // Clear existing rows
            table.innerHTML = "";

            users.forEach(user => {

                const row =
                    document.createElement("tr");

                row.innerHTML = `

                    <td>
                        ${user.name}
                    </td>

                    <td>
                        ${user.age}
                    </td>

                    <td>

                        <button
                            onclick="editUser(${user.id})">
                            Edit
                        </button>

                        <button
                            onclick="deleteUser(${user.id})">
                            Delete
                        </button>

                    </td>
                `;

                table.appendChild(row);
            });

        })

        .catch(error => {

            console.log(
                "Error loading users:",
                error
            );

        });
}


// =========================
// DELETE USER
// =========================

function deleteUser(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) {
        return;
    }

    fetch("/delete", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            id: id
        })

    })

    .then(response => response.json())

    .then(data => {

        console.log(data.message);

        // Reload users
        loadUsers();

    })

    .catch(error => {

        console.log(
            "Error deleting user:",
            error
        );

    });
}


// =========================
// EDIT USER
// =========================

function editUser(id) {

    const name =
        prompt("Enter new name:");

    if (name === null || name.trim() === "") {
        return;
    }

    const age =
        prompt("Enter new age:");

    if (age === null || age.trim() === "") {
        return;
    }

    fetch("/edit", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            id: id,

            name: name,

            age: Number(age)

        })

    })

    .then(response => response.json())

    .then(data => {

        console.log(data.message);

        // Reload users
        loadUsers();

    })

    .catch(error => {

        console.log(
            "Error updating user:",
            error
        );

    });
}


// =========================
// LOAD USERS WHEN PAGE LOADS
// =========================

loadUsers();