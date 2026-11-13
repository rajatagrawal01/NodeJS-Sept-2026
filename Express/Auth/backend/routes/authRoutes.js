const express = require("express");
const router = express.Router();

const {
    register,
    login
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

router.post("/register", register);

router.post("/login", login);

// Get currently logged-in user
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        message: "Authenticated successfully",
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});

module.exports = router;