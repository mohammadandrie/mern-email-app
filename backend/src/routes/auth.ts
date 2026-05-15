import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// Generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// POST /api/auth/register
router.post('/register', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({ email, password });
    const token = generateToken(user._id.toString());

    res.status(201).json({
      _id: user._id,
      email: user.email,
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Record login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id.toString());

    res.json({
      _id: user._id,
      email: user.email,
      token,
      lastLoginAt: user.lastLoginAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/logout
router.post('/logout', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (user) {
      user.lastLogoutAt = new Date();
      await user.save();
    }
    res.json({ message: 'Logged out successfully', lastLogoutAt: user?.lastLogoutAt });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
