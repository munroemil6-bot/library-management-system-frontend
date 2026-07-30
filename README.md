# BookBarn Frontend

## Render deployment

This frontend is prepared for deployment as a Render static site.

### Render settings
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- SPA routing is handled by the rewrite rule in `render.yaml`

### Environment variable
- `VITE_API_URL=https://library-management-system-backend-91dw.onrender.com/api`

### Deployment steps
1. Push this repository to GitHub.
2. In Render, create a new Static Site connected to this repository.
3. Set the build command and publish directory as above.
4. Deploy.

---

## Overview

BookBarn Frontend is a React application that consumes the Flask REST API to provide users with an interactive library management experience.

---

# Technologies

- React
- Vite
- React Router
- Axios
- Bootstrap
- Context API

---

# Frontend Responsibilities

The frontend is responsible for

- User Interface
- Authentication Pages
- Dashboard
- Navigation
- API Communication
- Protected Routes
- Form Validation
- Responsive Design

---

# Project Structure

```
frontend/

src/

├── api/
│
├── assets/
│
├── components/
│
├── context/
│
├── hooks/
│
├── layouts/
│
├── pages/
│
├── App.jsx
│
├── main.jsx
│
└── package.json
```

---

# Pages

## Public Pages

- Home
- Books
- Book Details
- Login
- Register
- About
- Contact

---

## Protected Pages

- Dashboard
- Borrow History
- Profile

---

## Admin Pages

- Dashboard
- Manage Books
- Manage Authors
- Manage Categories
- Manage Borrow Records
- Manage Users

---

# Components

- Navbar
- Sidebar
- Footer
- Book Card
- Search Bar
- Protected Route
- Pagination
- Loading Spinner

---

# Layouts

- Main Layout
- Dashboard Layout
- Admin Layout

---

# Context

Authentication Context

Stores

- Logged in user
- Login
- Logout
- Session

---

# API

Axios configuration

Create API services for

- Authentication
- Books
- Authors
- Categories
- Borrow Records
- Users

---

# Development Phases

## Phase 1

Setup React Project

Install

```
npm install
```

Install packages

```
npm install react-router-dom
npm install axios
npm install bootstrap
```

Create folder structure.

---

## Phase 2

Authentication

Build

- Login Page
- Register Page
- Authentication Context
- Protected Routes

---

## Phase 3

Books

Build

- Books Page
- Book Details
- Search
- Filters

---

## Phase 4

Borrowing

Build

- Borrow Book
- Return Book
- Borrow History

---

## Phase 5

Dashboard

Create

- User Dashboard
- Admin Dashboard
- Statistics Cards
- Recent Activity

---

## Phase 6

API Integration

Connect frontend to backend

Authentication

Books

Authors

Categories

Borrow Records

Users

---

## Phase 7

Responsive Design

- Desktop
- Tablet
- Mobile

---

## Phase 8

Deployment

Deploy using

- Docker
- Docker Hub
- Render

---

# Installation

Clone repository

```
git clone <repository-url>
```

Install dependencies

```
npm install
```

Run development server

```
npm run dev
```

---

# Expected Outcome

A responsive, modern React application that communicates with the Flask backend to provide users with a seamless library management experience.