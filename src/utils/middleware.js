const User = require("../models/user")
require("dotenv").config()

const userAuth=async(req,res,next)=>{
  try {
    const {userToken} = req.cookies
    if(!userToken){
      throw new Error("Invalid token")
    }
    const user = await User.decodeJWT(userToken)
    req.user = user
    next()
  } catch (error) {
    res.status(401).send(error.message)
  }
}

module.exports = userAuth
