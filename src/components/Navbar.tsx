// src/components/Navbar.tsx
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      {/* …other links */}
      <Link to="/clients">Clients</Link>
    </nav>
  );
}
