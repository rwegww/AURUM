-- Add avatar_seed column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_seed TEXT;

-- Update existing users to have their username as default seed
UPDATE users SET avatar_seed = username WHERE avatar_seed IS NULL;
