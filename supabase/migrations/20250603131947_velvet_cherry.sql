/*
  # Create surveys table

  1. New Tables
    - `surveys`
      - `id` (int, primary key)
      - `created_at` (timestamptz, default now())
      - `full_name` (text, not null)
      - `contact_number` (text, not null)
      - `date` (date, not null)
      - `age` (int, not null, between 5 and 120)
      - `likes_pizza` (boolean, default false)
      - `likes_pasta` (boolean, default false)
      - `likes_papAndWors` (boolean, default false)
      - `likes_chickenStirFry` (boolean, default false)
      - `rating_eatOut` (int, not null, between 1 and 5)
      - `rating_watchMovies` (int, not null, between 1 and 5)
      - `rating_watchTV` (int, not null, between 1 and 5)
      - `rating_listenRadio` (int, not null, between 1 and 5)
  
  2. Security
    - Enable RLS on `surveys` table
    - Add policy for anonymous access to read and insert data
*/

-- Create surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  date DATE NOT NULL,
  age INT NOT NULL CHECK (age >= 5 AND age <= 120),
  likes_pizza BOOLEAN DEFAULT FALSE,
  likes_pasta BOOLEAN DEFAULT FALSE,
  likes_papAndWors BOOLEAN DEFAULT FALSE,
  likes_chickenStirFry BOOLEAN DEFAULT FALSE,
  rating_eatOut INT NOT NULL CHECK (rating_eatOut BETWEEN 1 AND 5),
  rating_watchMovies INT NOT NULL CHECK (rating_watchMovies BETWEEN 1 AND 5),
  rating_watchTV INT NOT NULL CHECK (rating_watchTV BETWEEN 1 AND 5),
  rating_listenRadio INT NOT NULL CHECK (rating_listenRadio BETWEEN 1 AND 5)
);

-- Enable Row Level Security
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anonymous users to read all survey data
CREATE POLICY "Allow anonymous users to read surveys"
  ON surveys
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to insert survey data
CREATE POLICY "Allow anonymous users to insert surveys"
  ON surveys
  FOR INSERT
  TO anon
  WITH CHECK (true);