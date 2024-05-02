const express = require("express");
const path = require("path");

const useExpressStatic = (app) => {
  app.use(express.static(path.join(__dirname, "../client", "dist")));
};

module.exports = useExpressStatic;
