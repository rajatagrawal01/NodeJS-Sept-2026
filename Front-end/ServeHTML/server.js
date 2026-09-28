const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    let fileName;
      let contentType;

    if (req.url === "/") {
        fileName = "index.html";
        contentType = "text/html"
    }

    else if (req.url === "/rajat") {
        fileName = "user1.html";
        contentType = "text/html"
    }

    else if (req.url === "/amit") {
        fileName = "user2.html";
        contentType = "text/html"
    }
    else if (req.url === "/index.css") {
        fileName = "index.css";
        contentType = "text/css"
    }

    else {

        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("404 - Page Not Found");
        return;
    }
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
});

server.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});
