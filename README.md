# Sentra

Sentra is a full-stack password manager built to explore authentication, protected routes, user-specific data, and CRUD operations in a modern web application.

The application allows users to create an account, authenticate securely, and manage their saved credentials through a personal vault.

## Overview

Sentra follows a client-server architecture:

- The frontend is built with React and handles the UI, routing, authentication state, and user interactions.
- The backend is built with Node.js and Express and exposes REST APIs for authentication and password management.
- MongoDB is used for persistent data storage.
- JWTs are used to maintain authenticated sessions.
- bcrypt is used to hash user login passwords.

A core design goal of the project is **user-level data isolation**. Password records are associated with the authenticated user's unique MongoDB ID, ensuring CRUD operations are performed only on that user's records.

## Features

### Authentication
- User registration and login
- Password hashing with bcrypt
- JWT-based authentication using HTTP cookies
- Authentication persistence across page reloads
- Protected frontend routes
- Logout functionality

### Password Management
- Add saved credentials
- View saved credentials
- Edit existing credentials
- Delete credentials
- Show/hide password values
- User-specific password records

### Frontend
- React-based component architecture
- Client-side routing with React Router
- Shared authentication state
- Responsive UI
- Toast notifications for user feedback

## Tech Stack

**Frontend**
- React
- React Router
- Tailwind CSS
- Lucide React
- React Hot Toast

**Backend**
- Node.js
- Express.js
- MongoDB
- bcrypt
- JSON Web Token
- Cookie Parser
- CORS

## Security Note

User login passwords are hashed using bcrypt, and authentication is handled using JWTs stored in HTTP cookies.

Currently, saved vault passwords are **not encrypted at rest**. This is a known limitation of the current version and is planned for a future iteration.

## Project Status

Sentra is an actively developed full-stack project focused on authentication, authorization, REST APIs, database operations, protected routes, and user-specific CRUD functionality.
