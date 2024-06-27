const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  bookName: { type: String, required: true, trim: true },
  writerName: { type: String, required: true, trim: true },
  aboutWriter: { type: String,  trim: true },
  writerDeath: { type: String, required: true, trim: true },
  bookSlug: { type: String, required: true, trim: true },
  hadiths_count: { type: String, required: true, trim: true },
  chapters_count: { type: String, required: true, trim: true },
});

const BookModel = mongoose.model("Books", BookSchema);

module.exports = BookModel;
