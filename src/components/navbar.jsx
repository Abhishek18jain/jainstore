import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; // Assuming React Router is used
import '../css/Navbar.css'; // Assuming you have a CSS file for styling

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="brand-container">
        <NavLink to="/" className="brand-name">JainStore</NavLink>
        <span className="tagline">All Your Needs in One Place</span>
      </div>

      <button
        className={menuOpen? "menu-toggle open" : "menu-toggle"}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-controls="nav-links-list"
        aria-expanded={menuOpen}
        aria-label={menuOpen? "Close navigation menu" : "Open navigation menu"}
      >
        <span className="hamburger-bar"></span>
      </button>

      <ul
        id="nav-links-list"
        className={menuOpen? "nav-links open" : "nav-links"}
      >
        <li><NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink></li>
        <li><NavLink to="/inventory" onClick={() => setMenuOpen(false)}>Inventory</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;