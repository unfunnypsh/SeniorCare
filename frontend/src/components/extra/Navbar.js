import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Logo from "./logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src={Logo}
            alt="SeniorCare Logo"
            className="logo"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNavDropdown"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNavDropdown">
          <ul className="navbar-nav">
            {['Home', 'Services', 'About', 'Reviews'].map((item) => (
              <li className="nav-item" key={item}>
                <a className="nav-link" href={`/#${item.toLowerCase()}`}>
                  {item}
                </a>
              </li>
            ))}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Login
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/senior-dashboard">
                    Senior
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/caregiver-dashboard">
                    Caregiver
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/login">
                    Admin
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
