const express = require("express");
const userAuth = require("../utils/middleware");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_INFO = "firstName lastName age gender skills photoUrl";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pendingRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_INFO);

    if (!pendingRequests.length) {
      return res.json({ message: "No pending requests", data: [] });
    }

    res.json({ message: "Pending requests", data: pendingRequests });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const acceptedConnections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_INFO)
      .populate("toUserId", USER_INFO);

    const data = acceptedConnections.map((items) => {
      if (loggedInUser._id.toString() === items.fromUserId._id.toString()) {
        return items.toUserId;
      }
      return items.fromUserId;
    });
    res.json({ message: "Connections of " + loggedInUser.firstName, data });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.pageSize) || 10;
    limit = limit > 20 ? 20 : limit;
    const skip = (page - 1) * limit;

    const connectionRequestRecords = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersinFeed = new Set();

    connectionRequestRecords.forEach((items) => {
      hideUsersinFeed.add(items.fromUserId.toString());
      hideUsersinFeed.add(items.toUserId.toString());
    });

    const userFeed = await User.find({
      $and: [
        {
          _id: { $nin: [...hideUsersinFeed] },
        },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    }).select(USER_INFO)
      .skip(skip)
      .limit(limit);

    res.json({ message: "Suggestions", data: userFeed });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
