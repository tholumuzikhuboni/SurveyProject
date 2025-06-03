# Lifestyle Survey Application

A modern web application for collecting and analyzing lifestyle survey data. Built with React, TypeScript, and Supabase.

## Features

- Interactive survey form with validation
- Multiple input types (text fields, checkboxes, radio buttons)
- Data storage with Supabase
- Analytics dashboard for survey results
- Responsive design

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up Supabase:
   - Create a Supabase account at https://supabase.com
   - Create a new project
   - Get your Supabase URL and anon key
   - Copy the `.env.example` file to `.env` and add your Supabase credentials
   - Run the migration in `supabase/migrations/create_surveys_table.sql` to create the database schema

4. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

- `/src/components` - React components
- `/src/lib` - Utility functions and libraries
- `/src/types` - TypeScript type definitions
- `/supabase/migrations` - SQL migration files for Supabase

## Technology Stack

- React
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- Vite