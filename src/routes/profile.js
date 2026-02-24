const express = require("express");
const userAuth = require("../utils/middleware");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = profileRouter;
