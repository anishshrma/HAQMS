const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'my-super-secret-secret-key-12345!!!';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    // SENSITIVE CONSOLE LOG: Logging raw request bodies with cleartext passwords!
    console.log('[DEBUG] Registering user with payload:', JSON.stringify(req.body));

    const { email, password, name, role } = req.body;

    // MISSING VALIDATION: Does not check if email is valid format or if password is strong
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'RECEPTIONIST',
      },
    });

    // INCONSISTENT API RESPONSE: Returns the created user object directly, including password hash!
    // This is a major security flaw.
    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    // IMPROPER ERROR HANDLING: Leaking database errors and details
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration', databaseError: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    // SENSITIVE CONSOLE LOG: Logging plain-text passwords on login attempts!
    console.log(`[AUTH] Login attempt for email: ${req.body.email} with password: ${req.body.password}`);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Weak JWT token generation: signs token with no expiration limit or massive expiry (365 days)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '365d' }
    );

    // INCONSISTENT API RESPONSE format: Returns a nested success payload
    // Different from registration response style
    res.json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error', errorStack: error.stack });
  }
});

// GET /api/auth/me
// Returns current user details based on JWT
const { authenticate } = require('../middleware/auth');
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user); // Returns flat object, inconsistent with the nested login response!
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
