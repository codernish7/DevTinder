const express = require("express");
const userAuth = require("../utils/middleware");

const requestRouter = express.Router();

requestRouter.post("/sendRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " " + "sent a request");
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = requestRouter;
