import express from 'express';
import User from '../models/User.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    
    res.json({
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        role: user.role,
        clickCount: user.clickCount,
        isOnline: user.isOnline,
        isBlocked: user.isBlocked,
        createdAt: user.createdAt
      }))
    });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/users', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    const user = new User({
      username,
      password,
      role: role || 'player'
    });
    
    await user.save();
    
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        clickCount: user.clickCount,
        isOnline: user.isOnline,
        isBlocked: user.isBlocked,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { username, password, role, isBlocked } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (username) user.username = username;
    if (password) user.password = password; 
    if (role) user.role = role;
    if (isBlocked !== undefined) user.isBlocked = isBlocked;
    
    await user.save();
    
    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        clickCount: user.clickCount,
        isOnline: user.isOnline,
        isBlocked: user.isBlocked,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/users/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await User.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;