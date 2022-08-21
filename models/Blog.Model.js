const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  thumbnail: String,
  title: {
    type: String,
    required: [true, "Please provide blog title"],
    max: [35, "Maximum title length is 35 characters"],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    max: [100, "Maximum description length is 100 characters"],
  },
  content: {
    type: String,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "category",
    required: [true, "Please provide blog category"],
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: [true, "Blog author not found!"],
  },
  keywords: [],
  active: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
  createdAt: Date,
});

blogSchema.pre("save", function (next) {
  if (!this.title) return next();
  this.slug = this.title.replace(/["&/"]/g, "");
  return next();
});

module.exports = new mongoose.model("blog", blogSchema);
