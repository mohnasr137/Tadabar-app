// packages
const express = require("express");
const axios = require("axios");

// init
const audio = express.Router();
const reciterNamesInArabic = {
  "AbdulBaset AbdulSamad": "عبد الباسط عبد الصمد",
  "Abdur-Rahman as-Sudais": "عبد الرحمن السديس",
  "Abu Bakr al-Shatri": "أبو بكر الشاطري",
  "Hani ar-Rifai": "هاني الرفاعي",
  "Mahmoud Khalil Al-Husary": "محمود خليل الحصري",
  "Mishari Rashid al-`Afasy": "مشاري راشد العفاسي",
  "Mohamed Siddiq al-Minshawi": "محمد صديق المنشاوي",
  "Sa`ud ash-Shuraym": "سعود الشريم",
  "Mohamed al-Tablawi": "محمد الطبلاوي",
};

// routers
audio.get("/by_surah", async (req, res) => {
  try {
    const { recitation_id, surah_id } = req.query;
    if (!recitation_id) {
      return res.status(400).json({ message: "recitation_id is required" });
    }
    if (!surah_id) {
      return res.status(400).json({ message: "surah_id is required" });
    }
    const url = `https://api.quran.com/api/v4/recitations/${recitation_id}/by_chapter/${surah_id}`;
    const response = await axios.get(url);
    if (response.status !== 200) {
      return res.status(response.status).json({ message: "Failed to fetch" });
    }
    const by_surah = response.data;
    const updatedAudioFiles = by_surah.audio_files.map((file) => ({
      ...file,
      url: `https://verses.quran.com/${file.url}`,
    }));
    return res.status(200).json({ updatedAudioFiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

audio.get("/by_ayah", async (req, res) => {
  try {
    const { recitation_id, surah_id, ayah_id } = req.query;
    if (!recitation_id) {
      return res.status(400).json({ message: "recitation_id is required" });
    }
    if (!surah_id) {
      return res.status(400).json({ message: "surah_id is required" });
    }
    if (!ayah_id) {
      return res.status(400).json({ message: "ayah_id is required" });
    }
    const ayah_key = `${surah_id}:${ayah_id}`;
    const url = `https://api.quran.com/api/v4/recitations/${recitation_id}/by_ayah/${ayah_key}`;
    const response = await axios.get(url);
    if (response.status !== 200) {
      return res.status(response.status).json({ message: "Failed to fetch" });
    }
    const by_ayah = response.data;
    const updatedAudioFiles = by_ayah.audio_files.map((file) => ({
      ...file,
      url: `https://verses.quran.com/${file.url}`,
    }));
    return res.status(200).json({ updatedAudioFiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

audio.get("/recitations", async (req, res) => {
  try {
    const url = "https://api.quran.com/api/v4/resources/recitations";
    const response = await axios.get(url);
    if (response.status !== 200) {
      return res.status(response.status).json({ message: "Failed to fetch" });
    }
    const recitations = response.data.recitations.map((recitation) => ({
      id: recitation.id,
      reciter_name: recitation.reciter_name,
      reciter_name_arabic: reciterNamesInArabic[recitation.reciter_name],
      style: recitation.style,
    }));
    return res.status(200).json({ recitations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// exports
module.exports = audio;


