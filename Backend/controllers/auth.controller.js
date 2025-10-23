import mongoose from "mongoose";
import Expense from "../models/expense.model.js";
import Ledger from "../models/ledger.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { jwtSetUser } from "../utils/jwt.js";
import { sendEmail } from "../utils/emailService.js";
import crypto from "crypto";


// to chcek if backend is running
export const handleHealthCheck = (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is healthy and running.'
    });
};

//user register
export const handleRegistorUser = async (req, res) => {
  try {
    const takenEmail = await User.findOne({ email: req.body.email });

    if (takenEmail) {
      return res.status(400).json({ // 400 bad request/conflict
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
      return res.status(401).json({ // 401 Unauthorized
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
    res.status(500).json({ // 500 server error
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
        await user.save(); // The pre-save hook in the model will hash it automatically

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

export const handleForgotPassword = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).session(session);

        if (!user) {
            // Security measure: Do not reveal if the user exists.
            await session.commitTransaction();
            return res.status(200).json({ success: true, message: "If an account with this email exists, a password reset link has been sent." });
        }

        // 1. Generate a secure, random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // 2. Hash the token and set an expiry date before saving
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        // Token is now valid for 15 minutes (900,000 milliseconds)
        user.passwordResetExpires = Date.now() + 900000; 

        await user.save({ validateBeforeSave: false, session }); 

        // Use the environment variable for the frontend URL
        const resetURL = `${process.env.FRONTEND_URL_BASE}/reset-password/${resetToken}`;
        
        const emailHTML = `
            <p>You requested a password reset for your Spendy account.</p>
            <p>Please click this link to reset your password. This link is valid for 15 minutes:</p>
            <a href="${resetURL}" style="background-color: #5568FE; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
        `;

        // 4. Send the email
        await sendEmail({ 
            email: user.email, 
            subject: 'Spendy: Your Password Reset Request', 
            html: emailHTML 
        });

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: "If an account with this email exists, a password reset link has been sent."
        });

    } catch (error) {
        await session.abortTransaction();
        if (error.message.includes("Email service failed")) {
             await User.updateOne({ email: req.body.email }, { $unset: { passwordResetToken: "", passwordResetExpires: "" } });
             return res.status(500).json({ success: false, message: "Failed to send reset email. Please try again." });
        }
        console.error("Error processing forgot password request:", error);
        res.status(500).json({
            success: false,
            message: "Error processing forgot password request",
            error: error.message
        });
    } finally {
        session.endSession();
    }
};


// deleting an account
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

// reset password ( when forgot password )
export const handleResetPassword = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // 1. Hash the incoming token to match the one stored in the DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // 2. Find user by hashed token and ensure it hasn't expired
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() } // $gt means 'greater than' (i.e., not expired)
        }).session(session);

        if (!user) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: "Password reset link is invalid or has expired." });
        }
        
        // 3. Update the password
        user.password = newPassword;
        
        // 4. Clear the token fields for security (token can only be used once)
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ session }); // The pre-save hook will hash the new password

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: "Password successfully reset. You can now log in."
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Error resetting password:", error);
        res.status(500).json({
            success: false,
            message: "Server error while resetting password",
            error: error.message
        });
    } finally {
        session.endSession();
    }
};