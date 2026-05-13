const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
  getMyStories
} = require("../controllers/storyController");

const authMiddleware = require("../middleware/authMiddleware");

// router.post("/", authMiddleware, upload.array("images", 5), createStory);
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 }
  ]),
  createStory
);
router.get("/", getAllStories);
router.get("/my", authMiddleware, getMyStories);
router.get("/:id", getStoryById);
router.put("/:id", authMiddleware, updateStory);
router.delete("/:id", authMiddleware, deleteStory);

module.exports = router;
