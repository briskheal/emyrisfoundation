'use client';
import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';

const JobModal = () => {
  const { activeModal, modalData, closeModal } = useModals();
  const [success, setSuccess] = useState(false);

  if (activeModal !== 'job') return null;

  const jobTitle = modalData || 'Position Name';

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    closeModal();
  };

  return (
    <div className="modal-overlay" id="job-apply-modal" style={{ display: 'flex' }}>
      <div className="modal-card glass-card">
        <button className="modal-close-btn" onClick={handleClose}><i className="fa-solid fa-xmark"></i></button>

        {!success ? (
          <>
            <div className="modal-header text-center">
              <i className="fa-solid fa-briefcase vol-header-icon"></i>
              <h2>Job Application</h2>
              <p id="job-apply-position-title">{jobTitle}</p>
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
                <div className="form-group">
                  <label>City *</label>
                  <input type="text" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input type="text" className="form-control" required />
                </div>
              </div>
              <div className="form-group">
                <label>Experience / Why are you suitable for this role? *</label>
                <textarea className="form-control" rows="3" required placeholder="Describe your relevant corporate or NGO experience..."></textarea>
              </div>
              <div className="form-group">
                <label>Upload CV / Resume *</label>
                <input type="file" className="form-control" accept=".pdf,.doc,.docx" required />
              </div>
              <button type="submit" className="btn btn-primary w-100" style={{ marginTop: '15px' }}>Submit Application <i className="fa-solid fa-paper-plane"></i></button>
            </form>
          </>
        ) : (
          <div className="form-success-msg text-center" style={{ display: 'block' }}>
            <i className="fa-solid fa-circle-check success-check-icon"></i>
            <h3>Application Received!</h3>
            <p>Thank you for your application. Our recruitment team will review your qualifications and get back to you shortly.</p>
            <button type="button" className="btn btn-primary" onClick={handleClose} style={{ marginTop: '15px' }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobModal;
