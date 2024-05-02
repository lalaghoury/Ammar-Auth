const DressStyle = require("../models/DressStyle");

const dressStyleController = {
  listDressStyles: async (req, res) => {
    try {
      const DressStyles = await DressStyle.find();
      if (!DressStyles) {
        return res
          .status(404)
          .json({ message: "No Dress Styles found", success: false });
      }
      res.json({
        success: true,
        message: "Dress Styles fetched successfully",
        DressStyles,
      });
    } catch (error) {
      res.status(500).json({ error, success: false });
    }
  },

  listDressStylesNames: async (req, res) => {
    try {
      const DressStylesNames = await DressStyle.find({}, { name: 1, _id: 1 });

      if (!DressStylesNames) {
        return res
          .status(404)
          .json({ message: "No Dress Styles found", success: false });
      }

      res.json({
        success: true,
        message: "Dress Styles fetched successfully",
        DressStylesNames,
      });
    } catch (error) {
      res.status(500).json({ error, success: false, message: "Error" });
    }
  },

  createDressStyle: async (req, res) => {
    try {
      const newDressStyle = new DressStyle(req.body).save();
      if (!newDressStyle) {
        return res
          .status(400)
          .json({ message: "Dress Style creation failed", success: false });
      }
      res.status(201).json({
        success: true,
        message: "Dress Style created successfully",
        DressStyle: newDressStyle,
      });
    } catch (error) {
      res.status(400).json({
        error,
        message: "Dress Style creation failed",
        success: false,
      });
    }
  },

  readDressStyle: async (req, res) => {
    const { DressStyleId } = req.params;
    try {
      const DressStyle = await DressStyle.findById(DressStyleId);
      if (!DressStyle) {
        return res
          .status(404)
          .json({ message: "Dress Style not found", success: false });
      }
      res.json({
        DressStyle,
        success: true,
        message: "Dress Style fetched successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Dress Style fetch failed", success: false });
    }
  },

  updateDressStyle: async (req, res) => {
    const { DressStyleId } = req.params;
    try {
      const DressStyle = await DressStyle.findByIdAndUpdate(
        DressStyleId,
        req.body,
        {
          new: true,
        }
      );
      if (!DressStyle) {
        return res
          .status(404)
          .json({ message: "Dress Style not found", success: false });
      }
      res.json({
        DressStyle,
        success: true,
        message: "Dress Style updated successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Dress Style update failed", success: false });
    }
  },

  deleteDressStyle: async (req, res) => {
    const { DressStyleId } = req.params;
    try {
      const DressStyle = await DressStyle.findByIdAndRemove(DressStyleId);
      if (!DressStyle) {
        return res
          .status(404)
          .json({ message: "Dress Style not found", success: false });
      }
      res.json({ message: "Dress Style deleted successfully.", success: true });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Dress Style delete failed", success: false });
    }
  },
};

module.exports = dressStyleController;
