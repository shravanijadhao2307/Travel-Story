const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./src/routes/authRoutes");
const storyRoutes = require("./src/routes/storyRoutes");
const userRoutes = require("./src/routes/userRoutes")

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/uploads", express.static("uploads"));

// app.get("/", (req, res) => {
//   res.send("API running...");
// });

app.listen(5000, () => console.log("Server running on port 5000"));