export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-auto py-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <span className="fw-bold">BookBarn</span>
            <span className="text-white-50 ms-2 small">
              &copy; {year} All rights reserved.
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <span className="text-white-50 small">
              Library Management System
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
