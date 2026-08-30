// src/components/Navbar.jsx
import React, { useState } from 'react';
import { supabase } from '../config/supabase';

const Navbar = ({ currentPage, navigateTo, session }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleNavigation = (page) => {
    navigateTo(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => handleNavigation('dashboard')}>
          <img src="/pcg-logo.png" alt="PCG Logo" className="nav-logo" />
          <h1>PCG Hymn Admin</h1>
        </div>

        {/* Mobile Ellipsis Button */}
        <button
          className="menu-ellipsis"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          &#8942;
        </button>

        <div className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
          <button
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => handleNavigation('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={currentPage === 'hymns' ? 'active' : ''}
            onClick={() => handleNavigation('hymns')}
          >
            Hymns
          </button>
          <button
            className={currentPage === 'categories' ? 'active' : ''}
            onClick={() => handleNavigation('categories')}
          >
            Categories
          </button>
          <div className="nav-divider"></div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout <span className="user-email">({session?.user?.email})</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;