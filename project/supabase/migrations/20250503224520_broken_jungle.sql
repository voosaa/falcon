/*
  # Create deliveries table

  1. New Tables
    - `deliveries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users.id)
      - `token_link` (text, not null) - The token purchase link
      - `sent_at` (timestamptz, default now()) - Timestamp when link was sent
  
  2. Security
    - Enable RLS on deliveries table
    - Add policies for service role to manage deliveries
*/

-- Create deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  token_link text NOT NULL,
  sent_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Service role can manage deliveries"
  ON deliveries
  TO service_role
  USING (true)
  WITH CHECK (true);