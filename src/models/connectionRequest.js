const mongoose = require("mongoose");

const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "accepted", "rejected", "ignored"],
        message: `{VALUE} is invalid status`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.index({ toUserId: 1, status: 1 });

connectionRequestSchema.pre("save", async function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send request to yourself");
  }
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
