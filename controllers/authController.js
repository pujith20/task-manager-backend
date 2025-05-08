const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { requestOTP, validateOTP } = require("../middlewares/otp");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Failed to send OTP email:", err);
  }
};

exports.getusers = async (req, res) => {
  try {
    const users = await User.find({}, "name username email role"); // Only return necessary fields
    res.status(200).json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

exports.register = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      role = req.body.role || "User",
    } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: "Username already exists" });

    const user = await User.create({ name, username, email, password, role });
    const token = generateToken(user);
    res.status(201).json({
      user: { name: user.name, username: user.username, role: user.role },
      token,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Email or username already exists" });
    }
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = generateToken(user);
    res.json({
      user: {
        name: user.name,
        username: user.username,
        role: user.role,
        id: user._id,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "Username not found" }); // Changed to 404 for not found
    }
    //  Return the user's email
    res.status(200).json({ email: user.email });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Request OTP for password reset
exports.requestReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const otp = requestOTP(email); // Generate OTP and store it
    await sendOTPEmail(email, otp); // Send OTP to the email
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error in requestReset:", err);
    res.status(500).json({ error: "Error sending OTP" });
  }
};

// Verify OTP and allow password reset
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const validation = validateOTP(email, otp);

  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  res
    .status(200)
    .json({ message: "OTP verified, you can now reset your password" });
};

// Reset password after OTP verification
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!newPassword) {
    return res
      .status(400)
      .json({ error: "New password is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update password (ensure password hashing is handled in your User model)
    user.password = newPassword;
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      message: "Password reset successful",
      user: {
        name: user.name,
        username: user.username,
        role: user.role,
        id: user._id,
      },
      token,
    });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

// Delete the User

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

