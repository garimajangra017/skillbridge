
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

function makeToken(user) {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  return {
    _id: user._id,
    id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    skills: user.skills || [],
    avatar: user.avatar,
    github: user.github,
    linkedin: user.linkedin,
    role: user.role
  };
}

async function sendResetEmail({ to, name, resetUrl }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_USER;

  if (!apiKey || !senderEmail) {
    throw new Error(
      "Set BREVO_API_KEY and EMAIL_USER in Render."
    );
  }

  const safeName = String(name || "there")
    .replace(/[&<>"']/g, "");

  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: process.env.EMAIL_FROM_NAME || "SkillBridge",
          email: process.env.EMAIL_FROM || senderEmail
        },
        to: [{ email: to, name: safeName }],
        subject: "Reset your SkillBridge password",
        textContent:
          `Hello ${safeName},\n\n` +
          `Use this link to reset your SkillBridge password. ` +
          `It expires in 15 minutes:\n${resetUrl}\n\n` +
          `If you did not request this, ignore this email.`,
        htmlContent: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:28px;color:#172033">
            <h2 style="color:#5b5ce2">Reset your SkillBridge password</h2>
            <p>Hello ${safeName},</p>
            <p>We received a request to reset your password.</p>
            <p>This secure link expires in <b>15 minutes</b> and can only be used once.</p>
            <p style="margin:28px 0">
              <a href="${resetUrl}" style="background:#5b5ce2;color:#fff;text-decoration:none;padding:13px 22px;border-radius:8px;display:inline-block">
                Reset password
              </a>
            </p>
            <p>If the button does not work, copy this link:</p>
            <p style="word-break:break-all">${resetUrl}</p>
            <p>If you did not request this, ignore this email.</p>
          </div>
        `
      })
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Brevo API ${response.status}: ${details.slice(0, 500)}`
    );
  }
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters."
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token: makeToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Registration failed."
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const user = await User.findOne({
      email: String(email).toLowerCase().trim()
    }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    res.json({
      success: true,
      message: "Login successful.",
      token: makeToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed."
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const genericMessage =
    "If an account exists for this email, a password reset link has been sent.";

  try {
    const email = String(req.body.email || "")
      .toLowerCase()
      .trim();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address."
      });
    }

    if (!process.env.BREVO_API_KEY || !process.env.EMAIL_USER) {
      return res.status(503).json({
        success: false,
        message: "Password reset email is not configured yet."
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: true,
        message: genericMessage
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.passwordResetExpires =
      new Date(Date.now() + 15 * 60 * 1000);

    await user.save({ validateBeforeSave: false });

    const frontendUrl = (
      process.env.FRONTEND_URL ||
      process.env.CLIENT_URL ||
      "http://localhost:5173"
    ).replace(/\/$/, "");

    const resetUrl =
      `${frontendUrl}/?resetToken=${rawToken}`;

    try {
      await sendResetEmail({
        to: user.email,
        name: user.name,
        resetUrl
      });
    } catch (mailError) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;

      await user.save({ validateBeforeSave: false });

      console.error(
        "Password reset email failed:",
        mailError.message
      );

      return res.status(502).json({
        success: false,
        message: "We could not send the reset email. Please try again later."
      });
    }

    return res.json({
      success: true,
      message: genericMessage
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not process the password reset request."
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required."
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long."
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(String(token))
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }
    }).select(
      "+passwordResetToken +passwordResetExpires +password"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This reset link is invalid or has expired. Please request a new one."
      });
    }

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    return res.json({
      success: true,
      message: "Password updated successfully. You can now sign in with your new password."
    });
  } catch (error) {
    console.error("Reset password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not reset your password. Please try again."
    });
  }
};

exports.me = (req, res) => {
  res.json({
    success: true,
    user: publicUser(req.user)
  });
};
