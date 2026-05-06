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
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    subject: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending","converted","rejected"],
      default: "pending",
    },
    followUps: [followUpSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("contact", contactSchema);
