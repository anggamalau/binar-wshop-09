const express = require('express');
const bcrypt = require('bcrypt');
const { getDatabase } = require('../database/init');
const { generateToken, verifyToken } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  // Validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  
  try {
    const db = getDatabase();
    
    // Check if user already exists
    db.get('SELECT id FROM users WHERE username = ?', [username], async (err, row) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
        db.close();
        return;
      }
      
      if (row) {
        res.status(400).json({ error: 'Username already exists' });
        db.close();
        return;
      }
      
      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Insert new user
      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
        if (err) {
          console.error('Error creating user:', err);
          res.status(500).json({ error: 'Internal server error' });
          db.close();
          return;
        }
        
        // Generate JWT token
        const token = generateToken(this.lastID, username);
        
        res.status(201).json({ 
          message: 'User registered successfully',
          user: { id: this.lastID, username: username },
          token: token
        });
        
        db.close();
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  const db = getDatabase();
  
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Internal server error' });
      db.close();
      return;
    }
    
    if (!user) {
      res.status(401).json({ error: 'Invalid username or password' });
      db.close();
      return;
    }
    
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        res.status(401).json({ error: 'Invalid username or password' });
        db.close();
        return;
      }
      
      // Generate JWT token
      const token = generateToken(user.id, user.username);
      
      res.json({ 
        message: 'Login successful',
        user: { id: user.id, username: user.username },
        token: token
      });
      
      db.close();
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
      db.close();
    }
  });
});

// Get current user (verify token)
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    res.json({ 
      user: { 
        id: decoded.userId, 
        username: decoded.username 
      }
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  }
});

// Refresh token
router.post('/refresh', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    const newToken = generateToken(decoded.userId, decoded.username);
    
    res.json({ 
      message: 'Token refreshed successfully',
      token: newToken
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    } else {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
});

module.exports = router;