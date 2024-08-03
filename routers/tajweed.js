// packages
const express = require("express");
const fs = require("fs");
const path = require("path");
// imports

// init
const tajweedRouter = express.Router();
const url = process.env.API_URL;

// routers
tajweedRouter.post("/data", (req, res) => {
  const { sura_no } = req.body;
  const filePath = path.join(__dirname, `../tajweed/surah_${sura_no}.json`);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error");
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });
});

module.exports = tajweedRouter;
