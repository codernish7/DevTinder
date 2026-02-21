const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

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
      lowercase: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: `Enter valid email address`,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value);
        },
        message: `Enter a strong password`,
      },
    },
    age: {
      type: Number,
      min: [18, `Minimum age must be 18`],
      required: true,
    },
    photoUrl: {
      type: String,
      default: `https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg`,
      validate: {
        validator: function (url) {
          return validator.isURL(url);
        },
        message: `image url invalid`,
      },
    },
    skills: {
      type: [String],
      validate: {
        validator: function (arr) {
          if (!arr) return true;
          return arr.length <= 10;
        },
        message: `Maximum of 10 skills allowed`,
      },
    },
  },
  {
    timestamps: true,
    statics: {
      hashPassword: async function (passwordInputbyUser) {
        const hashedPassword = await bcrypt.hash(passwordInputbyUser, 10);
        return hashedPassword;
      },
      decodeJWT: async function (userToken) {
        const decodeToken = await jwt.verify(userToken, process.env.SECRET_KEY);
        const { id } = decodeToken;
        const user = await this.findById(id);
        if (!user) {
          throw new Error("user not found");
        }
        return user;
      },
    },
    methods: {
      validatePassword: async function (passwordInputbyUser) {
        const verify = await bcrypt.compare(passwordInputbyUser, this.password);
        return verify;
      },
      getJWT: async function () {
        const token = await jwt.sign({ id: this._id }, process.env.SECRET_KEY);
        return token;
      },
    },
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
