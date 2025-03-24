import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import CrowdfundingABI from "../contracts/Crowdfunding.json";

const CONTRACT_ADDRESS = "0x65066235E6fCffCed1ed41e5191CD85F9CfD8E4C";

function DonationPage({ currentAccount }) {
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [donationAmounts, setDonationAmounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    if (currentAccount) {
      fetchAllCampaigns();
    }
  }, [currentAccount]);

  async function fetchAllCampaigns() {
    if (!window.ethereum) return;
    setLoading(true);

    const provider = new BrowserProvider(window.ethereum);
    const contract = new Contract(CONTRACT_ADDRESS, CrowdfundingABI.abi, provider);

    try {
      const count = await contract.campaignCount();
      let fetchedCampaigns = [];

      for (let i = 0; i < count; i++) {
        const campaign = await contract.campaigns(i);
        fetchedCampaigns.push({
          id: i,
          name: campaign.name,
          description: campaign.description,
          goal: parseFloat(formatEther(campaign.goal)), // Convert to number for comparison
          raised: parseFloat(formatEther(campaign.balance)), // Convert to number for comparison
          creator: campaign.owner,
        });
      }

      setAllCampaigns(fetchedCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  }

  async function donateToCampaign(campaignId) {
    if (!currentAccount) return alert("Connect MetaMask first!");
    const donationAmount = parseFloat(donationAmounts[campaignId]);

    if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
      return alert("Enter a valid donation amount.");
    }

    const campaign = allCampaigns.find((c) => c.id === campaignId);

    if (!campaign) {
      return alert("Campaign not found!");
    }

    // Check if the goal has already been reached
    if (campaign.raised >= campaign.goal) {
      return alert("This campaign has already reached its goal!");
    }

    // Check if the new donation would exceed the goal
    if (campaign.raised + donationAmount > campaign.goal) {
      return alert(`The required amount is already fulfilled! You can only donate up to ${campaign.goal - campaign.raised} ETH.`);
    }

    setDonating(true);
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, CrowdfundingABI.abi, signer);

    try {
      const txn = await contract.contribute(campaignId, {
        value: parseEther(donationAmount.toString()),
      });
      await txn.wait();
      
      alert(`Successfully donated ${donationAmount} ETH!`);
      
      // ✅ Update state immediately so UI updates faster
      setAllCampaigns(prevCampaigns =>
        prevCampaigns.map(c =>
          c.id === campaignId
            ? { ...c, raised: c.raised + donationAmount }
            : c
        )
      );

      // ✅ Fetch fresh data to ensure accuracy
      await fetchAllCampaigns();

      // Reset donation input field
      setDonationAmounts(prev => ({
        ...prev,
        [campaignId]: ""
      }));
    } catch (error) {
      console.error("Error donating:", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setDonating(false);
    }
  }

  return (
    <div className="donation-page">
      <h1>Support a Cause</h1>
      {!currentAccount && (
        <div className="wallet-warning">
          <p>Please connect your wallet to donate to campaigns.</p>
        </div>
      )}
      
      {loading ? (
        <p>Loading campaigns...</p>
      ) : (
        <div className="campaigns-grid">
          {allCampaigns.map((campaign) => (
            <div key={campaign.id} className="campaign-card">
              <h3>{campaign.name}</h3>
              <p className="campaign-description">{campaign.description}</p>
              <p className="campaign-stats">
                Goal: {campaign.goal} ETH | Raised: {campaign.raised} ETH
              </p>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="donation-form">
                <input 
                  type="number" 
                  placeholder="Amount to donate (ETH)"
                  value={donationAmounts[campaign.id] || ""}
                  onChange={(e) => setDonationAmounts({ 
                    ...donationAmounts, 
                    [campaign.id]: e.target.value 
                  })} 
                />
                <button 
                  onClick={() => donateToCampaign(campaign.id)}
                  disabled={donating || !currentAccount || campaign.raised >= campaign.goal}
                >
                  {campaign.raised >= campaign.goal ? "Goal Reached" : donating ? "Processing..." : "Donate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DonationPage;
