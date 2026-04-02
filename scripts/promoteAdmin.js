import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../api/models/User.js';

dotenv.config();

const usernameToPromote = process.argv[2] || 'admin';

async function promote() {
  try {
    console.log(`Connecting to MongoDB to promote ${usernameToPromote}...`);
    await mongoose.connect(process.env.MONGODB_URI);
    
    const user = await User.findOne({ username: usernameToPromote });
    
    if (!user) {
      console.error(`User ${usernameToPromote} not found. Register the user first!`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    
    console.log(`Successfully promoted ${usernameToPromote} to ADMIN! 👑`);
    process.exit(0);
  } catch (error) {
    console.error('Promotion error:', error);
    process.exit(1);
  }
}

promote();
