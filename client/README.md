# Client Tracker Application

A comprehensive client tracking application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Company Management**
  - Create, view, edit, and delete companies
  - Track company details including name, contact info, industry, etc.
  - View all clients associated with a company

- **Customer Management**
  - Create, view, edit, and delete customers for each company
  - Track customer status, value, and contact information
  - Add detailed notes for each customer

- **Dashboard**
  - View key metrics and statistics
  - See top companies by value
  - Monitor customer status distribution
  - Track recent activity

- **User Authentication**
  - Secure login and registration
  - JWT-based authentication
  - Protected routes for authenticated users

- **Mobile Responsive Design**
  - Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

### Frontend
- React with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- Context API for state management
- Lucide React for icons
- React Toastify for notifications
- Date-fns for date formatting

### Backend
- Node.js with Express
- MongoDB with Mongoose for data storage
- JWT for authentication
- Express Validator for input validation
- bcryptjs for password hashing
- Morgan for request logging

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)

### Backend Setup
1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/client-tracker
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the Vite development server:
   ```
   npm run dev
   ```

4. The application will be available at `http://localhost:5173`

## Deployment

### Backend
1. Set `NODE_ENV=production` in your `.env` file
2. Build the frontend:
   ```
   cd client
   npm run build
   ```
3. Start the server in production mode:
   ```
   cd ../server
   npm start
   ```

### Docker Deployment (Optional)
A Dockerfile and docker-compose.yml are provided for containerized deployment.

To start the application using Docker:
```
docker-compose up -d
```

## License
MIT

## Author
[Fahad Hossain]