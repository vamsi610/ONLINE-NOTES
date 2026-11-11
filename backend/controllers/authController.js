const User = require('../models/User');

// @desc    Register a new student user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password, // In production, hash with bcryptjs
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f46e5`,
    });

    const token = `token_${user._id}_${Date.now()}`;

    res.status(201).json({
      success: true,
      message: 'Student account created successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate student & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = `token_${user._id}_${Date.now()}`;

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
