const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const { log } = require("console");

const server = http.createServer((req, res) => {

    let fileName;
    let contentType;

    if (req.url === "/" && req.method === "GET") {

        fileName = "index.html";
        contentType = "text/html";

        fs.readFile(path.join(__dirname, fileName), (err, data) => {

            if (err) {
                res.writeHead(500);
                res.end("Error loading page");
                return;
            }

            res.writeHead(200, {
                "Content-Type": contentType
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

            console.log(data);

            fs.readFile("users.json", (err, fileData) => {

                let users = [];

                if (!err) {
                    users = JSON.parse(fileData);
                }
                console.log("Old user array: ",users);
                
                users.push(data);
                console.log("New user array: ",users);
                
                
                fs.writeFile(
                    "users.json",
                    JSON.stringify(users),
                    (err) => {

                        if (err) {
                            console.log(err);
                            return;
                        }

                        console.log("User saved successfully");

                        res.writeHead(200, {
                            "Content-Type": "text/html"
                        });

                        res.end(`
                        <h1>Data received successfully</h1>
                        <a href="/">Back to Form</a>
                    `);
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
    console.log("Server running at http://localhost:5000");
});