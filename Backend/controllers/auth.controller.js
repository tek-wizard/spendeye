import mongoose from "mongoose";
import Expense from "../models/expense.model.js";
import Ledger from "../models/ledger.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { jwtSetUser } from "../utils/jwt.js";
import crypto from "crypto"; // Needed for generating password reset tokens


//user register
export const handleRegistorUser = async (req, res) => {
  try {
    const takenEmail = await User.findOne({ email: req.body.email });

    if (takenEmail) {
      return res.status(400).json({ // Use 400 for a bad request/conflict
        success: false,
        message: "Email already in use",
      });
    }

    const newUser = new User(req.body);
    await newUser.save();

    const jwtToken = jwtSetUser(newUser);
    res.cookie("token", jwtToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User cannot be registered",
      error: error.message,
    });
  }
};

//user login
export const handleloginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({ // 401 Unauthorized is more appropriate
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatched = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatched) {
      return res.status(401).json({ // 401 Unauthorized
        success: false,
        message: "Invalid email or password",
      });
    }

    const jwtToken = jwtSetUser(foundUser);
    res.cookie("token", jwtToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: foundUser,
    });
  } catch (error) {
    res.status(500).json({ // Use 500 for a server error
      success: false,
      message: "Error during user login",
      error: error.message,
    });
  }
};

// get current user profile
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


// User logout
export const handleLogoutUser = (req, res) => {
    // Clear the cookie containing the JWT
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
};

// Change password (when user is logged in)
export const handleChangePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const { _id } = req.user;

        const user = await User.findById(_id);

        // 1. Verify the current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect current password." });
        }

        // 2. Update to the new password
        user.password = newPassword;
        await user.save(); // The pre-save hook in your model will hash it automatically

        res.status(200).json({
            success: true,
            message: "Password changed successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while changing password",
            error: error.message
        });
    }
};

// Forgot password (Step 1: User requests a reset link)
export const handleForgotPassword = async (req, res) => {
    // NOTE: A full implementation requires an email service (e.g., Nodemailer, SendGrid)
    // to send the user a reset link. This is the foundational logic.
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // We send a success message even if the user is not found
            // to prevent "user enumeration" security vulnerabilities.
            return res.status(200).json({ success: true, message: "If an account with this email exists, a password reset link has been sent." });
        }

        // 1. Generate a secure, random reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // 2. Hash the token and set an expiry date before saving to the database
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 3600000; // Token is valid for 1 hour

        await user.save({ validateBeforeSave: false }); // Skip validation to save these new fields

        // 3. (To be implemented) - Send the email
        // const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        // await sendEmail({ email: user.email, subject: 'Password Reset', message: `Reset your password here: ${resetURL}` });

        res.status(200).json({
            success: true,
            message: "If an account with this email exists, a password reset link has been sent."
        });

    } catch (error) {
        // In case of error, clear the reset token fields to be safe
        // await User.updateOne({ email: req.body.email }, { $set: { passwordResetToken: undefined, passwordResetExpires: undefined }});
        res.status(500).json({
            success: false,
            message: "Error processing forgot password request",
            error: error.message
        });
    }
};


// CONTROLLER FOR DELETING AN ACCOUNT
export const handleDeleteAccount = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { _id: userId } = req.user;

        // Step 1: Delete all expenses associated with the user
        await Expense.deleteMany({ userId }, { session });

        // Step 2: Delete all ledger entries associated with the user
        await Ledger.deleteMany({ userId }, { session });

        // Step 3: Delete the user document itself
        const deletionResult = await User.findByIdAndDelete(userId, { session });

        if (!deletionResult) {
            throw new Error("User not found during deletion process.");
        }

        // Step 4: Commit the transaction
        await session.commitTransaction();

        // Step 5: Clear the session cookie and send a final success response
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: "Account and all associated data permanently deleted."
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Error deleting account:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting account.",
            error: error.message,
        });
    } finally {
        session.endSession();
    }
};