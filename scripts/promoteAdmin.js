import dotenv from 'dotenv';
import User from '../api/models/User.js';

dotenv.config({ path: ['.env.local', '.env'] });

const usernameToPromote = process.argv[2] || 'admin';

async function promote() {
  try {
    const user = await User.findOne({ username: usernameToPromote });

    if (!user) {
      console.error(`User ${usernameToPromote} not found. Register the user first.`);
      process.exit(1);
    }

    await User.update(user.id, { role: 'admin' });
    console.log(`Successfully promoted ${usernameToPromote} to admin.`);
    process.exit(0);
  } catch (error) {
    console.error('Promotion error:', error);
    process.exit(1);
  }
}

promote();
