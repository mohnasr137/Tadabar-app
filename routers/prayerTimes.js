// packages
const express = require("express");
const axios = require("axios");

// init
const prayerRouter = express.Router();

// routers
prayerRouter.post("/data", async (req, res) => {
  try {
    const { city, country, method, date } = req.body;
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }
    if (!country) {
      return res.status(400).json({ message: "Country is required" });
    }
    if (!method) {
      return res.status(400).json({ message: "Method is required" });
    }
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }
    const aladhanUrl = `https://api.aladhan.com/v1/timingsByCity/${date}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
    const response = await axios.get(aladhanUrl);
    if (response.status !== 200) {
      return res
        .status(response.status)
        .json({ message: "Failed to fetch prayer times" });
    }
    const prayerTimes = response.data.data.timings;
    return res.status(200).json({ prayerTimes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// exports
module.exports = prayerRouter;
