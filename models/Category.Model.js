const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please category name"],
    max: [30, "Maximum characters should be equal to 30"],
    trim: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  createdAt: Date,
});

module.exports = new mongoose.model("category", categorySchema);