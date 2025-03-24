import React, { useState, useEffect } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import "../styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    subject: "",
    message: "" 
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: "" });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send data to your backend:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      setSubmitStatus({
        success: true,
        message: "Your message has been sent! We'll get back to you shortly."
      });
      
      // Reset form after successful submission
      setFormData({ name: "", email: "", subject: "", message: "" });
      
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "Failed to send message. Please try again later."
      });
    } finally {
      setIsSubmitting(false);
      
      // Clear status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ success: false, message: "" });
      }, 5000);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h2>Get In Touch</h2>
        <p>Have questions about our platform or interested in collaboration? Reach out to our team.</p>
      </div>
      
      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-card">
            <div className="contact-icon"><FaEnvelope /></div>
            <h3>Email Us</h3>
            <p>support@donationtrack.com</p>
            <p>partners@donationtrack.com</p>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon"><FaPhone /></div>
            <h3>Call Us</h3>
            <p>+1 (555) 123-4567</p>
            <p>Mon-Fri, 9am-5pm EST</p>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon"><FaMapMarkerAlt /></div>
            <h3>Visit Us</h3>
            <p>Vcet</p>
            <p>Innovation Hub, Building 4</p>
            <p>University Campus</p>
          </div>
        </div>
        
        <div className="contact-form-container">
          <h3>Send a Message</h3>
          
          {submitStatus.message && (
            <div className={`status-message ${submitStatus.success ? 'success' : 'error'}`}>
              {submitStatus.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "error" : ""}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject (Optional)</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className={errors.message ? "error" : ""}
              />
              {errors.message && <div className="error-message">{errors.message}</div>}
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <FaPaperPlane /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;