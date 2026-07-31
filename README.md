
# BookBarn Frontend

React + Vite library management app.

## Tech Stack
React 19, Vite, React Router, Axios, Bootstrap, Context API

## Quick Start
```bash
git clone <repository-url>
cd frontend
npm install
npm run dev
Structure
text
src/
├── api/          # API services
├── components/   # Reusable UI
├── context/      # Auth context
├── layouts/      # Page layouts
├── pages/        # All pages
├── App.jsx
└── main.jsx
Pages
Public: Home, Books, Book Details, Login, Register, About, Contact

Protected: Dashboard, Borrow History, Profile

Admin: Manage Books/Authors/Categories/Borrow Records/Users

Features
Authentication (JWT)

Book browsing & search

Borrow/Return books

User & Admin dashboards

Responsive design

Commands
bash
npm install          # Install deps
npm run dev          # Dev server
npm run build        # Build
npm run preview      # Preview build
Deployment
Docker, Docker Hub, or Render

License
MIT


