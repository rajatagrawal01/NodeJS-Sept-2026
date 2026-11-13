
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

dotenv.config();

const users = [
    {
        name: "Administrator",
        email: "admin@test.com",
        password: "admin123",
        role: "admin"
    },
    {
        name: "Student One",
        email: "student1@test.com",
        password: "student123",
        role: "user"
    },
    {
        name: "Student Two",
        email: "student2@test.com",
        password: "student123",
        role: "user"
    },
    {
        name: "Student Three",
        email: "student3@test.com",
        password: "student123",
        role: "user"
    }
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        for (const item of users) {

            const hashedPassword = await bcrypt.hash(
                item.password,
                10
            );

            await User.findOneAndUpdate(
                { email: item.email },
                {
                    $set: {
                        name: item.name,
                        email: item.email,
                        password: hashedPassword,
                        role: item.role
                    }
                },
                {
                    upsert: true,
                    new: true,
                    runValidators: true
                }
            );

            console.log(`Created/Updated: ${item.email}`);
        }

        console.log("\nAll demo users are ready!");

    } catch (error) {

        console.error("Seeding failed:", error);

    } finally {

        await mongoose.disconnect();

    }
};

seedUsers();
