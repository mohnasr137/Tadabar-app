// packages
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// imports
const User = require("../../models/user");

// routers
const signUp = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const nameMatch = /^[A-Za-z0-9]*$/;
    const emailMatch =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const passwordMatch =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!name.match(nameMatch)) {
      return res.status(400).json({ message: "please enter a valid name" });
    }
    if (!email.match(emailMatch)) {
      return res.status(400).json({ message: "please enter a valid email" });
    }
    if (!password.match(passwordMatch)) {
      return res.status(400).json({ message: "please enter a valid password" });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "password and confirm password are not the same" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "the user with same email already exists!" });
    }
    const hashedPassword = await bcryptjs.hash(password, 8);
    const code = `${Math.floor(100000 + Math.random() * 900000)}`;
    let user = new User({
      name,
      email,
      password: hashedPassword,
      code,
    });
    user = await user.save();
    return res.status(200).json({ message: "user created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "the user with this email not found!" });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "1h",
    });
    const name = user.name;
    res.json({
      message: "login successfully",
      token,
      name,
      statusCode: 200,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { signUp, signIn };
