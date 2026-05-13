const pool = require("../db");

const updateUser = async (req, res) => {
  try {
    const { name, bio } = req.body;

    const profilePic = req.file ? req.file.filename : null;

    const result = await pool.query(
      `UPDATE users 
       SET name = $1, bio = $2, profile_pic = COALESCE($3, profile_pic)
       WHERE id = $4 
       RETURNING *`,
      [name, bio, profilePic, req.params.id]
    );

    res.json({ user: result.rows[0] });

  } catch (error) {
    console.error("UPDATE ERROR:", error); // ✅ only here
    res.status(500).json({ 
      message: "Update failed", 
      error: error.message 
    });
  }
};

module.exports = { updateUser };