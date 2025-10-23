import nodemailer from "nodemailer"

/**
 * Sends a password reset email to the user.
 * It initializes the transporter inside the function to ensure process.env variables are loaded.
 * * @param {object} options - Email sending options
 */
export const sendEmail = async (options) => {
  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    })

    const mailOptions = {
      from: `Spendy App <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error(
      "EMAIL SERVICE ERROR: Failed to connect or authenticate with Gmail.",
      error
    )
    // Throwing the error ensures the transaction is aborted
    throw new Error("Email service failed to send the reset link.")
  }
}
