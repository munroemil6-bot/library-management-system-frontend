# BookBarn Frontend

BookBarn is a modern, responsive web application developed as the frontend of a Smart Library Management System. The application provides an intuitive interface for students, librarians and administrators to interact with the BookBarn backend through RESTful APIs.

The frontend was built using **React** and **Vite**, allowing for a fast, component-based and scalable application. It communicates with the Flask backend using Axios and provides a seamless user experience for managing books, users and borrowing records.

The project was developed collaboratively by a team of four software engineering students, with each member responsible for a specific module of the application while maintaining a consistent architecture throughout the project.

---

# Project Overview

BookBarn aims to modernize traditional library operations by replacing manual processes with a digital platform that is efficient, secure and easy to use.

The application allows users to:

- Register for a library account
- Log into their account securely
- Browse available books
- Search books by different criteria
- Borrow available books
- Return borrowed books
- View borrowing history

Administrators can:

- Manage books
- Manage authors
- Manage categories
- Manage registered users
- Monitor borrowing activities

The frontend consumes the backend REST API and dynamically updates information without requiring manual page refreshes.

---

# Problem Statement

Many small libraries continue to rely on manual record keeping or outdated management systems that are difficult to maintain and inefficient for both staff and users.

Common challenges include:

- Difficulty tracking borrowed books
- Slow borrowing and return processes
- Poor organization of book records
- Limited accessibility
- Time-consuming administrative tasks
- Increased risk of losing important records

BookBarn provides a modern web-based solution that simplifies these operations while improving accessibility, efficiency and user experience.

---

# Project Objectives

The frontend was developed with the following objectives:

## General Objectives

- Build a modern user interface using React
- Consume RESTful APIs from the Flask backend
- Create reusable React components
- Implement responsive layouts
- Improve user experience
- Maintain clean and organized code

## Technical Objectives

- Learn component-based development
- Practice React Router navigation
- Consume APIs using Axios
- Handle authentication
- Build reusable layouts
- Collaborate using Git and GitHub
- Deploy a production-ready frontend

---

# Features

BookBarn currently supports the following features.

## Authentication

- User Registration
- Secure Login
- Logout
- Protected Routes
- Session Management

---

## Library Management

- Browse Books
- View Authors
- View Categories
- Search Library Resources
- Book Details

---

## Borrowing System

- Borrow Books
- Return Books
- View Borrowing History
- Track Borrow Status

---

## Administration

- Dashboard
- Book Management
- Author Management
- Category Management
- User Management

---

# Technologies Used

The frontend was developed using modern web development technologies.

## Frontend Framework

- React

React was chosen because it promotes reusable components, faster development and easier maintenance.

---

## Build Tool

- Vite

Vite provides faster development, instant hot reloads and optimized production builds.

---

## Routing

- React Router DOM

Used to create navigation between pages while maintaining a single-page application experience.

---

## HTTP Client

- Axios

Axios is responsible for communicating with the Flask backend REST API.

All API requests are centralized to make maintenance easier.

---

## Styling

- Bootstrap
- Custom CSS

Bootstrap provides responsive layouts while custom CSS allows additional styling and branding.

---

## Version Control

- Git
- GitHub

Used for collaborative development and version management.

---

## Deployment

Frontend Deployment

- Vercel

Backend Deployment

- Flask API deployed separately

---

# Frontend Folder Structure

```

src/
│
├── api/
│ └── axios.js
│
├── assets/
│ ├── images/
│ ├── icons/
│ └── styles/
│
├── components/
│ ├── Navbar.jsx
│ ├── Footer.jsx
│ ├── Sidebar.jsx
│ ├── BookCard.jsx
│ ├── SearchBar.jsx
│ ├── ProtectedRoute.jsx
│ └── Loader.jsx
│
├── context/
│ └── AuthContext.jsx
│
├── hooks/
│ └── useAuth.js
│
├── layouts/
│ ├── MainLayout.jsx
│ └── DashboardLayout.jsx
│
├── pages/
│ │
│ ├── authentication/
│ │ ├── Login.jsx
│ │ └── Register.jsx
│ │
│ ├── dashboard/
│ │ └── Dashboard.jsx
│ │
│ ├── books/
│ │ ├── Books.jsx
│ │ ├── Authors.jsx
│ │ └── Categories.jsx
│ │
│ ├── borrowing/
│ │ ├── BorrowBooks.jsx
│ │ ├── ReturnBooks.jsx
│ │ └── BorrowHistory.jsx
│ │
│ ├── admin/
│ │ ├── ManageBooks.jsx
│ │ ├── ManageAuthors.jsx
│ │ ├── ManageCategories.jsx
│ │ └── ManageUsers.jsx
│ │
│ ├── Home.jsx
│ ├── About.jsx
│ ├── Contact.jsx
│ └── NotFound.jsx
│
├── App.jsx
├── main.jsx
└── index.css

```

---

# Folder Responsibilities

### api/

Contains the Axios configuration used throughout the application to communicate with the deployed backend.

---

### assets/

Stores images, icons, logos and additional styling resources used throughout the application.

---

### components/

Contains reusable React components shared across multiple pages.

Examples include:

- Navigation Bar
- Footer
- Sidebar
- Cards
- Buttons
- Search Bars
- Loaders

---

### layouts/

Provides reusable page layouts that ensure consistency across the application.

Examples include:

- Public Layout
- Dashboard Layout

---

### pages/

Contains the main application pages grouped according to their functionality.

Each folder represents one major feature of the application.

---

### context/

Stores React Context providers used for global application state such as authentication.

---

### hooks/

Contains reusable custom React hooks that simplify application logic and improve code reusability.

---

# Frontend Design Principles

The BookBarn frontend was designed following several software engineering principles.

These include:

- Reusable Components
- Separation of Concerns
- Clean Folder Organization
- Responsive Design
- Maintainable Code
- Consistent User Experience
- RESTful API Integration
- Scalability for Future Development

Every page and component was designed to be independent while working together as part of a complete application.

# Team Responsibilities

BookBarn was developed collaboratively by a team of four members. Each member was assigned a specific module of the frontend to encourage teamwork while allowing everyone to contribute meaningfully to the project.

The project manager was responsible for planning the architecture, organizing the project structure, coordinating development, integrating each member's work, testing the application and managing deployment.

---

## Myles Munroe
*Project Manager & Frontend Lead*

Responsibilities included:

- Planned the overall frontend architecture.
- Designed and organized the project folder structure.
- Created reusable layouts.
- Configured React Router navigation.
- Configured Axios for backend communication.
- Integrated all team members' work into a single application.
- Fixed merge conflicts.
- Tested frontend functionality.
- Connected the frontend to the deployed Flask backend.
- Managed deployment to Vercel.
- Reviewed pull requests and coordinated GitHub collaboration.

---
---
## Myles Munroe
*Project Manager & Frontend Lead*

Responsibilities included:

- Planned the overall frontend architecture.
- Designed and organized the project folder structure.
- Created reusable layouts.
- Configured React Router navigation.
- Configured Axios for backend communication.
- Integrated all team members' work into a single application.
- Fixed merge conflicts.
- Tested frontend functionality.
- Connected the frontend to the deployed Flask backend.
- Managed deployment to Vercel.
- Reviewed pull requests and coordinated GitHub collaboration.

---

## Mason
*Authentication Module*

Responsibilities included:

User Registration page.
- User Login page.
- Authentication forms.
- Dashboard after successful login.
- Protected route implementation.
- Authentication API integration.


---

## Naomi
*Library Management Module*

Responsibilities included:

- Books pages.
- Authors pages.
- Categories pages.
- Search functionality.
- Displaying library resources.
- CRUD interface for library resources.

---

## Nassra
*Borrowing Module*

Responsibilities included:

- Borrow books page.
- Return books page.
- Borrow history page.
- Borrowing workflow.
- Borrow record API integration.
- Display of borrowed books and return status.

---