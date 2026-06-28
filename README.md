# 📚 Library Management System

## Overview

The Library Management System is a RESTful backend application built using Node.js, Express.js, and MongoDB. It supports secure authentication, role-based authorization, book management, member management, and book borrowing/return functionality.

There are two user roles:

* **Librarian**

  * Manage books
  * Manage members

* **Member**

  * Register and login
  * View books
  * Borrow books
  * Return books
  * View borrowed books

---

# Tech Stack

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcrypt
* express-validator
* dotenv
* Postman
* Render

---

# Features

## Authentication

* Member Registration
* User Login
* JWT Authentication
* Password Hashing using bcrypt

## Role-Based Authorization

### Librarian

* Add Book
* Update Book
* Delete Book
* View Members
* Delete Members

### Member

* View Books
* Borrow Book
* Return Book
* View Borrowed Books

---

# Project Structure

```
library-management-system/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── bookController.js
│   └── memberController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── errorMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Book.js
│   └── Borrow.js
│
├── routes/
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   └── memberRoutes.js
│
├── validators/
│   └── validationRules.js
│
├── utils/
│   └── generateToken.js
│
├── .env
├── server.js
├── package.json
└── README.md
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/sai-supraja48/library-managemnet-system-project.git
```

Move into the project folder

```bash
cd library-management-system
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
```

Run the project

```bash
npm run dev
```

Server runs at

```
http://localhost:5000
```

---

# Database

MongoDB Atlas

Collections

* Users
* Books
* Borrows

---

# API Endpoints

## Authentication

### Register

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

---

## Books

### Add Book (Librarian)

```
POST /api/books
```

### Get All Books

```
GET /api/books
```

### Get Book By ID

```
GET /api/books/:id
```

### Update Book

```
PUT /api/books/:id
```

### Delete Book

```
DELETE /api/books/:id
```

### Borrow Book

```
POST /api/books/:id/borrow
```

### Return Book

```
POST /api/books/:id/return
```

---

## Members

### Get Members

```
GET /api/members
```

### Delete Member

```
DELETE /api/members/:id
```

### My Borrowed Books

```
GET /api/members/me/books
```

---

# Authentication

Protected APIs require JWT.

Authorization Header

```
Authorization: Bearer <JWT_TOKEN>
```

---

# Validation

* Email validation
* Password minimum 6 characters
* Required fields validation
* Duplicate email validation
* Duplicate ISBN validation
* Quantity validation

---

# Error Handling

Returns meaningful HTTP status codes and JSON responses.

Example

```json
{
  "success": false,
  "message": "Book not found"
}
```

---

# Bonus Features

* Pagination
* Search Books
* Category Filter

---

# API Testing

All APIs were tested using Postman.

---

# Deployment

**GitHub Repository**

https://github.com/sai-supraja48/library-managemnet-system-project.git

**Live API**

Add your Render deployment URL here.

---

# Author

**Sai Supraja Annam**
