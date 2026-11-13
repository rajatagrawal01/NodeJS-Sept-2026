const express = require("express");
const fs = require("fs");
const path = require("path");



const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

const usersFile = path.join(__dirname, "users.json");

if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, "[]");
}

app.post("/users", (req, res) => {

    const data = fs.readFileSync(usersFile, "utf-8");

    const users = data.trim() === "" ? [] : JSON.parse(data);
    console.log(req.body);
    
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    users.push(newUser);

    fs.writeFileSync(
        usersFile,
        JSON.stringify(users, null, 2)
    );

    res.send("User registered successfully!");
});

app.get("/userlist", (req, res) => {
    

    fs.readFile(usersFile, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading user.json");
        }

        const users = JSON.parse(data);

        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>User List</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 30px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    th, td {
                        border: 1px solid #ccc;
                        padding: 12px;
                        text-align: left;
                    }

                    th {
                        background-color: #333;
                        color: white;
                    }

                    img {
                        width: 60px;
                        height: 60px;
                        object-fit: cover;
                        border-radius: 50%;
                    }
                </style>
            </head>
            <body>
                <h1>User List</h1>

                <table>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Image</th>
                    </tr>
        `;

        users.forEach(user => {
            html += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        ${
                            user.image
                                ? `<img src="/${user.image}" alt="Profile picture">`
                                : "No Image"
                        }
                    </td>
                </tr>
            `;
        });

        html += `
                </table>
            </body>
            </html>
        `;

        res.send(html);
    });
});
app.get("/userlist/:id", (req, res) => {


    const userId = req.params.id;

   
    
    fs.readFile(usersFile, "utf8", (err, data) => {

        if (err) {
            return res.status(500).send("Error reading user.json");
        }

        const users = JSON.parse(data);

      
        const user = users.find(u => u.id === Number(userId));

       
        if (!user) {
            return res.status(404).send("User not found!");
        }

       
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>User Details</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 40px;
                    }

                    .card {
                        border: 1px solid #ccc;
                        padding: 20px;
                        width: 350px;
                        border-radius: 10px;
                    }

                    img {
                        width: 120px;
                        height: 120px;
                        object-fit: cover;
                        border-radius: 50%;
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>User Details</h1>

                    <p><strong>ID:</strong> ${user.id}</p>
                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>

                    ${
                        user.image
                            ? `<img src="/${user.image}" alt="Profile picture">`
                            : "<p>No profile picture available</p>"
                    }

                    <br><br>
                    <a href="/">Back to Home</a>
                </div>
            </body>
            </html>
        `;

        res.send(html);
    });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});