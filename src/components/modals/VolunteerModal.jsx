'use client';
import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';

const VolunteerModal = () => {
  const { activeModal, closeModal } = useModals();
  const [success, setSuccess] = useState(false);

  if (activeModal !== 'volunteer') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    closeModal();
  };

  return (
    <div className="modal-overlay" id="volunteer-modal" style={{ display: 'flex' }}>
      <div className="modal-card glass-card">
        <button className="modal-close-btn" onClick={handleClose}><i className="fa-solid fa-xmark"></i></button>
        
        {!success ? (
          <>
            <div className="modal-header text-center">
              <i className="fa-solid fa-people-carry-box vol-header-icon"></i>
              <h2>Volunteer Registration</h2>
              <p>Register as partner in progress – "Together We Grow"</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" className="form-control" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" className="form-control" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Address *</label>
                  <input type="text" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input type="text" className="form-control" required />
                </div>
              </div>
              <div className="form-group">
                <label>Capacity I am interested to support in *</label>
                <select className="form-select" required defaultValue="">
                  <option value="" disabled>Select Area of Interest</option>
                  <option value="Direct Service">Direct Service (Teaching, Health support, planting)</option>
                  <option value="Admin">Administrative support (Office, Scheduling)</option>
                  <option value="Fundraising">Fundraising Events</option>
                  <option value="Advocacy / Media">Advocacy &amp; Social Media Campaigns</option>
                  <option value="Skill-based">Skill-based Consulting (IT, Marketing, Finance)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Attach CV / Resume (Optional)</label>
                <input type="file" className="form-control" accept=".pdf,.doc,.docx" />
              </div>
              <button type="submit" className="btn btn-primary w-100" style={{ marginTop: '15px' }}>Register Now <i className="fa-solid fa-circle-check"></i></button>
            </form>
          </>
        ) : (
          <div className="form-success-msg text-center" style={{ display: 'block' }}>
            <i className="fa-solid fa-circle-check success-check-icon"></i>
            <h3>Registration Successful!</h3>
            <p>Our Executives will connect with you shortly to understand you more.</p>
            <button type="button" className="btn btn-primary" onClick={handleClose} style={{ marginTop: '15px' }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerModal;
