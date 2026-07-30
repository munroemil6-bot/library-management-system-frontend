export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto py-4" style={{ background: "#1e293b", color: "#64748b" }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <span className="fw-bold" style={{ color: "#e2e8f0" }}>BookBarn</span>
            <span className="ms-2 small">&copy; {year} All rights reserved.</span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <span className="small">Library Management System</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
