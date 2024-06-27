const mongoose = require("mongoose");

const HadithSchema = new mongoose.Schema({
  hadithNumber: { type: String, required: true, trim: true },
  englishNarrator: { type: String, default: '', trim: true },
  hadithEnglish: { type: String,default: '', trim: true },
  hadithUrdu: { type: String, default: '', trim: true },
  urduNarrator: { type: String,  default: '', trim: true },
  hadithArabic: { type: String,  default: '', trim: true },
  chapterId: { type: String, default: '', trim: true },
  bookSlug: { type: String,default: '', trim: true },
  volume: { type: String, default: '', trim: true },
});

const HadithModel = mongoose.model("Hadiths", HadithSchema);

module.exports = HadithModel;
