import React, { useState, useEffect} from "react";
import { doc, updateDoc } from "firebase/firestore";
import { BrowserProvider, Contract, parseEther, formatEther, Interface } from "ethers";
import { useNavigate } from "react-router-dom";
import Crowdfunding from "../contracts/Crowdfunding.json";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import NGOProfile from "./NGOProfile";
import "../styles/NGODashboard.css";

const CONTRACT_ADDRESS = "0x65066235E6fCffCed1ed41e5191CD85F9CfD8E4C";

function NGODashboard({ user, currentAccount }) {
  const navigate = useNavigate();
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({ name: "", description: "", goal: "", duration: "" });
  const [loading, setLoading] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);


  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (user && currentAccount) {
      fetchMyCampaigns();
      subscribeToFirebase();
    }
  }, [user, currentAccount, navigate]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewCampaign((prev) => ({ ...prev, [name]: value }));
  }

  async function createCampaign(e) {
    e.preventDefault();
    if (!window.ethereum) return alert("MetaMask is required");

    setLoading(true);
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, Crowdfunding.abi, signer);

    try {
      const txn = await contract.createCampaign(
        newCampaign.name,
        newCampaign.description,
        parseEther(newCampaign.goal),
        newCampaign.duration
      );
      await txn.wait();

      const receipt = await provider.getTransactionReceipt(txn.hash);
      const contractInterface = new Interface(Crowdfunding.abi);
      const logs = receipt.logs.map(log => {
        try {
          return contractInterface.parseLog(log);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      const event = logs.find(log => log?.name === "CampaignCreated");
      if (!event) throw new Error("Failed to retrieve campaign ID");

      const smartContractId = Number(event.args[0]);
      console.log("Extracted smartContractId:", smartContractId);

      await addDoc(collection(db, "campaigns"), {
        smartContractId,
        name: newCampaign.name,
        description: newCampaign.description,
        goal: newCampaign.goal,
        duration: newCampaign.duration,
        creator: user.email,
        raised: "0",
        verified: false,
        timestamp: new Date(),
      });

      

      alert("Campaign Created & Saved in Firebase!");
      fetchMyCampaigns();
      setNewCampaign({ name: "", description: "", goal: "", duration: "" });
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Error creating campaign: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  function subscribeToFirebase() {
    const q = query(collection(db, "campaigns"), where("creator", "==", user.email));
    return onSnapshot(q, (snapshot) => {
      const firebaseCampaigns = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        onBlockchain: false,
      }));
      mergeCampaigns(firebaseCampaigns);
    });
  }

  async function fetchMyCampaigns() {
    if (!window.ethereum || !currentAccount) return;
    setLoading(true);
    const provider = new BrowserProvider(window.ethereum);
    const contract = new Contract(CONTRACT_ADDRESS, Crowdfunding.abi, provider);

    try {
      const count = await contract.campaignCount();
      let fetchedCampaigns = [];

      for (let i = 0; i < count; i++) {
        const campaign = await contract.campaigns(i);
        if (campaign.owner.toLowerCase() === currentAccount.toLowerCase()) {
          fetchedCampaigns.push({
            id: i,
            smartContractId: i,
            name: campaign.name,
            description: campaign.description,
            goal: formatEther(campaign.goal),
            raised: formatEther(campaign.balance),
            creator: campaign.owner,
            state: ["Active", "Successful", "Failed"][campaign.state],
            proofSubmitted: campaign.proofSubmitted,
            deadline: new Date(Number(campaign.deadline) * 1000).toLocaleDateString(),
            onBlockchain: true,
          });
        }
      }
      mergeCampaigns(fetchedCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      alert("Error fetching campaigns: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  function mergeCampaigns(firebaseCampaigns) {
    setMyCampaigns((prevCampaigns) => {
      const updatedCampaigns = prevCampaigns.map((c) => {
        const matchingFirebase = firebaseCampaigns.find(fb => Number(fb.smartContractId) === Number(c.smartContractId));
        return matchingFirebase ? { ...c, ...matchingFirebase, onBlockchain: true } : c;
      });

      firebaseCampaigns.forEach(fb => {
        if (!updatedCampaigns.find(c => Number(c.smartContractId) === Number(fb.smartContractId))) {
          updatedCampaigns.push({ ...fb, onBlockchain: false });
        }
      });

      return updatedCampaigns;
    });
  }

  async function withdrawFunds(campaign) {
    if (!window.ethereum) return alert("MetaMask is required");
    if (!campaign.verified) return alert("Campaign must be verified before withdrawal.");
    if (parseFloat(campaign.raised) < parseFloat(campaign.goal)) return alert("Goal not met yet.");

    setLoading(true);
    try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(CONTRACT_ADDRESS, Crowdfunding.abi, signer);

        // 🔹 Ensure campaign ID is a valid number
        const campaignId = Number(campaign.smartContractId);
        if (isNaN(campaignId)) {
            throw new Error("Invalid campaign ID");
        }

        console.log("Withdrawing funds for campaign ID:", campaignId);
        
        const txn = await contract.withdrawFunds(campaignId);
        await txn.wait();

        alert("Funds withdrawn successfully!");

        // 🔹 Correct Firestore update
        const campaignRef = doc(db, "campaigns", campaign.id);
        await updateDoc(campaignRef, {
            raised: "0",
        });

        fetchMyCampaigns();
    } catch (error) {
        console.error("Error withdrawing funds:", error);
        alert("Withdrawal failed: " + error.message);
    } finally {
        setLoading(false);
    }
}  const toggleProfileView = () => {
    setViewProfile(!viewProfile);
  };

const checkCampaign = async () => {
  try {
    if (!window.ethereum) {
      console.error("MetaMask not found");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, Crowdfunding.abi, signer);

    const campaign = await contract.campaigns(17);
    console.log("Campaign 17 Data:", campaign);
  } catch (error) {
    console.error("Error fetching campaign:", error);
  }
};


  const totalCampaigns = myCampaigns.length;
  const totalFundsRaised = myCampaigns.reduce((sum, campaign) => sum + parseFloat(campaign.raised || 0), 0);

return (
  <div className="ngo-dashboard">
    {viewProfile && user?.email ? (
      <div className="ngo-profile-view">
        <div className="dashboard-header">
          <h1>NGO Profile</h1>
          <button onClick={toggleProfileView} className="back-btn">
            Back to Dashboard
          </button>
        </div>
        <NGOProfile userEmail={user.email} />
      </div>
    ) : (
      <>
        <h1>NGO Dashboard</h1>

        {/* 🔹 Stats Overview */}
        <div className="stats-overview">
          <div className="stat-box">
            <h3>Total Campaigns</h3>
            <p>{totalCampaigns}</p>
          </div>
          <div className="stat-box">
            <h3>Total Funds Raised</h3>
            <p>{totalFundsRaised.toFixed(2)} ETH</p>
          </div>
        </div>

        <button onClick={checkCampaign}>Check Campaign 11</button>


        {/* 🔹 Profile Button (Correct Placement) */}
        <div className="user-info">
          {user?.email && (
            <>
              <p>
                Logged in as: <strong>{user.email}</strong>
              </p>
              <button onClick={toggleProfileView} className="profile-btn">
                View/Edit Organization Profile
              </button>
            </>
          )}
        </div>

        {/* 🔹 Create Campaign Form */}
        <div className="campaign-form">
          <h2>Create a New Campaign</h2>
          <form onSubmit={createCampaign}>
            <input
              type="text"
              name="name"
              placeholder="Campaign Name"
              value={newCampaign.name}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              placeholder="Campaign Description"
              value={newCampaign.description}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="goal"
              placeholder="Goal (ETH)"
              value={newCampaign.goal}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="duration"
              placeholder="Duration (days)"
              value={newCampaign.duration}
              onChange={handleInputChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Campaign"}
            </button>
          </form>
        </div>

        {/* 🔹 Campaign List */}
        <div className="campaigns-list">
        <h2>My Campaigns</h2>
        {myCampaigns.map((campaign) => (
          <div key={campaign.id} className="campaign-card">
            <h3>{campaign.name}</h3>
            <p>{campaign.description}</p>
            <p>Goal: {campaign.goal} ETH</p>
            <p>Raised: {campaign.raised} ETH</p>
            <p>Status: {campaign.state}</p>
            {campaign.verified && parseFloat(campaign.raised) >= parseFloat(campaign.goal) && (
              <button onClick={() => withdrawFunds(campaign)} disabled={loading}>
                {loading ? "Processing..." : "Withdraw Funds"}
              </button>
            )}
          </div>
        ))}
      </div>

      </>
    )}
  </div>
);

}

export default NGODashboard;

