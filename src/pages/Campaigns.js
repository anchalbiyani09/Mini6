import React from "react";
import "../styles/Campaigns.css";

const Campaigns = () => {
  const campaigns = [
    { id: 1, title: "Food for All", description: "Providing meals for the homeless." },
    { id: 2, title: "Education First", description: "Helping children get quality education." },
    { id: 3, title: "Medical Aid", description: "Providing healthcare for those in need." },
  ];

  return (
    <div className="campaigns-container">
      <h2>Active Campaigns</h2>
      <div className="campaigns-list">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="campaign-card">
            <h3>{campaign.title}</h3>
            <p>{campaign.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;