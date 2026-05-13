const pool = require("../db");

// CREATE STORY
exports.createStory = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    console.log("FILES TYPE:", typeof req.files);
    console.log("IS ARRAY:", Array.isArray(req.files));

    const { title, description, location_name, travel_date } = req.body;

    // ✅ Correctly build image and video URL arrays
    const image_url = req.files?.images
      ? req.files.images.map((f) => `uploads/${f.filename}`)
      : [];

    const video_url = req.files?.videos
      ? req.files.videos.map((f) => `uploads/${f.filename}`)
      : [];

    // TODO: replace with req.user.id once auth middleware is applied
    const user_id = req.user?.id || 1;

    const newStory = await pool.query(
      `INSERT INTO stories 
       (user_id, title, description, location_name, travel_date, image_url, video_url)
       VALUES ($1, $2, $3, $4, $5, $6::text[], $7::text[])
       RETURNING *`,
      [
        user_id,
        title,
        description,
        location_name,
        travel_date,
        image_url,
        video_url,
      ],
    );

    res.status(201).json(newStory.rows[0]);
  } catch (err) {
    console.error("createStory error:", err.message);
    res.status(500).send("Server error");
  }
};

function parseMediaUrls(raw) {
  if (!raw) return [];

  // Already a JS array (shouldn't happen, but guard anyway)
  if (Array.isArray(raw)) return raw.filter(Boolean);

  const str = String(raw).trim();

  // JSON array format: ["uploads/file1.jpg", "uploads/file2.jpg"]
  if (str.startsWith("[")) {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  }

  // PostgreSQL array format: {uploads/file1.jpg,uploads/file2.jpg}
  if (str.startsWith("{")) {
    return str
      .replace(/^\{/, "")
      .replace(/\}$/, "")
      .split(",")
      .map((s) => s.replace(/^"/, "").replace(/"$/, "").trim())
      .filter(Boolean);
  }

  // Single value string
  if (str.length > 0) return [str];

  return [];
}

// GET ALL STORIES
exports.getAllStories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.name AS author_name
       FROM stories s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC`,
    );

    // ✅ Parse image_url and video_url for every story
    const stories = result.rows.map((story) => ({
      ...story,
      images: parseMediaUrls(story.image_url),
      videos: parseMediaUrls(story.video_url),
      // Expose author as object so frontend can use story.author.name
      author: { name: story.author_name || story.name || "Traveller" },
    }));

    res.json(stories);
  } catch (err) {
    console.error("getAllStories error:", err.message);
    res.status(500).send("Server error");
  }
};

// GET SINGLE STORY
exports.getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT s.*, u.name AS author_name
       FROM stories s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Story not found" });
    }

    const story = result.rows[0];

    // ✅ Parse image_url and video_url
    const enriched = {
      ...story,
      images: parseMediaUrls(story.image_url),
      videos: parseMediaUrls(story.video_url),
      author: { name: story.author_name || story.name || "Traveller" },
    };

    res.json(enriched);
  } catch (err) {
    console.error("getStoryById error:", err.message);
    res.status(500).send("Server error");
  }
};

// UPDATE STORY
exports.updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location_name, image_url } = req.body;

    const story = await pool.query("SELECT * FROM stories WHERE id=$1", [id]);

    if (story.rows.length === 0) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedStory = await pool.query(
      `UPDATE stories 
       SET title=$1, description=$2, location_name=$3, image_url=$4
       WHERE id=$5 RETURNING *`,
      [title, description, location_name, image_url, id],
    );

    res.json(updatedStory.rows[0]);
  } catch (err) {
    console.error("updateStory error:", err.message);
    res.status(500).send("Server error");
  }
};

// DELETE STORY
exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await pool.query("SELECT * FROM stories WHERE id=$1", [id]);

    if (story.rows.length === 0) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await pool.query("DELETE FROM stories WHERE id=$1", [id]);

    res.json({ message: "Story deleted successfully" });
  } catch (err) {
    console.error("deleteStory error:", err.message);
    res.status(500).send("Server error");
  }
};

exports.getMyStories = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const result = await pool.query(
      "SELECT * FROM stories WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch user stories" });
  }
};
