import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';
import HowItWorks from './HowItWorks'; // Import the HowItWorks component

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1>Transparent Fundraising on the Blockchain</h1>
        <p>Support causes you care about with the security and transparency of blockchain technology</p>
        <div className="hero-buttons">
          <Link to="/donate" className="primary-button">Browse Campaigns</Link>
          <Link to="/ngo-dashboard" className="secondary-button">NGO Portal</Link>
        </div>
      </div>

      <div className="features-section">
        <div className="feature">
          <h3>100% Transparent</h3>
          <p>Track every donation on the blockchain</p>
        </div>
        <div className="feature">
          <h3>Secure</h3>
          <p>Cryptographically secured transactions</p>
        </div>
        <div className="feature">
          <h3>Direct Impact</h3>
          <p>Funds go directly to verified NGOs</p>
        </div>
      </div>

      <HowItWorks />
    </div>
  );
}

export default LandingPage;