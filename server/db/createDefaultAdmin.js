/**
 * Creates a default admin user if no admin users exist
 * This is a separate utility function that can be imported where needed
 */
import User from './models/User.js';

/**
 * Creates a default admin user if no admin users exist
 */
export async function createDefaultAdminIfNeeded() {
  try {
    // Check if any admin user exists
    const adminExists = await User.exists({ role: 'admin' });
    
    if (!adminExists) {
      console.log('Creating default admin user...');
      
      // Create a default admin user
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@lamason.com',
        password: 'Admin123!',  // Will be hashed by the pre-save hook
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Default admin user created successfully');
    } else {
      console.log('Admin user already exists, skipping creation');
    }
  } catch (error) {
    console.error('Error creating default admin user:', error);
  }
}