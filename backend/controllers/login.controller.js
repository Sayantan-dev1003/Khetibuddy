const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const { comparePassword } = require('../Methods/bcryptPassword.js');

const loginUser = async (req, res) => {
  console.log("Login route hit ");

  const { email, password } = req.body;

  try {
    // 1️: Find user
    const existingUser = await User.findOne({ email }); //  VERY IMPORTANT;
    if (!existingUser) {
      return res.status(404).json({ message: "User not found " });
    }

    // 2️: Compare password
    const isMatch = await comparePassword(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials " });
    }

    // 3️: Create JWT
    const token = jwt.sign(
      {
        _id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role, //  ROLE ADDED(role basis pe token ki need thi nahi phir bhi for future)
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );


    // 4: SET COOKIE
    res.cookie("token", token, {
          httpOnly: true,
          secure: false,   // true in production (HTTPS)
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 5: Send response
    return res.status(200).json({
      message: "Login successful ",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  loginUser
};