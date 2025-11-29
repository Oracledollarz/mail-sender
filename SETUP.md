# Quick Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Backend Setup

1. **Navigate to api folder:**

   ```bash
   cd api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create .env file:**
   Create a `.env` file in the `api` folder with:

   ```
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server:**

   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

## Frontend Setup

1. **Navigate to frontend folder:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create .env file:**
   Create a `.env` file in the `frontend` folder with:

   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Fill in SMTP configuration (e.g., Gmail SMTP settings)
3. Test the connection
4. Compose your email
5. Add recipients (comma-separated or upload Excel file)
6. Click "Send Emails" and watch the real-time progress

## Gmail SMTP Settings

If using Gmail:

- Host: `smtp.gmail.com`
- Port: `587` (TLS) or `465` (SSL)
- Secure: Check for SSL, uncheck for TLS
- User: Your Gmail address
- Password: Use an "App Password" (not your regular password)

To generate an App Password:

1. Go to Google Account settings
2. Security → 2-Step Verification
3. App passwords → Generate
