import React from "react";
import "../styles/AnimatedCoin.css";

const AnimatedCoin = () => {
  return (
    <div className="animated-coin-container">
      <svg className="animated-coin" viewBox="0 0 50 50" width="50" height="50">
        <circle cx="25" cy="25" r="20" fill="#FFD700" />
        <text x="25" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#000">
          $
        </text>
      </svg>
    </div>
  );
};

export default AnimatedCoin;
