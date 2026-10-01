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


app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});