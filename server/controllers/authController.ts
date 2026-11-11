import { Request, Response } from 'express';
import User from '../models/User.ts';

/**
 * Controller for User Authentication
 * Handles registration, login, and profile fetching
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // In production with MongoDB, hash password with bcrypt.
    // For universal portability, we store with basic token generation
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password, // In full production, use bcrypt.hash(password, 10)
      role: 'student',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f46e5`,
    });

    const token = `token_${newUser._id}_${Date.now()}`;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
      },
      token,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = `token_${user._id}_${Date.now()}`;

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};
