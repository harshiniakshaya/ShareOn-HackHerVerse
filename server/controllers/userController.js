const userService = require("../services/userService");

const createUserController = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

const getUsersController = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const getUserByIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { token, userId, message, role } = await userService.loginUser(
      email,
      password
    );
    console.log(userId);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
    });

    return res.status(200).json({ message, userId, role });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const logoutUserController = (req, res) => {
  const response = userService.logoutUser(res);
  return res.status(200).json(response);
};

module.exports = {
  createUserController,
  getUsersController,
  loginUserController,
  logoutUserController,
  getUserByIdController,
};
