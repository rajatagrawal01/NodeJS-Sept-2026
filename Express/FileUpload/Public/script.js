function loadUsers() {

    fetch("/users")
        .then(response => response.json())
        .then(users => {

            const table = document.getElementById("userTable");

            table.innerHTML = "";

            users.forEach(user => {

                table.innerHTML += `
                    <tr>

                        <td>
                            <img
                                src="/uploads/${user.profilePicture}"
                                width="80"
                                height="80"
                            >
                        </td>

                        <td>${user.name}</td>

                        <td>${user.age}</td>

                    </tr>
                `;

            });

        });

}

loadUsers();