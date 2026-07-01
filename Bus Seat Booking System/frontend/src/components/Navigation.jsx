import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBus, FaUser, FaSignOutAlt, FaHome, FaRoute, FaTicketAlt, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Navigation.css';

export default function Navigation() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <FaBus className="brand-icon" />
          <Link to="/home" className="brand-text">
            Bus<span>Booking</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Navigation */}
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link 
                to="/home" 
                className={`nav-link ${isActive('/home') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaHome className="nav-icon" />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/routes" 
                className={`nav-link ${isActive('/routes') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaRoute className="nav-icon" />
                <span>Routes</span>
              </Link>
              
              <Link 
                to="/my-bookings" 
                className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaTicketAlt className="nav-icon" />
                <span>My Bookings</span>
              </Link>

              {user.role === 'ADMIN' && (
                <Link 
                  to="/admin" 
                  className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaCog className="nav-icon" />
                  <span>Admin</span>
                </Link>
              )}

              <div className="user-dropdown">
                <div className="user-info">
                  <FaUser className="user-icon" />
                  <span className="username">{user.username}</span>
                </div>
                <div className="dropdown-content">
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaUser className="dropdown-icon" />
                    Profile
                  </Link>
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="dropdown-icon" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="nav-link register-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}