import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">Virtual Doctor</Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard">Patient Dashboard</Link>
              <Link to="/doctor-dashboard">Doctor Dashboard</Link>
              <Link to="/admin">Admin Dashboard</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/appointments">Appointments</Link>
              <Link to="/consultations">Consultations</Link>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
