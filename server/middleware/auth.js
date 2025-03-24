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
  console.log('Generating token for user:', {
    id: user.id || user._id,
    email: user.email,
    role: user.role,
    isMongooseDoc: !!user.toObject
  });
  
  // Convert Mongoose document to plain object if needed
  const userObject = user.toObject ? user.toObject() : user;
  
  // Extract user data without password
  const { password, ...userForToken } = userObject;
  
  // Ensure id is consistent (use _id from MongoDB but alias as id)
  if (userForToken._id && !userForToken.id) {
    userForToken.id = typeof userForToken._id === 'string' ? 
      userForToken._id : userForToken._id.toString();
  }
  
  console.log('JWT payload:', userForToken);
  
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
    console.log('Authenticating request to:', req.originalUrl);
    
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
      console.log('No token found in request');
      return res.status(401).json({ message: "Authorization required" });
    }
    
    console.log('Token found, verifying...');
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded:', {
      id: decoded.id || decoded._id,
      email: decoded.email,
      role: decoded.role
    });
    
    // Get user from database to ensure they still exist and have correct permissions
    // Use id or _id from decoded token - both should now be available
    const userId = decoded.id || decoded._id;
    
    if (!userId) {
      console.log('No user ID found in token');
      return res.status(401).json({ message: "Invalid token: Missing user ID" });
    }
    
    console.log('Looking up user with ID:', userId);
    const user = await req.app.locals.storage.getUserById(userId);
    
    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(401).json({ message: "User not found" });
    }
    
    console.log('User authenticated:', {
      id: user.id || user._id,
      email: user.email,
      role: user.role
    });
    
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