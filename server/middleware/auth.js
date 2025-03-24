/**
 * Authentication middleware
 */
import jwt from 'jsonwebtoken';
import { User } from '../db/models/index.js';

// JWT Secret - in production this would be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'la-mason-secret-key';

/**
 * Generate JWT token
 * @param {Object} user - User data (without password)
 * @returns {string} JWT token
 */
export const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  };
  
  // Token expires in 24 hours
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 * @param {Express.Request} req - Express request
 * @param {Express.Response} res - Express response
 * @param {Express.NextFunction} next - Express next function
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from authorization header or cookie
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user by ID
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * Admin authorization middleware
 * Requires user to have admin role
 * Must be used after authenticate middleware
 * @param {Express.Request} req - Express request
 * @param {Express.Response} res - Express response
 * @param {Express.NextFunction} next - Express next function
 */
export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};