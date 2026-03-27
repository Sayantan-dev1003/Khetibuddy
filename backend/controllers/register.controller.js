const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../Methods/bcryptPassword.js');

const registerUser = async (req, res) => {
  const { name, email, password , role} = req.body;

  try {
    // 1️: Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists ' });
    }

    // 2️: Hash password
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      return res.status(500).json({ message: 'Error hashing password' });
    }

    // 3️: Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // 4️: Generate JWT
    const token = jwt.sign(
      {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role, // IMPORTANT
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
 
    
// 4: SET COOKIE
res.cookie("token", token, {
  httpOnly: true,
  secure: false,   // true in production (HTTPS)
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


    // 5: Send response (no password will be send in response of jwt)
    res.status(201).json({
      message: 'User registered successfully ',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  registerUser
};

module.exports = {
  registerUser
};