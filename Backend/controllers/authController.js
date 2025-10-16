import User from "../models/user.js";
import bcrypt from "bcrypt";
import Verification from "../models/verification.js";
import { sendEmail } from "../libs/send-email.js";
import jwt from "jsonwebtoken";
import aj from "../libs/arcjet.js";

// Register User Controller
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log("the email coming", email);

    const decision = await aj.protect(req, {
      email: email,
    });
    // console.log("Arcjet decision", decision);

    if (decision.isDenied()) {
      // console.log("Arcjet decision", decision.isDenied);
      return res.status(403).json({ message: "Invalid email address" });
    }

    // 2. Manual disposable domain check
    const disposableDomains = [
      "fanlvr.com",
      "tempmail.com",
      "mailinator.com",
      "10minutemail.com",
      "guerrillamail.com",
    ];
    const domain = email.split("@")[1].toLowerCase();
    if (disposableDomains.includes(domain)) {
      return res.status(403).json({ message: "Invalid email address" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Send verification email
    const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "Email-Verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });

    //send email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const emailBody = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body
    style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;"
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        overflow: hidden;
      "
    >
      <!-- Header -->
      <tr>
        <td
          style="
            padding: 20px;
            text-align: center;
            // background-color: #0f172b;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
          "
        >
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">TaskHub</h1>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding: 30px; text-align: left; color: #0f172b;">
          <h2 style="font-size: 20px; margin-top: 0;">Hello ${name},</h2>

          <p style="font-size: 16px; line-height: 1.6; color: #334155;">
            Thank you for registering on <strong>TaskHub</strong>! Please verify your email address by clicking the button below.
          </p>

          <p style="text-align: center; margin: 30px 0;">
            <a
              href="${verificationLink}"
              style="
                background-color: #0f172b;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 28px;
                border-radius: 6px;
                font-size: 16px;
                font-weight: bold;
                display: inline-block;
              "
              target="_blank"
            >
              Verify Email
            </a>
          </p>

          <p style="font-size: 14px; color: #64748b; line-height: 1.6;">
            If the button above doesn't work, copy and paste the following link into your browser:
          </p>

          <p
            style="
              word-break: break-all;
              color: #0f172b;
              font-size: 13px;
              line-height: 1.4;
            "
          >
            <a href="${verificationLink}" style="color: #0f172b;">
              ${verificationLink}
            </a>
          </p>

          <p style="font-size: 14px; color: #94a3b8; margin-top: 30px;">
            This verification link will expire in <strong>1 hour</strong>.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td
          style="
            padding: 20px;
            text-align: center;
            background-color: #f8fafc;
            color: #94a3b8;
            font-size: 12px;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
          "
        >
          &copy; ${new Date().getFullYear()} TaskHub. All rights reserved.
        </td>
      </tr>
    </table>
  </body>
</html>

`;

    const emailSubject = "Email Verification - TaskHub";

    const isEmailSend = await sendEmail(email, emailSubject, emailBody);

    if (!isEmailSend) {
      return res
        .status(500)
        .json({ message: "Error in sending verification email" });
    }

    res
      .status(201)
      .json({ message: "Verification email sent Please check your inbox" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error in Register User Controller" });
  }
};

// Verify Email Controller

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, purpose } = payload;
    if (purpose !== "Email-Verification") {
      return res.status(401).json({ message: "Invalid token purpose" });
    }

    const verification = await Verification.findOne({ userId, token });

    if (!verification) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isTokenExpired = verification.expiresAt < new Date();
    if (isTokenExpired) {
      return res.status(401).json({ message: "Token Expired" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User does not exist, Unauthorized" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }
    user.isEmailVerified = true;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in Verify Email Controller" });
  }
};

// Login Controller

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (!user.isEmailVerified) {
      const existingVerification = await Verification.findOne({
        userId: user._id,
      });
      if (existingVerification && existingVerification.expiresAt > new Date()) {
        return res
          .status(400)
          .json({ message: "Email not verified. Please check your inbox." });
      } else {
        await Verification.findByIdAndDelete(existingVerification._id);

        const verificationToken = jwt.sign(
          { userId: user._id, purpose: "Email-Verification" },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        await Verification.create({
          userId: user._id,
          token: verificationToken,
          expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
        });

        //send email
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        const emailBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #4a90e2; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">TaskHub</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px; text-align: left; color: #333333;">
        <h2 style="font-size: 20px; margin-top: 0;">Hello ${name},</h2>
        <p style="font-size: 16px; line-height: 1.5;">
          Thank you for registering on TaskHub! Please verify your email address by clicking the button below:
        </p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" 
             style="background-color: #4a90e2; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 16px; display: inline-block;">
             Verify Email
          </a>
        </p>
        <p style="font-size: 14px; color: #666666;">
          If the button above does not work, copy and paste the following link into your browser:<br>
          <a href="${verificationLink}" style="color: #4a90e2;">${verificationLink}</a>
        </p>
        <p style="font-size: 14px; color: #999999; margin-top: 40px;">
          This link will expire in 1 hour.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f4f4f7; color: #999999; font-size: 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        &copy; ${new Date().getFullYear()} TaskHub. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>
`;

        const emailSubject = "Email Verification - TaskHub";

        const isEmailSend = await sendEmail(email, emailSubject, emailBody);

        if (!isEmailSend) {
          return res
            .status(500)
            .json({ message: "Error in sending verification email" });
        }

        res.status(201).json({
          message:
            "Verification email sent Please check your inbox. please verify your email address.",
        });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect email/Password" });
    }

    const token = jwt.sign(
      { userId: user._id, purpose: "login" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.lastlogin = new Date();
    await user.save();

    const userData = user.toObject();
    delete userData.password;
    // delete userData.twoFAotp;
    // delete userData.twoFAotpExpiry;
    res
      .status(200)
      .json({ message: "Login Successful", token, user: userData });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error in Login User Controller" });
  }
};

const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (!user.isEmailVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    const existingVerification = await Verification.findOne({
      userId: user._id,
    });

    if (existingVerification && existingVerification.expiresAt > new Date()) {
      return res.status(400).json({
        message: "Reset password request already sent",
      });
    }

    if (existingVerification && existingVerification.expiresAt < new Date()) {
      await Verification.findByIdAndDelete(existingVerification._id);
    }

    const resetPasswordToken = jwt.sign(
      { userId: user._id, purpose: "reset-password" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    await Verification.create({
      userId: user._id,
      token: resetPasswordToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;
    const emailBody = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password</title>
  </head>
  <body
    style="
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f8fafc;
      color: #0f172b;
      padding: 20px;
      margin: 0;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden;"
    >
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <h1 style="margin-bottom: 16px; font-size: 24px; color: #0f172b;">
            Reset Your Password
          </h1>
          <p style="font-size: 15px; color: #334155; line-height: 1.6;">
            We received a request to reset your password. Click the button below
            to set a new password for your account.
          </p>

          <a
            href="${resetPasswordLink}"
            style="
              display: inline-block;
              margin: 24px 0;
              padding: 12px 24px;
              background-color: #0f172b;
              color: #ffffff;
              text-decoration: none;
              font-weight: bold;
              border-radius: 6px;
            "
            target="_blank"
          >
            Reset Password
          </a>

          <p style="font-size: 14px; color: #64748b; line-height: 1.6;">
            If the button above doesn't work, copy and paste the link below into
            your web browser:
          </p>
          <p
            style="
              word-break: break-all;
              color: #0f172b;
              font-size: 13px;
              line-height: 1.4;
            "
          >
            <a href="${resetPasswordLink}" style="color: #0f172b;">
              ${resetPasswordLink}
            </a>
          </p>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

          <p style="font-size: 13px; color: #94a3b8;">
            If you didn’t request this, you can safely ignore this email.
          </p>
          <p style="font-size: 13px; color: #94a3b8;">
            — The Support Team
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
    const emailSubject = "Reset your password";

    const isEmailSent = await sendEmail(email, emailSubject, emailBody);

    if (!isEmailSent) {
      return res.status(500).json({
        message: "Failed to send reset password email",
      });
    }

    res.status(200).json({ message: "Reset password email sent " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server Error" });
  }
};

const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    // Verify JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, purpose } = payload;

    // Ensure the token is meant for password reset
    if (purpose !== "reset-password") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find verification record
    const verification = await Verification.findOne({ userId, token });
    if (!verification) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check token expiration
    const isTokenExpired = verification.expiresAt < new Date();
    if (isTokenExpired) {
      await Verification.findByIdAndDelete(verification._id);
      return res.status(401).json({ message: "Token expired" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    // Delete verification record
    await Verification.findByIdAndDelete(verification._id);

    // ✅ Send success response
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  registerUser,
  loginUser,
  verifyEmail,
  resetPasswordRequest,
  verifyResetPasswordTokenAndResetPassword,
};
