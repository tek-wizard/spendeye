import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import { jwtSetUser } from "../utils/jwt.js"

//user register
export const handleRegistorUser = async (req, res) => {
  try {
    //Checking if email is already taken
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
    const jwtToken = jwtSetUser(newUser)
    res.cookie("token", jwtToken)

    //Sending response
    res.status(201).json({
      success: true,
      message: "User registered Succesfully",
      user: newUser,
    })
  } catch (error) {
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
    const { email, password } = req.body

    //checking if user exists
    const foundUser = await User.findOne({ email })

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    //checking if password is correct
    const passwordMatched = await bcrypt.compare(password, foundUser.password)

    if (!passwordMatched) {
      return res.status(404).json({
        success: false,
        message: "Password did not match",
      })
    }

    //setting JWT token in cookie
    const jwtToken = jwtSetUser(foundUser)
    res.cookie("token", jwtToken)

    //sending response
    res.status(200).json({
      success: true,
      message: "User found",
      user: foundUser,
      token: jwtToken,
    })
  } catch (error) {
    //sending error response
    res.status(404).json({
      success: false,
      message: "Error while user login",
      error: error,
    })
  }
}

export const handleGetMe = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password");
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      res.status(200).json({
        success: true,
        user,
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching user profile",
        error: error.message,
      });
    }
  };
