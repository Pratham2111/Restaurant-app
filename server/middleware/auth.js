/**
 * Authentication middleware
 */
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'la-mason-jwt-secret';

/**
 * Generate JWT token
 * @param {Object} user - User data (without password)
 * @returns {string} JWT token
 */
export const generateToken = (user) => {
  // Convert Mongoose document to plain object if needed
  const userObject = user.toObject ? user.toObject() : user;
  
  // Extract user data without password
  const { password, ...userForToken } = userObject;
  
  // Ensure id is consistent (use _id from MongoDB but alias as id)
  if (userForToken._id && !userForToken.id) {
    userForToken.id = userForToken._id.toString();
  }
  
  return jwt.sign(userForToken, JWT_SECRET, {
    expiresIn: '24h'
  });
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
    // Get token from cookie or header
    let token = req.cookies?.token;
    
    // If no token in cookie, check header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }
    
    if (!token) {
      return res.status(401).json({ message: "Authorization required" });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database to ensure they still exist and have correct permissions
    // Use id or _id from decoded token - both should now be available
    const userId = decoded.id || decoded._id;
    
    if (!userId) {
      return res.status(401).json({ message: "Invalid token: Missing user ID" });
    }
    
    const user = await req.app.locals.storage.getUserById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Authentication error" });
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
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
};