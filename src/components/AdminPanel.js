import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import "../styles/AdminPanel.css";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { ethers } from "ethers";
import CrowdfundingABI from "../contracts/Crowdfunding.json";


// ✅ Smart Contract Address (Update if needed)
const CONTRACT_ADDRESS = "0x65066235E6fCffCed1ed41e5191CD85F9CfD8E4C";

const AdminPanel = () => {
  const [ngos, setNgos] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNGOs();
    fetchCampaigns();
  }, []);

  // ✅ Fetch All NGOs
  const fetchNGOs = async () => {
    const ngosCollection = collection(db, "ngos");
    const ngosSnapshot = await getDocs(ngosCollection);
    setNgos(ngosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // ✅ Fetch All Campaigns
  const fetchCampaigns = async () => {
    const campaignsCollection = collection(db, "campaigns");
    const campaignsSnapshot = await getDocs(campaignsCollection);
    setCampaigns(
      campaignsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  // ✅ Discard an NGO
  const discardNGO = async (ngoId) => {
    await deleteDoc(doc(db, "ngos", ngoId));
    setNgos(ngos.filter((ngo) => ngo.id !== ngoId));
    alert("NGO discarded successfully");
  };

  // ✅ Discard a Campaign
  const discardCampaign = async (campaignId) => {
    await deleteDoc(doc(db, "campaigns", campaignId));
    setCampaigns(campaigns.filter((campaign) => campaign.id !== campaignId));
    alert("Campaign discarded successfully");
  };

  // ✅ Verify Campaign (Fixed Version)
  const verifyCampaign = async (campaignId) => {
    try {
      setLoading(true);
      console.log("Verifying campaign with ID:", campaignId);

      // 🔹 Fetch campaign from Firebase
      const campaignRef = doc(db, "campaigns", campaignId);
      const campaignSnap = await getDoc(campaignRef);

      if (!campaignSnap.exists()) throw new Error("Campaign not found!");

      const campaignData = campaignSnap.data();
      const smartContractId = campaignData.smartContractId;

      if (!smartContractId) {
        throw new Error("No smart contract ID found for this campaign!");
      }

      console.log("Verifying campaign with numeric ID:", smartContractId);

      // 🔹 Connect to MetaMask
      if (!window.ethereum) throw new Error("MetaMask not detected!");

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("Connected to MetaMask with signer:", signer.address);

      // 🔹 Connect to the smart contract
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CrowdfundingABI.abi,
        signer
      );

      // ✅ Step 1: Update Firebase first
      await updateDoc(campaignRef, { verified: true });
      console.log("Updated campaign as verified in Firebase");

      // ✅ Step 2: Call smart contract verification
      console.log("Submitting verification to blockchain...");
      const tx = await contract.submitCompletionProof(Number(smartContractId));
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Blockchain verification successful!");

      // ✅ Step 3: Update UI
      setCampaigns(
        campaigns.map((campaign) =>
          campaign.id === campaignId ? { ...campaign, verified: true } : campaign
        )
      );

      alert("Campaign verified successfully! Funds can now be withdrawn.");
    } catch (error) {
      console.error("Verification Error:", error);
      alert("Verification failed: " + error.message);

      // 🔹 Rollback Firebase verification if failed
      try {
        const campaignRef = doc(db, "campaigns", campaignId);
        await updateDoc(campaignRef, { verified: false });
      } catch (rollbackError) {
        console.error("Failed to rollback verification:", rollbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>

      {/* NGO Management */}
      <h3>Registered NGOs</h3>
      <ul>
        {ngos.map((ngo) => (
          <li key={ngo.id}>
            {ngo.name} ({ngo.email})
            <button onClick={() => discardNGO(ngo.id)}>Discard</button>
          </li>
        ))}
      </ul>

      {/* Campaign Management */}
      <h3>All Campaigns</h3>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            <strong>{campaign.name}</strong> by {campaign.creator}
            <br />
            Goal: {campaign.goal} ETH | Raised: {campaign.balance || 0} ETH
            <br />
            {campaign.smartContractId && (
              <small>Smart Contract ID: {campaign.smartContractId}</small>
            )}
            <br />
            {campaign.verified ? (
              <span>✅ Verified</span>
            ) : (
              <>
                <button
                  onClick={() => verifyCampaign(campaign.id)}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify Campaign"}
                </button>
                <button onClick={() => discardCampaign(campaign.id)}>
                  Discard
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
