const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

const server = http.createServer((req, res) => {
    if (req.url === "/" && req.method === "GET") {
        fs.readFile(path.join(__dirname, "index.html"), (err, data) => {

            if (err) {
                res.writeHead(500);
                res.end("Error loading page");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });
    }


    else if (req.url === "/style.css" && req.method === "GET") {

        fs.readFile(path.join(__dirname, "style.css"), (err, data) => {

            if (err) {
                res.writeHead(500);
                res.end("Error loading CSS");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/css"
            });

            res.end(data);
        });
    }

    else if (req.url === "/script.js" && req.method === "GET") {

        fs.readFile(path.join(__dirname, "script.js"), (err, data) => {

            if (err) {
                res.writeHead(500);
                res.end("Error loading JavaScript");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/javascript"
            });

            res.end(data);
        });
    }


    else if (req.url === "/submit" && req.method === "POST") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            const data = querystring.parse(body);

            const filePath = path.join(__dirname, "users.json");

            fs.readFile(filePath, "utf8", (err, fileData) => {

                let users = [];

                if (!err && fileData.trim() !== "") {
                    users = JSON.parse(fileData);
                }

                const newUser = {

                    id: users.length > 0
                        ? users[users.length - 1].id + 1
                        : 1,

                    name: data.name,

                    age: Number(data.age)
                };

                users.push(newUser);

                fs.writeFile(
                    filePath,
                    JSON.stringify(users, null, 2),
                    (err) => {

                        if (err) {
                            res.writeHead(500);
                            res.end("Error saving user");
                            return;
                        }

                        res.writeHead(302, {
                            "Location": "/"
                        });

                        res.end();
                    }
                );
            });
        });
    }


    else if (req.url === "/users" && req.method === "GET") {

        const filePath = path.join(__dirname, "users.json");

        fs.readFile(filePath, "utf8", (err, data) => {

            if (err) {

                res.writeHead(500, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    error: "Unable to read users"
                }));

                return;
            }

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(data);
        });
    }

    else if (req.url === "/delete" && req.method === "POST") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            const data = JSON.parse(body);

            const filePath = path.join(__dirname, "users.json");

            fs.readFile(filePath, "utf8", (err, fileData) => {

                if (err) {
                    res.writeHead(500);
                    res.end("Error reading users");
                    return;
                }

                let users = JSON.parse(fileData);

                users = users.filter(user => user.id !== data.id);

                fs.writeFile(
                    filePath,
                    JSON.stringify(users, null, 2),
                    (err) => {

                        if (err) {
                            res.writeHead(500);
                            res.end("Error deleting user");
                            return;
                        }

                        res.writeHead(200, {
                            "Content-Type": "application/json"
                        });

                        res.end(JSON.stringify({
                            message: "User deleted successfully"
                        }));
                    }
                );
            });
        });
    }


    else if (req.url === "/edit" && req.method === "POST") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            const data = JSON.parse(body);

            const filePath = path.join(__dirname, "users.json");

            fs.readFile(filePath, "utf8", (err, fileData) => {

                if (err) {
                    res.writeHead(500);
                    res.end("Error reading users");
                    return;
                }

                let users = JSON.parse(fileData);

                users = users.map(user => {

                    if (user.id === data.id) {

                        return {
                            id: user.id,
                            name: data.name,
                            age: Number(data.age)
                        };
                    }

                    return user;
                });

                fs.writeFile(
                    filePath,
                    JSON.stringify(users, null, 2),
                    (err) => {

                        if (err) {
                            res.writeHead(500);
                            res.end("Error updating user");
                            return;
                        }

                        res.writeHead(200, {
                            "Content-Type": "application/json"
                        });

                        res.end(JSON.stringify({
                            message: "User updated successfully"
                        }));
                    }
                );
            });
        });
    }


    else {

        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("404 - Page Not Found");
    }

});

server.listen(5000, () => {

    console.log(
        "Server running at http://localhost:5000"
    );

});