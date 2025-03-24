import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import './NGOProfile.js';

const Navbar = ({ user, logout, currentAccount, connectWallet }) => {
  const navigate = useNavigate();
  const isLoggedIn = user !== null;
  const goToNgoProfile = () => {
    navigate('/ngo-profile'); 
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-link">
          <h1 className="logo">DonationTrack</h1>
        </Link>
        <div className="nav-links">
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/donate" className="nav-link">Campaigns</Link>
          <Link to="/features" className="nav-link">Features</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <button className="nav-link nav-button" onClick={() => navigate('/ngo-dashboard')}>
            {isLoggedIn ? 'Dashboard' : 'NGO Portal'}
          </button>
          
          {!currentAccount ? (
            <button 
              onClick={connectWallet} 
              className="nav-link nav-button wallet-button"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="nav-link wallet-info">
              {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
            </div>
          )}
          
          {isLoggedIn && (
            <button className="nav-link nav-button logout-button" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;