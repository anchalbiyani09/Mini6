import React from "react";
import { FaHandHoldingHeart, FaChartLine, FaShieldAlt } from "react-icons/fa";
import "../styles/About.css";

const About = () => {
  const coreValues = [
    {
      icon: <FaHandHoldingHeart size={24} />,
      title: "Impact-Driven",
      description: "Every donation is carefully tracked to maximize real-world impact on communities in need."
    },
    {
      icon: <FaChartLine size={24} />,
      title: "Data-Focused",
      description: "We leverage analytics to ensure optimal allocation of resources across projects."
    },
    {
      icon: <FaShieldAlt size={24} />,
      title: "Secure & Transparent",
      description: "State-of-the-art encryption and blockchain verification maintain donation integrity."
    }
  ];

  return (
    <div className="about-container">
      <div className="about-header">
        <h2>About DonationTrack</h2>
        <div className="about-subtitle">Revolutionizing Charitable Giving Through Technology</div>
      </div>
      
      <div className="about-mission">
        <h3>Our Mission</h3>
        <p>
          DonationTrack is an innovative platform built to bridge the gap between donors and NGOs 
          using modern web technologies. By implementing secure tracking systems and transparent 
          reporting mechanisms, we're creating a new standard for accountability in the 
          charitable sector.
        </p>
        <p>
          Founded in 2023 by computer science students, our platform combines React frontend 
          architecture with a robust Node.js backend and MongoDB database to deliver a 
          seamless experience for both donors and organizations.
        </p>
      </div>

      <div className="vision-section">
        <h3>Our Vision</h3>
        <blockquote>
          "To create a world where every donation reaches its intended destination, 
          verified through technology and transparent to all stakeholders."
        </blockquote>
      </div>

      <div className="core-values">
        <h3>Core Values</h3>
        <div className="values-grid">
          {coreValues.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">{value.icon}</div>
              <h4>{value.title}</h4>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      
    </div>
  );
};

export default About;