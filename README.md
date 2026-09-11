# Sentra

Sentra is a full-stack password manager built with React, Node.js, Express, and MongoDB. The project focuses on authentication, protected routes, user-specific data, and secure credential management.

## Overview

Sentra follows a client-server architecture:

- **Frontend:** React-based interface with client-side routing and shared application state.
- **Backend:** Node.js and Express REST API for authentication and password management.
- **Database:** MongoDB for storing user accounts and vault records.
- **Authentication:** JWT-based authentication using HTTP-only cookies.
- **Password Security:** bcrypt hashing for user account passwords.

A core part of Sentra is **user-level data isolation**. Each vault record is associated with the authenticated user's MongoDB ID, ensuring users can only access, update, or delete their own saved credentials.

## Features

### Authentication
- User registration and login
- bcrypt password hashing
- JWT-based authentication
- HTTP-only authentication cookies
- Protected frontend routes
- Backend authentication middleware
- Authentication persistence across page reloads
- Logout functionality

### Password Vault
- Add saved credentials
- View saved credentials
- Edit saved credentials
- Delete saved credentials
- Show/hide password values
- User-specific vault records
- Search-ready vault interface

### Password Generator
- Random password generation during account registration
- Combination of uppercase and lowercase letters
- Numbers and special characters
- Option to use the generated password or enter a custom password

### Frontend
- React component architecture
- React Router for client-side navigation
- Shared application state
- Responsive interface
- Toast notifications
- Dark-themed UI with Tailwind CSS
- Lucide React icons

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

## Security

Sentra uses different approaches for different types of credentials:

- User account passwords are hashed using **bcrypt** and are never stored as plaintext.
- Authentication tokens are stored in **HTTP-only cookies**, preventing normal client-side JavaScript from directly accessing them.
- Backend authentication middleware verifies the JWT before allowing access to protected API routes.
- Vault records are associated with the authenticated user's unique MongoDB ID to enforce user-level access control.

### Current Limitation

Vault passwords are currently stored as plaintext in the database. Encryption of vault credentials is planned as a future security improvement.

## Project Architecture

```text
React Frontend
      │
      │ HTTP / REST API
      ▼
Node.js + Express
      │
      ├── Authentication
      │     ├── bcrypt
      │     └── JWT + HTTP-only Cookie
      │
      └── Password Management
             │
             ▼
          MongoDB