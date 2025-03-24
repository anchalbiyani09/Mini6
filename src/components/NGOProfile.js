import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import '../styles/NGOProfile.css';

const NGOProfile = ({ userEmail }) => {
  const [loading, setLoading] = useState(true);
  const [ngoData, setNgoData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (userEmail) {
      fetchNGOData(userEmail);
    }
  }, [userEmail]);

  const fetchNGOData = async (email) => {
    try {
      setLoading(true);
      const db = getFirestore();
      const ngoRef = doc(db, 'ngos', email);
      const docSnap = await getDoc(ngoRef);

      if (docSnap.exists()) {
        setNgoData(docSnap.data());
        setFormData(docSnap.data());
      } else {
        const defaultProfile = {
          name: '',
          description: '',
          mission: '',
          vision: '',
          contactEmail: email,
          phone: '',
          website: '',
          address: '',
          foundingYear: '',
          logo: '',
          causes: [],
          achievements: []
        };

        await setDoc(ngoRef, defaultProfile);
        setNgoData(defaultProfile);
        setFormData(defaultProfile);
      }
    } catch (error) {
      setMessage({ text: `Error fetching profile: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCausesChange = (e) => {
    setFormData({ ...formData, causes: e.target.value.split(',').map(c => c.trim()) });
  };

  const handleAchievementsChange = (e) => {
    setFormData({ ...formData, achievements: e.target.value.split('\n').filter(a => a.trim() !== '') });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const db = getFirestore();
      const ngoRef = doc(db, 'ngos', userEmail);

      await updateDoc(ngoRef, formData);

      setNgoData(formData);
      setIsEditing(false);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: `Error updating profile: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile data...</div>;
  }

  return (
    <div className="ngo-profile-container">
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
          <button className="close-btn" onClick={() => setMessage({ text: '', type: '' })}>×</button>
        </div>
      )}

      <div className="profile-card">
        <div className="profile-header">
          <h1>NGO Profile</h1>
          {!isEditing && (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Organization Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>About Your Organization</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" required></textarea>
            </div>

            <div className="form-group">
              <label>Mission</label>
              <input type="text" name="mission" value={formData.mission} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Vision</label>
              <input type="text" name="vision" value={formData.vision} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Contact Email</label>
              <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Website</label>
              <input type="text" name="website" value={formData.website} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Causes (comma-separated)</label>
              <input type="text" name="causes" value={formData.causes.join(', ')} onChange={handleCausesChange} />
            </div>

            <div className="form-group">
              <label>Achievements (one per line)</label>
              <textarea name="achievements" value={formData.achievements.join('\n')} onChange={handleAchievementsChange} rows="3"></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">💾 Save</button>
              <button type="button" className="cancel-btn" onClick={() => { setFormData(ngoData); setIsEditing(false); }}>
                ❌ Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-view">
            <h2>{ngoData.name || "Your Organization Name"}</h2>
            <p>{ngoData.description || "No description available"}</p>

            <h3>Mission</h3>
            <p>{ngoData.mission || "Not specified"}</p>

            <h3>Vision</h3>
            <p>{ngoData.vision || "Not specified"}</p>

            <h3>Contact Information</h3>
            <p><strong>Email:</strong> {ngoData.contactEmail}</p>
            <p><strong>Phone:</strong> {ngoData.phone || "Not provided"}</p>
            <p><strong>Website:</strong> {ngoData.website ? <a href={ngoData.website} target="_blank" rel="noopener noreferrer">{ngoData.website}</a> : "Not provided"}</p>

            <h3>Causes We Support</h3>
            {ngoData.causes.length > 0 ? (
              <ul>{ngoData.causes.map((cause, index) => <li key={index}>{cause}</li>)}</ul>
            ) : (
              <p>No causes specified</p>
            )}

            <h3>Achievements</h3>
            {ngoData.achievements.length > 0 ? (
              <ul>{ngoData.achievements.map((achievement, index) => <li key={index}>{achievement}</li>)}</ul>
            ) : (
              <p>No achievements listed yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NGOProfile;
