import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">DonationTrack</h3>
          <p className="footer-description">Blockchain-powered donation tracking for complete transparency.</p>
        </div>
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links-list">
            <li><a href="#" className="footer-link">Home</a></li>
            <li><a href="#" className="footer-link">About</a></li>
            <li><a href="#" className="footer-link">Campaigns</a></li>
            <li><a href="#" className="footer-link">NGO Portal</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="copyright">© 2025 DonationTrack. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;