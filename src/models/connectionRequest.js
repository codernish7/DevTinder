const mongoose = require("mongoose");

const {Schema} = mongoose

const connectionRequestSchema = new Schema({
    fromUserId :{
        type : Schema.Types.ObjectId,
        required : true,
    },
    toUserId :{
        type : Schema.Types.ObjectId,
        required : true
    },
    status: {
      type: String,
      enum:{
        values : ["interested", "accepted", "rejected", "ignored"], 
        message : `{VALUE} is invalid status`
      },
      required: true, 
    },
  },
  {
    timestamps: true,
  }
)

connectionRequestSchema.index({fromUserId:1, toUserId: 1},{unique:true})

connectionRequestSchema.pre("save", function(next){
  if(this.fromUserId.equals(this.toUserId)){
    return next(new Error("Cannot send request to yourself"))
  }
  next()
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequestModel