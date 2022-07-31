const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    max: [18, "Maximum characters should be equal to 18"],
    trim: true,
  },
  profilePic: String,
  role: {
    type: String,
    enum: {
      values: ["admin", "blogger"],
      message: "Invalid role provided",
    },
    default: "blogger",
  },
  username: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: [true, "Please provide user name"],
    max: [15, "Maximum characters should be equal to 15"],
  },
  password: {
    type: String,
    requird: [true, "Please provide user password"],
    select: false,
  },
  blogs: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
  passwordChangedAt:Date,
  createdAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hashSync(this.password, 2);
  return next();
});

userSchema.methods.isPasswordMatched = function (password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = new mongoose.model("user", userSchema);
