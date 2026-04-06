const express = require("express");
const userAuth = require("../utils/middleware");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).send("invalid request status");
      }

      const toUserExists = await User.findById(toUserId);

      if (!toUserExists) {
        return res.status(400).send("cannot send request to non existent user");
      }

      const existingRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).send("connection request exists");
      }

      const data = await new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      }).save();

      res.json({ message: "connection request was sent", data });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).send("invalid status");
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).send("request not found");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ data, message: "Connection request was " + status });
    } catch (error) {
      res.status(400)._construct(error.message);
    }
  },
);

module.exports = requestRouter;
