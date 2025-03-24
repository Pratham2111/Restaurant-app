/**
 * Authentication routes for admin and sub-admin users
 */
import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * Register a new user (admin only)
 * @route POST /api/auth/register
 * @access Admin only
 */
router.post('/register', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const userData = req.body;
    
    // Data validation
    if (!userData.email || !userData.password || !userData.name || !userData.role) {
      return res.status(400).json({ 
        message: "Please provide email, password, name, and role" 
      });
    }
    
    // Check if email already exists
    const existingUser = await req.app.locals.storage.getUserByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Create user with hashed password
    const userToCreate = {
      ...userData,
      password: hashedPassword
    };
    
    const user = await req.app.locals.storage.createUser(userToCreate);
    
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: "Failed to register user" });
  }
});

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Data validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }
    
    // Find user by email
    const user = await req.app.locals.storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Create token
    const token = generateToken(user);
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    });
    
    // Return user data without password
    const { password: pwd, ...userWithoutPassword } = user;
    res.json({ 
      user: userWithoutPassword,
      token 
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: "Failed to login" });
  }
});

/**
 * Get current user
 * @route GET /api/auth/me
 * @access Private
 */
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

/**
 * Logout user
 * @route POST /api/auth/logout
 * @access Private
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Logged out successfully" });
});

/**
 * Get all users (admin only)
 * @route GET /api/auth/users
 * @access Admin only
 */
router.get('/users', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const users = await req.app.locals.storage.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: "Failed to get users" });
  }
});

/**
 * Update user (admin only)
 * @route PUT /api/auth/users/:id
 * @access Admin only
 */
router.put('/users/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    // Prevent role change of self
    if (req.user.id === id && userData.role && userData.role !== req.user.role) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }
    
    // If password is being updated, hash it
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    
    const user = await req.app.locals.storage.updateUser(id, userData);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

/**
 * Delete user (admin only)
 * @route DELETE /api/auth/users/:id
 * @access Admin only
 */
router.delete('/users/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deletion of self
    if (req.user.id.toString() === id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }
    
    const success = await req.app.locals.storage.deleteUser(id);
    if (!success) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;