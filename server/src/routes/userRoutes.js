const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { updateUser } = require("../controllers/userController");

router.put(
  "/update/:id",
  upload.single("avatar"),
  updateUser
);


// console.log("upload:", upload);
// console.log("updateUser:", updateUser);

module.exports = router;