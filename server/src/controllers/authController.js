const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check user exists
    const userExists = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *",
      [name, email, hashedPassword],
    );
    
    const token = generateToken(newUser.rows[0]);

    const userData = newUser.rows[0];

    res.status(201).json({
      // user: newUser.rows[0],
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      },
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.rows[0]);

    res.json({
      user: user.rows[0],
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
