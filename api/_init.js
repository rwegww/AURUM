import dotenv from 'dotenv';

// Load environment variables immediately
// This ensures that even in ES modules, they are available to top-level imports
dotenv.config();

console.log('✅ API Initialization complete (Environment variables loaded)');
