// src/components/Navbar.tsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      {/* …other links */}
      <Link to="/clients">Clients</Link>
    </nav>
  );
}
