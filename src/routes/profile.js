const express = require("express");
const userAuth = require("../utils/middleware");
const {validateEdit} = require("../utils/validators")

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.send(error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const user = await req.user.editUser(req.body);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;
