const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateUserId = () => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `USR-${randomDigits}`;
};

const createUser = async (userData) => {
  const { name, email, password, role = "user" } = userData;
  const userId = generateUserId();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    userId,
    name,
    email,
    password: hashedPassword,
    role,
  });
  return await newUser.save();
};

const getUsers = async () => {
  return User.find();
};

const getUserById = async (userId) => {
  try {
    const user = await User.findOne({ userId });
    return user;
  } catch (error) {
    throw new Error("Error fetching user by userId");
  }
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { userId: user.userId, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return { token, message: "Login successful", userId: user.userId, role: user.role };
};

const logoutUser = (res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return { message: "Logout successful" };
};

module.exports = {
  createUser,
  getUsers,
  loginUser,
  logoutUser,
  getUserById,
};
