const User = require("../models/User");

// GET LOGGED-IN USER PROFILE
exports.getProfile = async (req, res) => {
    try {
        res.status(200).json({
            message: "Profile fetched successfully",
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// UPDATE OWN PROFILE

exports.updateProfile = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name is required"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                name: name.trim()
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



// GET ALL USERS (ADMIN ONLY)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            count: users.length,
            users
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET SINGLE USER (ADMIN ONLY)
exports.getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid user ID"
        });
    }
};


// DELETE USER (ADMIN ONLY)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user._id.equals(req.user._id)) {
            return res.status(400).json({
                message: "Admin cannot delete their own account"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};