import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import { jwtSetUser } from "../utils/jwt.js"


//user register
export const handleRegistorUser = async (req, res) => {
  try {
    //Checking if username is already taken
    const takenUsername = await User.findOne({ username: req.body.username })

    if (takenUsername) {
      return res.status(500).json({
        success: false,
        message: "Username already taken",
      })
    }

    //Checking if username is already taken
    const takenEmail = await User.findOne({ email: req.body.email })

    if (takenEmail) {
      return res.status(500).json({
        success: false,
        message: "Email already in use",
      })
    }

    //Registering new User
    const newUser = new User(req.body)

    await newUser.save()

    //setting JWT token in cookie
    const jwtToken=jwtSetUser(newUser)
    res.cookie("token",jwtToken)

    //Sending response
    res.status(201).json({
      success: true,
      message: "User registered Succesfully",
      user: newUser,
    })
  } 
  catch (error) {
    //sending error
    res.status(500).json({
      success: false,
      message: "User cannot be registered",
      error: error.message,
    })
  }
}


//user login
export const handleloginUser = async (req, res) => {
  try {
    const {username,password}=req.body
    
    //checking if user exists
    const foundUser=await User.findOne({username})

    if(!foundUser){
      return res.status(404).json({
        success:false,
        message:"Username not found"
      })
    }

    //checking if password is correct
    const passwordMatched=await bcrypt.compare(password,foundUser.password)

    if(!passwordMatched){
      return res.status(404).json({
        success:false,
        message:"Password did not match"
      })
    }

    //setting JWT token in cookie
    const jwtToken=jwtSetUser(foundUser)
    res.cookie("token",jwtToken)

    //sending response
    res.status(200).json({
      success:true,
      message:"User found",
      user:foundUser,
      token:jwtToken
    })
  } catch (error) {
    //sending error response
    res.status(404).json({
      success:false,
      message:"Error while user login",
      error:error
    })
  }
}

export const handleGetContacts=async (req,res)=>{
  try {
      const {_id}=req.user

      const user=await User.findById(_id)

      if(!user){
          return res.status(400).json({
              success:false,
              message:"No user found"
          })
      }

      return res.status(201).json({
          success:true,
          message:"Contact fetched succesfully",
          contacts:user.contacts.map((contact)=>contact.name)
      })
  } catch (error) {
      return res.status(500).json({
          success:false,
          message:"Error while fetching contacts",
          error
      })
  }
}

export const handleAddContact=async(req,res)=>{
  try{
      const {contactName}=req.body
      const {_id}=req.user

      const user=await User.findById(_id)

      if(!user){
          return res.status(400).json({
              success:false,
              message:"No user found"
          })
      }

      if(user.contacts.find((contact)=>contact.name===contactName)){
          return res.status(400).json({
              success:false,
              message:"Contact name already present",
              contacts:user.contacts.map((contact)=>contact.name)
          })
      }

      user.contacts.push({name:contactName})
      await user.save()

      return res.status(201).json({
          success:true,
          message:"Contact added succesfully",
          user,
          addedContact:user.contacts.find((contact)=>contact.name===contactName)
      })
  }
  catch(error){
      return res.status(500).json({
          success:false,
          message:"Error while adding contact",
          error
      })
  }
}


