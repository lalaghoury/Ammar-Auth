const express = require("express");
const router = express.Router();
const dressStyleController = require("../controllers/dressStyleController");

// Get All DressStyles
router.get("/all", dressStyleController.listDressStyles);

// Gett All DressStyles Names
router.get("/names", dressStyleController.listDressStylesNames);

// Get Single DressStyle
router.get("/:DressStyleId", dressStyleController.readDressStyle);

// Create New DressStyle
router.post("/new", dressStyleController.createDressStyle);

// Update DressStyle
router.put("/:DressStyleId", dressStyleController.updateDressStyle);

// Delete DressStyle
router.delete("/:DressStyleId", dressStyleController.deleteDressStyle);

module.exports = router;
