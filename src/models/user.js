const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name is required"],
      minlength: [3, "Minimum length must be 3"],
      maxlength: [50, "Maximum length is 50"],
    },
    lastName: { type: String, trim: true, maxlength: 50 },
    gender: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          if (["male", "female", "others"].includes(value)) {
            return true;
          } else {
            return false;
          }
        },
        message: `Gender must be male/female/others`,
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      lowercase: true,
    },
    age: {
      type: Number,
      min: [18, `Minimum age must be 18`],
      required: true,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
