const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);

    const fileName = Date.now() + extension;

    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/users", upload.single("profilePicture"), (req, res) => {
  console.log("Form Data:");
  console.log(req.body);

  console.log("File Data:");
  console.log(req.file);

  const newUser = {
    id: Date.now(),

    name: req.body.name,

    age: Number(req.body.age),

    profilePicture: req.file.filename,
  };

  const filePath = path.join(__dirname, "users.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    let users = [];

    if (!err && data.trim() !== "") {
      users = JSON.parse(data);
    }

    users.push(newUser);

    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.log(err);

        res.status(500).send("Error saving user");

        return;
      }

      res.send(`

                    <h1>User Added Successfully</h1>

                    <p>Name: ${newUser.name}</p>

                    <p>Age: ${newUser.age}</p>

                    <img
                        src="/uploads/${newUser.profilePicture}"
                        width="150"
                    >

                    <br><br>

                    <a href="/">Back to Form</a>

                `);
    });
  });
});

app.get("/users", (req, res) => {
  const filePath = path.join(__dirname, "users.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({
        message: "Error reading users",
      });

      return;
    }

    const users = JSON.parse(data);

    res.json(users);
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
