# ReConnect – Alumni Engagement Platform (Node.js + MongoDB SaaS)

The ReConnect platform has been transitioned to a full MERN stack (MongoDB, Express, React, Node.js) to support the multi-tenant SaaS architecture.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Auth**: JWT (JSON Web Tokens) & Bcrypt

## Features
- **Multi-Institution Support**: Independent data isolation for different colleges.
- **Admin Dashboard**: For College Admins to invite alumni and manage announcements/events.
- **Alumni Directory**: Filtered by batch, course, and company.
- **Event Registration**: Secure multi-tenant event management.

## Setup Instructions

### 1. Database & Environment
- The backend is already configured to use the provided MongoDB Atlas URI.
- Environment variables are located in `backend/.env`.

### 2. Running the Backend
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Start the server: `node server.js`
- The server will run on `http://localhost:5000`.

### 3. Running the Frontend
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite server: `npm run dev`
- The application will be accessible at `http://localhost:5173` (or `5174`).

## Security
- All sensitive data is protected on the server side via custom JWT middleware.
- Data isolation ensures users can only see records belonging to their specific institution.
