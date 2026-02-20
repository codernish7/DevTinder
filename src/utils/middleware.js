const jwt= require("jsonwebtoken")
const User = require("../models/user")
require("dotenv").config()

const userAuth=async(req,res,next)=>{
  try {
    const {userToken} = req.cookies
    if(!userToken){
      throw new Error("Invalid token")
    }
    const decodeToken= await jwt.verify(userToken, process.env.SECRET_KEY )
  
    const {id}= decodeToken
  
    const user = await User.findById(id)
  
    if(!user){
      throw new Error("user not found")
    }
    req.user = user
    next()
  } catch (error) {
    res.status(400).send(error.message)
  }
}

module.exports = userAuth
