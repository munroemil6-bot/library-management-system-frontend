React + Vite library management application for BookBarn.

Tech Stack
React 19

Vite

React Router

Axios

Bootstrap

Context API

Quick Start
bash
# Clone and install
git clone <repository-url>
cd frontend
npm install

# Run development server
npm run dev
Project Structure
text
src/
├── api/          # Axios configuration & API services
├── components/   # Reusable UI components
├── context/      # Authentication context
├── hooks/        # Custom React hooks
├── layouts/      # Page layouts
├── pages/        # All application pages
└── App.jsx       # Main app component
Pages
Public: Home, Books, Book Details, Login, Register, About, Contact

Protected: Dashboard, Borrow History, Profile

Admin: Dashboard, Manage Books/Authors/Categories/Borrow Records/Users

Development Phases
Setup React + Vite project

Authentication (Login/Register, Protected Routes)

Books (Listing, Details, Search, Filters)

Borrowing (Borrow/Return, History)

Dashboard (User & Admin views)

API Integration

Responsive Design

Deployment

Deployment
Deploy using Docker, Docker Hub, or Render.

License
MIT

