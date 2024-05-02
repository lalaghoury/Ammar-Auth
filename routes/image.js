const express = require("express");
const router = express.Router();

const { upload } = require("../middlewares/MultiMulter");
const cloudinaryController = require("../controllers/cloudinaryController");

router.post("/", upload.array("images"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No files uploaded" });
  }
  try {
    const images = [];
    for (const file of req.files) {
      const response = await cloudinaryController.upload(file.path);
      images.push({ url: response.secure_url, name: file.originalname });
    }
    res.status(201).json({ success: true, images });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
