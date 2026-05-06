const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref:"user",
    },
  },
  {
    timestamps: true,
  }
);

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    school: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    grade: {
      type: String,
      required: true,
      enum: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ],
    },

    module: {
      type: String,
      required: true,
      enum: [
        "Video Modules",
        "Worksheets",
        "Activities",
        "Competency-Based Assessments",
        "Textbooks",
        "Practice Papers",
      ],
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "converted", "rejected"],
      default: "pending",
    },

    followUps: [followUpSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("contact", contactSchema);
