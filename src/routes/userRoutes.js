const express = require("express");
const userAuth = require("../utils/middleware");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pendingRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName gender age skills photoUrl");

    if(!pendingRequests.length){
       return res.json({ message: "No pending requests", data: [] });
    }

    res.json({ message: "Pending requests", data: pendingRequests });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
