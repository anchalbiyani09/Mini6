import React from "react";
import { FileText, Check, ShieldCheck, TrendingUp } from "lucide-react";
import AnimatedCoin from "./AnimatedCoin";
import "../styles/HowItWorks.css";

function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: "Create Campaign",
      description: "NGOs submit detailed fundraising proposals with transparent goals",
    },
    {
      icon: ShieldCheck,
      title: "Verify NGO",
      description: "Comprehensive background checks ensure credibility and trust",
    },
    {
      icon: Check,
      title: "Donate Securely",
      description: "Instant, secure cryptocurrency transactions with full transparency",
    },
    {
      icon: TrendingUp,
      title: "Track Impact",
      description: "Real-time monitoring of fund allocation and project progress",
    },
  ];

  return (
    <div className="how-it-works">
      <h2>How It Works</h2>
      <div className="how-it-works-container">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          return (
            <div className="how-it-works-step" key={index}>
              <div className="how-it-works-step-icon">
                <StepIcon size={48} />
              </div>
              <h3 className="how-it-works-step-title">{step.title}</h3>
              <p className="how-it-works-step-description">{step.description}</p>
            </div>
          );
        })}
      </div>

      {/* Animated Coin */}
      <AnimatedCoin />
    </div>
  );
}

export default HowItWorks;
