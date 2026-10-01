const express = require("express");
const path = require("path")

const app = express();
app.use(express.static("public"));
var fileName
app.get("/rajat", (req, res) => {
    fileName=path.join(__dirname, "public", "rajat.html")
    res.sendFile(fileName);
});

app.get("/amit", (req, res) => {
    fileName=path.join(__dirname, "public", "amit.html")
    res.sendFile(fileName);
});


app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});