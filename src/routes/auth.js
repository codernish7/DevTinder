const express = require("express");
const {validateSignUp} = require("../utils/validators");
const User = require("../models/user");
const cookieParser = require("cookie-parser");

const authRouter = express.Router();

authRouter.use(cookieParser())

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);
    const { password, ...rest } = req.body;
    const passwordHash = await User.hashPassword(password);
    await new User({ ...rest, password: passwordHash }).save();
    res.send("profile sign up successful");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email }).select("+password");

    if (!userExists) {
      throw new Error("Invalid credentials");
    }

    const verify = await userExists.validatePassword(password);
    if (!verify) {
      throw new Error("Invalid credentials");
    }

    const token = await userExists.getJWT();
    res.cookie("userToken", token);
    res.send("Login successful");
  } catch (error) {
    res.status(401).send(error.message);
  }
});

authRouter.post("/logout",(req,res)=>{
  
  res.clearCookie("userToken").send('logout done')
})

module.exports = authRouter;
