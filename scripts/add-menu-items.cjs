/**
 * Script to add sample menu items to MongoDB database
 * Run with: node scripts/add-menu-items.cjs
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection
async function connectToMongoDB() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MongoDB URI not found in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Define schemas
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  ingredients: {
    type: [String],
    default: [],
  },
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  spiceLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  vegetarian: {
    type: Boolean,
    default: false,
  },
  vegan: {
    type: Boolean,
    default: false,
  },
  glutenFree: {
    type: Boolean,
    default: false,
  },
  available: {
    type: Boolean,
    default: true,
  },
  preparationTime: {
    type: Number, // in minutes
    default: 15,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create models
const Category = mongoose.model('Category', categorySchema);
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Sample data
const sampleCategories = [
  {
    name: 'Appetizers',
    description: 'Start your meal with these delicious starters',
    displayOrder: 1,
  },
  {
    name: 'Main Courses',
    description: 'Our signature dishes',
    displayOrder: 2,
  },
  {
    name: 'Pasta & Risotto',
    description: 'Authentic Italian classics',
    displayOrder: 3,
  },
  {
    name: 'Sides',
    description: 'Perfect companions to your main dish',
    displayOrder: 4,
  },
  {
    name: 'Desserts',
    description: 'Sweet treats to end your meal',
    displayOrder: 5,
  },
  {
    name: 'Beverages',
    description: 'Refreshing drinks',
    displayOrder: 6,
  }
];

// Function to create sample menu items
async function createSampleData() {
  try {
    // Check if categories already exist
    const categoryCount = await Category.countDocuments();
    let categories = [];
    
    if (categoryCount === 0) {
      console.log('Creating sample categories...');
      categories = await Category.insertMany(sampleCategories);
      console.log(`Created ${categories.length} categories`);
    } else {
      console.log(`Found ${categoryCount} existing categories`);
      categories = await Category.find({});
    }

    // Check if menu items already exist
    const menuItemCount = await MenuItem.countDocuments();
    if (menuItemCount > 0) {
      console.log(`Found ${menuItemCount} existing menu items, skipping creation`);
      return;
    }

    // Create menu items for each category
    console.log('Creating sample menu items...');
    
    const appetizersCategory = categories.find(c => c.name === 'Appetizers')._id;
    const mainCoursesCategory = categories.find(c => c.name === 'Main Courses')._id;
    const pastaCategory = categories.find(c => c.name === 'Pasta & Risotto')._id;
    const sidesCategory = categories.find(c => c.name === 'Sides')._id;
    const dessertsCategory = categories.find(c => c.name === 'Desserts')._id;
    const beveragesCategory = categories.find(c => c.name === 'Beverages')._id;

    const sampleMenuItems = [
      // Appetizers
      {
        name: 'Bruschetta',
        description: 'Grilled bread rubbed with garlic and topped with diced tomatoes, fresh basil, and olive oil',
        price: 9.99,
        categoryId: appetizersCategory,
        ingredients: ['Bread', 'Tomatoes', 'Garlic', 'Basil', 'Olive oil'],
        spiceLevel: 0,
        featured: true,
        vegetarian: true,
        preparationTime: 10,
      },
      {
        name: 'Caprese Salad',
        description: 'Fresh mozzarella, tomatoes, and sweet basil, seasoned with salt and olive oil',
        price: 12.99,
        categoryId: appetizersCategory,
        ingredients: ['Mozzarella', 'Tomatoes', 'Basil', 'Olive oil', 'Balsamic glaze'],
        spiceLevel: 0,
        vegetarian: true,
        glutenFree: true,
        preparationTime: 8,
      },
      {
        name: 'Arancini',
        description: 'Crispy fried rice balls stuffed with mozzarella and peas',
        price: 11.50,
        categoryId: appetizersCategory,
        ingredients: ['Arborio rice', 'Mozzarella', 'Peas', 'Breadcrumbs', 'Parmesan'],
        spiceLevel: 1,
        vegetarian: true,
        preparationTime: 15,
      },
      
      // Main Courses
      {
        name: 'Pollo al Marsala',
        description: 'Chicken breast sautéed with Marsala wine and mushrooms',
        price: 24.99,
        categoryId: mainCoursesCategory,
        ingredients: ['Chicken breast', 'Marsala wine', 'Mushrooms', 'Butter', 'Herbs'],
        spiceLevel: 0,
        glutenFree: true,
        featured: true,
        preparationTime: 25,
      },
      {
        name: 'Osso Buco',
        description: 'Veal shanks braised with vegetables, white wine and broth',
        price: 32.99,
        categoryId: mainCoursesCategory,
        ingredients: ['Veal shanks', 'Vegetables', 'White wine', 'Broth', 'Gremolata'],
        spiceLevel: 0,
        glutenFree: true,
        preparationTime: 40,
      },
      {
        name: 'Branzino',
        description: 'Mediterranean sea bass filleted and grilled with lemon and herbs',
        price: 29.99,
        categoryId: mainCoursesCategory,
        ingredients: ['Sea bass', 'Lemon', 'Olive oil', 'Garlic', 'Fresh herbs'],
        spiceLevel: 0,
        glutenFree: true,
        preparationTime: 30,
      },
      
      // Pasta & Risotto
      {
        name: 'Spaghetti Carbonara',
        description: 'Spaghetti with a creamy sauce of eggs, cheese, pancetta, and black pepper',
        price: 18.99,
        categoryId: pastaCategory,
        ingredients: ['Spaghetti', 'Eggs', 'Pecorino Romano', 'Pancetta', 'Black pepper'],
        spiceLevel: 1,
        featured: true,
        preparationTime: 20,
      },
      {
        name: 'Risotto ai Funghi',
        description: 'Creamy risotto with wild mushrooms and parmesan',
        price: 21.99,
        categoryId: pastaCategory,
        ingredients: ['Arborio rice', 'Wild mushrooms', 'Parmesan', 'White wine', 'Butter'],
        spiceLevel: 0,
        vegetarian: true,
        glutenFree: true,
        preparationTime: 35,
      },
      {
        name: 'Gnocchi al Pesto',
        description: 'Potato dumplings with basil pesto sauce and pine nuts',
        price: 19.50,
        categoryId: pastaCategory,
        ingredients: ['Potato gnocchi', 'Basil pesto', 'Pine nuts', 'Parmesan', 'Olive oil'],
        spiceLevel: 0,
        vegetarian: true,
        preparationTime: 25,
      },
      
      // Sides
      {
        name: 'Roasted Potatoes',
        description: 'Crispy potatoes roasted with rosemary and garlic',
        price: 7.99,
        categoryId: sidesCategory,
        ingredients: ['Potatoes', 'Rosemary', 'Garlic', 'Olive oil', 'Salt'],
        spiceLevel: 0,
        vegetarian: true,
        vegan: true,
        glutenFree: true,
        preparationTime: 30,
      },
      {
        name: 'Sautéed Spinach',
        description: 'Fresh spinach sautéed with garlic and olive oil',
        price: 8.50,
        categoryId: sidesCategory,
        ingredients: ['Spinach', 'Garlic', 'Olive oil', 'Lemon', 'Salt'],
        spiceLevel: 0,
        vegetarian: true,
        vegan: true,
        glutenFree: true,
        preparationTime: 10,
      },
      
      // Desserts
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream',
        price: 10.99,
        categoryId: dessertsCategory,
        ingredients: ['Ladyfingers', 'Mascarpone', 'Coffee', 'Cocoa', 'Eggs'],
        spiceLevel: 0,
        vegetarian: true,
        featured: true,
        preparationTime: 15,
      },
      {
        name: 'Panna Cotta',
        description: 'Italian cream dessert with vanilla and berries',
        price: 9.99,
        categoryId: dessertsCategory,
        ingredients: ['Cream', 'Vanilla', 'Gelatin', 'Sugar', 'Berries'],
        spiceLevel: 0,
        vegetarian: true,
        glutenFree: true,
        preparationTime: 10,
      },
      
      // Beverages
      {
        name: 'Italian Soda',
        description: 'Sparkling water with your choice of fruit syrup',
        price: 4.99,
        categoryId: beveragesCategory,
        ingredients: ['Sparkling water', 'Fruit syrup', 'Ice'],
        spiceLevel: 0,
        vegetarian: true,
        vegan: true,
        glutenFree: true,
        preparationTime: 3,
      },
      {
        name: 'Espresso',
        description: 'Traditional Italian coffee',
        price: 3.99,
        categoryId: beveragesCategory,
        ingredients: ['Coffee beans', 'Water'],
        spiceLevel: 0,
        vegetarian: true,
        vegan: true,
        glutenFree: true,
        preparationTime: 2,
      }
    ];
    
    await MenuItem.insertMany(sampleMenuItems);
    console.log(`Created ${sampleMenuItems.length} menu items`);
    
  } catch (error) {
    console.error('Error creating sample data:', error);
  }
}

// Main function
async function main() {
  try {
    await connectToMongoDB();
    await createSampleData();    
    
    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Script error:', error);
  }
}

// Run the script
main();