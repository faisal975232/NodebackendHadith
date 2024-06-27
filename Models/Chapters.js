const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema({
  chapterNumber: { type: String, required: true, trim: true },
  chapterEnglish: { type: String, required: true, trim: true },
  chapterUrdu: { type: String, trim: true },
  chapterArabic: { type: String, required: true, trim: true },
  bookSlug: { type: String, required: true, trim: true },
});

const ChapterModel = mongoose.model("Chapters", ChapterSchema);

module.exports = ChapterModel;
