# Scalable REST API with Authentication & Role-Based Access Control

A full-stack application featuring a secure REST API built with Node.js, Express, and MongoDB, with a React frontend for testing.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Role-Based Access Control](#role-based-access-control)
- [Scalability Considerations](#scalability-considerations)

## Features

- User registration and login with JWT authentication
- Password hashing using bcrypt
- Role-based access control (User and Admin roles)
- CRUD operations for Tasks with ownership validation
- Admin-only user management endpoints
- Input validation using Joi
- Centralized error handling
- Winston logging with file and console transports
- Swagger API documentation
- React frontend for API testing

## Tech Stack

**Backend:**
- Node.js
- Express.js 5.x
- MongoDB with Mongoose 9.x
- JSON Web Tokens (JWT)
- bcryptjs
- Joi (validation)
- Winston (logging)
- Swagger UI

**Frontend:**
- React 18
- Vite
- React Router DOM
- Axios
- React Hot Toast

## Project Structure

```
primetrade_task/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── task.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── task.routes.js
│   │   │   └── user.routes.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   └── responses.js
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   └── task.validator.js
│   │   └── app.js
│   ├── docs/
│   │   └── swagger.yaml
│   ├── logs/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## API Documentation

Swagger documentation is available at:
```
http://localhost:5000/api-docs
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/v1/auth/register | Register a new user | Public |
| POST | /api/v1/auth/login | Login user | Public |
| GET | /api/v1/auth/me | Get current user | Private |

### Tasks

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/v1/tasks | Get all tasks (own tasks) | Private |
| GET | /api/v1/tasks/:id | Get single task | Private |
| POST | /api/v1/tasks | Create a task | Private |
| PUT | /api/v1/tasks/:id | Update a task | Private |
| DELETE | /api/v1/tasks/:id | Delete a task | Private |

### Users (Admin Only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/v1/users | Get all users | Admin |
| GET | /api/v1/users/:id | Get single user | Admin |
| PUT | /api/v1/users/:id | Update user | Admin |
| DELETE | /api/v1/users/:id | Delete user | Admin |

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Request Header Format
```
Authorization: Bearer <token>
```

### Token Generation
Tokens are generated upon successful login or registration and expire after 7 days (configurable).

## Role-Based Access Control

The system supports two roles:

1. **User** (default)
   - Can register and login
   - Can create, read, update, and delete their own tasks
   - Cannot access other users' tasks

2. **Admin**
   - All user permissions
   - Can view all users
   - Can update user roles
   - Can delete users

## Scalability Considerations

### Database Optimization
- Add indexes on frequently queried fields (email, user references)
- Implement pagination for list endpoints
- Use MongoDB aggregation pipeline for complex queries

### Caching
- Implement Redis caching for frequently accessed data
- Cache user sessions to reduce database lookups

### Horizontal Scaling
- Design stateless services for easy container orchestration
- Use load balancers (nginx, HAProxy) for traffic distribution
- Deploy with Docker and Kubernetes for auto-scaling

### Performance
- Implement rate limiting to prevent abuse
- Use compression middleware for response payloads
- Add request queuing for heavy operations (Bull, RabbitMQ)

### Monitoring
- Set up centralized logging (ELK Stack, CloudWatch)
- Add health check endpoints
- Implement APM tools (New Relic, DataDog)

## License

This project is created for the PrimeTrade Backend Developer Intern assignment.
