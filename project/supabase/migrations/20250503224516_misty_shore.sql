/*
  # Create users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `chat_id` (bigint, not null, unique) - Telegram chat ID
      - `username` (text) - Telegram username
      - `registered_at` (timestamptz, default now()) - Registration timestamp
  
  2. Security
    - Enable RLS on users table
    - Add policies for service role to manage users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id bigint NOT NULL UNIQUE,
  username text,
  registered_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Service role can manage users"
  ON users
  TO service_role
  USING (true)
  WITH CHECK (true);