# Recipe MERN Backend

# Overview
This repository contains the backend code for the Recipe MERN application. The backend is built using Node.js, Express.js, and MongoDB. It provides RESTful API endpoints for managing recipes, user authentication, and other related functionalities.
### You're probably gonna have to adapt your models and make new routes/routers 😺

# Features
User Authentication: Secure user registration and login using JWT.

Recipe Management: CRUD operations for recipes.

User Management: CRUD operations for user profiles.

Search Functionality: Search recipes by various criteria.

Middleware: Authentication and authorization middleware.

Error Handling: Centralized error handling mechanism.

# Tech Stack
Node.js: JavaScript runtime for building server-side applications.

Express.js: Web framework for Node.js.

MongoDB: NoSQL database for storing application data.

Mongoose: ODM for MongoDB.

JWT: JSON Web Tokens for secure authentication.

# Installation
# Prerequisites
Node.js

MongoDB

# Steps
# Clone the repository:

bash

git clone https://github.com/Sivva2/Recipe-MERN-backend.git
cd Recipe-MERN-backend/

# Install dependencies:
> Remember to install the dependencies if you need to with `npm i`

 bash
 
npm install

Set up environment variables: Create a .env file in the root directory 


# Run the application:

You can run the project using
```
npm run dev
```
bash
npm start
API Endpoints
Authentication
POST /api/auth/register: Register a new user.

POST /api/auth/login: Login a user.

# Recipes
GET /api/recipes: Get all recipes.

GET /api/recipes/:id: Get a single recipe by ID.

POST /api/recipes: Create a new recipe.

PUT /api/recipes/:id: Update a recipe by ID.

DELETE /api/recipes/:id: Delete a recipe by ID.

# Users
GET /api/users: Get all users.

GET /api/users/:id: Get a single user by ID.

PUT /api/users/:id: Update a user by ID.

DELETE /api/users/:id: Delete a user by ID.

# Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

# License
This project is licensed under the MIT License.

# Contact
For any questions or support, please contact sivva2@sivva2.dev XD 
