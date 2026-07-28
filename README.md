# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

# BookBarn Frontend

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