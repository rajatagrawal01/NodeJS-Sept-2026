const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    getProfile,
    updateProfile,
    getAllUsers,
    getSingleUser,
    deleteUser
} = require("../controllers/userController");

// Authenticated users
router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

// Admin-only routes
router.get("/", protect, adminOnly, getAllUsers);

router.get("/:id", protect, adminOnly, getSingleUser);

router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;