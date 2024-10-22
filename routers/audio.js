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

// "إبراهيم الأخضر",
//   "أحمد بن علي العجمي",
//   "أحمد نعينع",
//   "أكرم العلاقمي",
//   "سهل ياسين",
//   "عبدالله بصفر",
//   "عبدالله عواد الجهني",
//   "عبدالمحسن القاسم",
//   "علي بن عبدالرحمن الحذيفي",
//   "علي حجاج السويسي",
//   "عماد زهير حافظ",
//   "خالد المهنا",
//   "أحمد خليل شاهين";

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

audio.get("/timerReaders", async (req, res) => {
  try {
    const url = "https://mp3quran.net/api/v3/ayat_timing/reads";
    const response = await axios.get(url);
    if (response.status !== 200) {
      return res.status(response.status).json({ message: "Failed to fetch" });
    }

    const recitations = response.data.map((recitation) => ({
      id: recitation.id,
      reciter_name: recitation.name,
      rewaya: recitation.rewaya,
    }));

    return res.status(200).json({ recitations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

audio.get("/timerReader", async (req, res) => {
  try {
    const { reader_id, surah_num } = req.query;
    const url = `https://www.mp3quran.net/api/v3/ayat_timing?surah=${surah_num}&read=${reader_id}`;
    const response = await axios.get(url);
    if (response.status !== 200) {
      return res.status(response.status).json({ message: "Failed to fetch" });
    }

    const timer = response.data.map((timer) => ({
      ayah: timer.ayah,
      polygon: timer.polygon,
      start_time: timer.start_time,
      end_time: timer.end_time,
      x: timer.x,
      y: timer.y,
    }));

    const newUrl = "https://mp3quran.net/api/v3/ayat_timing/reads";
    const newResponse = await axios.get(newUrl);
    if (newResponse.status !== 200) {
      return res
        .status(newResponse.status)
        .json({ message: "Failed to fetch" });
    }

    let recitation = newResponse.data;
    let length = recitation.length;
    let reader = {};
    for (let i = 0; i < length; i++) {
      if (recitation[i].id == reader_id) {
        reader = recitation[i];
        break;
      }
    }

    const paddedSurahNum = surah_num.toString().padStart(3, "0");
    console.log(paddedSurahNum);
    const folder_url = `${reader.folder_url}${paddedSurahNum}.mp3`;

    reader = {
      id: reader.id,
      reciter_name: reader.name,
      rewaya: reader.rewaya,
      folder_url: folder_url,
    };

    return res.status(200).json({ reader, timer });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

audio.get("/readers", async (req, res) => {
  try {
    const url = "https://www.mp3quran.net/api/v3/reciters?language=ar";
    const response = await axios.get(url);
    if (response.status !== 200) {
      return res.status(response.status).json({ message: "Failed to fetch" });
    }

    const recitations = response.data.reciters.map((recitation) => {
      let length = recitation.moshaf.length;
      let moshaf = [];
      for (let i = 0; i < length; i++) {
        moshaf.push({
          id: recitation.moshaf[i].id,
          name: recitation.moshaf[i].name,
          surah_list: recitation.moshaf[i].surah_list,
        });
      }
      return {
        id: recitation.id,
        reciter_name: recitation.name,
        moshaf,
      };
    });

    return res.status(200).json({ recitations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

audio.get("/reader", async (req, res) => {
  try {
    const { reader_id, moshaf_id, surah_num } = req.query;
    const url = `https://www.mp3quran.net/api/v3/reciters?language=ar&reciter=${reader_id}`;
    const response = await axios.get(url);
    if (response.status !== 200) {
      return res.status(response.status).json({ message: "Failed to fetch" });
    }

    let recitation = response.data.reciters[0];
    let length = recitation.moshaf.length;
    let moshaf = {};
    for (let i = 0; i < length; i++) {
      if (recitation.moshaf[i].id == moshaf_id) {
        moshaf = recitation.moshaf[i];
        break;
      }
    }

    const paddedSurahNum = surah_num.toString().padStart(3, "0");
    console.log(paddedSurahNum);
    const newUrl = `${moshaf.server}${paddedSurahNum}.mp3`;
    recitation = {
      reciter_name: recitation.name,
      moshaf_name: moshaf.name,
      surah_num,
      audio_url: newUrl,
    };

    return res.status(200).json({ recitation });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// exports
module.exports = audio;
