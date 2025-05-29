import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { io } from '../index.js';

const router = express.Router();

router.post('/click', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked' });
    }
    
    user.clickCount += 1;
    await user.save();
    
    io.emit('click_update', { userId: user._id, clickCount: user.clickCount });
    
    res.json({
      message: 'Click count updated',
      clickCount: user.clickCount
    });
  } catch (err) {
    console.error('Click count update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/rankings', authenticateToken, async (req, res) => {
  try {
    const players = await User.find({ 
      role: 'player', 
      isBlocked: false 
    }).sort({ clickCount: -1 });
    
    res.json({
      rankings: players.map(player => ({
        id: player._id,
        username: player.username,
        clickCount: player.clickCount,
        isOnline: player.isOnline,
        isBlocked: player.isBlocked
      }))
    });
  } catch (err) {
    console.error('Get rankings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;