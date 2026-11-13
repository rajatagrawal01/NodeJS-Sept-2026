// const { MongoClient } = require("mongodb");

// const uri = "mongodb+srv://edurajatagrawal_db_user:AB5Vu3PUiYmia9K7@cluster0.ikkthnl.mongodb.net/";
// const client = new MongoClient(uri);

// async function main() {
//     try {
//         await client.connect();

//         await client.db("admin").command({ ping: 1 });
//         console.log("Connected to MongoDB Atlas!");

//         const db = client.db("CollegeDB");
//         const students = db.collection("Students");

//         console.log("Database and collection are ready.");
//     } catch (error) {
//         console.error("Connection failed:", error.message);
//     } finally {
//         await client.close();
//     }
// }

// main();



const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = "mongodb+srv://edurajatagrawal_db_user:AB5Vu3PUiYmia9K7@cluster0.ikkthnl.mongodb.net/";

app.use(express.json());

const client = new MongoClient(MONGODB_URI || "");
let students;
function isValidObjectId(id) {
    return (
        ObjectId.isValid(id) &&
        String(new ObjectId(id)) === id
    );
}

function validateStudent(body, partial = false) {
    const allowedFields = ["name", "course", "city", "fees"];
    const errors = [];

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return ["Request body must be a JSON object."];
    }

    const unknownFields = Object.keys(body).filter(
        key => !allowedFields.includes(key)
    );

    if (unknownFields.length) {
        errors.push(`Unknown fields: ${unknownFields.join(", ")}`);
    }

    if (!partial && !("name" in body)) {
        errors.push("Name is required.");
    }

    for (const field of ["name", "course", "city"]) {
        if (field in body) {
            if (
                typeof body[field] !== "string" ||
                !body[field].trim()
            ) {
                errors.push(`${field} must be a non-empty string.`);
            }
        }
    }

    if ("fees" in body) {
        if (
            typeof body.fees !== "number" ||
            !Number.isFinite(body.fees) ||
            body.fees < 0
        ) {
            errors.push("Fees must be a non-negative number.");
        }
    }

    if (partial && Object.keys(body).length === 0) {
        errors.push("Provide at least one field to update.");
    }

    return errors;
}

// HOME ROUTE
app.get("/", (req, res) => {
    res.json({
        message: "Student CRUD API is running",
        database: "MongoDB Atlas"
    });
});

// CREATE: Insert a student
app.post("/students", async (req, res, next) => {
    try {
        const errors = validateStudent(req.body);

        if (errors.length) {
            return res.status(400).json({ errors });
        }

        const student = {
            name: req.body.name.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        for (const field of ["course", "city", "fees"]) {
            if (req.body[field] !== undefined) {
                student[field] =
                    typeof req.body[field] === "string"
                        ? req.body[field].trim()
                        : req.body[field];
            }
        }

        const result = await students.insertOne(student);

        res.status(201).json({
            message: "Student created successfully",
            student: {
                _id: result.insertedId,
                ...student
            }
        });
    } catch (error) {
        next(error);
    }
});

// READ: Get all students
// Optional query: /students?limit=20
app.get("/students", async (req, res, next) => {
    try {
        const requestedLimit = Number.parseInt(req.query.limit, 10);

        const limit = Number.isInteger(requestedLimit)
            ? Math.min(Math.max(requestedLimit, 1), 100)
            : 20;

        const data = await students
            .find({})
            .sort({ _id: -1 })
            .limit(limit)
            .toArray();

        res.json({
            count: data.length,
            students: data,
            limit
        });
    } catch (error) {
        next(error);
    }
});

// READ: Get one student by ID
app.get("/students/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                error: "Invalid student ID."
            });
        }

        const student = await students.findOne({
            _id: new ObjectId(id)
        });

        if (!student) {
            return res.status(404).json({
                error: "Student not found."
            });
        }

        res.json(student);
    } catch (error) {
        next(error);
    }
});

// UPDATE: Update a student by ID
app.patch("/students/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                error: "Invalid student ID."
            });
        }

        const errors = validateStudent(req.body, true);

        if (errors.length) {
            return res.status(400).json({ errors });
        }

        const updates = {};

        for (const field of ["name", "course", "city", "fees"]) {
            if (req.body[field] !== undefined) {
                updates[field] =
                    typeof req.body[field] === "string"
                        ? req.body[field].trim()
                        : req.body[field];
            }
        }

        updates.updatedAt = new Date();

        const result = await students.updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: "Student not found."
            });
        }

        const updatedStudent = await students.findOne({
            _id: new ObjectId(id)
        });

        res.json({
            message: "Student updated successfully",
            student: updatedStudent
        });
    } catch (error) {
        next(error);
    }
});

// DELETE: Delete a student by ID
app.delete("/students/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                error: "Invalid student ID."
            });
        }

        const result = await students.deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: "Student not found."
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found."
    });
});

// Central error handler
app.use((error, req, res, next) => {
    console.error("Request error:", error.message);

    if (res.headersSent) {
        return next(error);
    }

    res.status(500).json({
        error: "Internal server error. Check server logs."
    });
});

// Start server and connect to MongoDB Atlas
async function startServer() {
    if (!MONGODB_URI) {
        throw new Error(
            "MONGODB_URI is missing. Add it to your .env file."
        );
    }

    await client.connect();
    await client.db("admin").command({ ping: 1 });

    const db = client.db("CollegeDB");
    students = db.collection("Students");

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
        console.log(
            "Connected to MongoDB Atlas: CollegeDB.Students"
        );
    });
}

// Graceful shutdown
async function shutdown() {
    console.log("\nShutting down server...");

    await client.close();
    process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Handle startup errors
startServer().catch(async error => {
    console.error("Could not start server:", error.message);

    await client.close().catch(() => {});
    process.exit(1);
});
