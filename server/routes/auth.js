/**
 * Authentication routes for users
 */
import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * Register a new customer (public access)
 * @route POST /api/auth/register
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    console.log('Register attempt with data:', { 
      email: req.body.email, 
      name: req.body.name,
      hasPassword: !!req.body.password 
    });
    
    const userData = req.body;
    
    // Data validation
    if (!userData.email || !userData.password || !userData.name) {
      console.log('Registration failed: Missing required fields');
      return res.status(400).json({ 
        message: "Please provide email, password, and name" 
      });
    }
    
    // Check if email already exists
    const existingUser = await req.app.locals.storage.getUserByEmail(userData.email);
    if (existingUser) {
      console.log('Registration failed: Email already in use:', userData.email);
      return res.status(400).json({ message: "Email already in use" });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Create user with hashed password - ensure role is customer for public registrations
    const userToCreate = {
      ...userData,
      role: "customer", // Force role to be customer for public registrations
      password: hashedPassword
    };
    
    console.log('Creating user with role:', userToCreate.role);
    const user = await req.app.locals.storage.createUser(userToCreate);
    console.log('User created with ID:', user._id || user.id);
    
    // Convert Mongoose document to plain object if needed
    let userObj = user;
    if (user.toObject) {
      userObj = user.toObject();
      console.log('Converted user Mongoose document to object');
    }
    
    // Ensure ID is consistent
    userObj.id = userObj._id?.toString() || userObj.id;
    
    // Create token for immediate login
    const token = generateToken(userObj);
    console.log('Generated token for new user');
    
    // Set cookie with more permissive settings for development
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax', // Use 'lax' instead of 'strict' to allow cross-site requests
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      path: '/' // Ensure the cookie is available for all paths
    });
    
    // Return user data without password
    const { password: pwd, ...userWithoutPassword } = userObj;
    
    console.log('Registration successful for:', userData.email);
    res.status(201).json({ 
      user: userWithoutPassword,
      token 
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: "Failed to register user" });
  }
});

/**
 * Register a new user (admin only)
 * @route POST /api/auth/admin/register
 * @access Admin only
 */
router.post('/admin/register', authenticate, authorizeAdmin, async (req, res) => {
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
    console.log('Login attempt with email:', req.body.email);
    const { email, password } = req.body;
    
    // Data validation
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ message: "Please provide email and password" });
    }
    
    // Find user by email
    const user = await req.app.locals.storage.getUserByEmail(email);
    
    if (!user) {
      console.log('Login failed: User not found with email:', email);
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    console.log('User found:', {
      id: user._id || user.id,
      email: user.email,
      role: user.role,
      passwordExists: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isMatch);
    
    if (!isMatch) {
      console.log('Login failed: Password mismatch for user:', email);
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Convert user document to plain object if it's a Mongoose document
    let userObj = user;
    if (user.toObject) {
      userObj = user.toObject();
      console.log('Converted Mongoose document to object');
    }
    
    // Ensure ID is consistent
    userObj.id = userObj._id?.toString() || userObj.id;
    
    // Create token
    const token = generateToken(userObj);
    console.log('Generated token with user ID:', userObj.id);
    
    // Set cookie with more permissive settings for development
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax', // Use 'lax' instead of 'strict' to allow cross-site requests
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      path: '/' // Ensure the cookie is available for all paths
    });
    
    // Return user data without password
    const { password: pwd, ...userWithoutPassword } = userObj;
    console.log('Login successful for user:', email);
    
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
  console.log('Logout request received');
  res.clearCookie('token', { 
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  console.log('Cookie cleared');
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