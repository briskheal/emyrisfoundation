'use client';
import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';

const ConsentModal = () => {
  const { activeModal, modalData, closeModal, openModal } = useModals();
  const [success, setSuccess] = useState(false);

  if (activeModal !== 'consent') return null;

  const campaignTitle = modalData || 'Campaign Registration';

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    closeModal();
  };

  return (
    <div className="modal-overlay" id="consent-modal" style={{ display: 'flex' }}>
      <div className="modal-card glass-card">
        <button className="modal-close-btn" onClick={handleClose}><i className="fa-solid fa-xmark"></i></button>

        {!success ? (
          <>
            <div className="modal-header text-center">
              <i className="fa-solid fa-file-signature vol-header-icon"></i>
              <h2>{campaignTitle}</h2>
              <p>Fill out the form below to support our social initiatives.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" className="form-control" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gender *</label>
                  <select className="form-select" required defaultValue="Other">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input type="number" className="form-control" min="1" max="120" required />
                </div>
              </div>
              <div className="form-group">
                <label>Address *</label>
                <input type="text" className="form-control" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Email Address (Optional)</label>
                  <input type="email" className="form-control" />
                </div>
              </div>
              <div className="form-group checkbox-group">
                <input type="checkbox" id="con-agree" required defaultChecked />
                <label htmlFor="con-agree" className="checkbox-label">I agree and give my consent to contact me regarding this campaign.</label>
              </div>
              <button type="submit" className="btn btn-primary w-100" style={{ marginTop: '15px' }}>Submit Registration <i className="fa-solid fa-paper-plane"></i></button>
            </form>
          </>
        ) : (
          <div className="form-success-msg text-center" style={{ display: 'block' }}>
            <i className="fa-solid fa-circle-check success-check-icon"></i>
            <h3>Thank You for Your Submission!</h3>
            <p>You will be contacted or invited for this great cause.</p>
            <div className="donate-prompt-box">
              <p>If you are willing to support Emyris Foundation in working relentlessly for social causes, consider making a donation.</p>
              <button className="btn btn-primary btn-sm" onClick={() => openModal('donate')}>Donate Now <i className="fa-solid fa-heart"></i></button>
            </div>
            <button type="button" className="btn btn-outline" onClick={handleClose} style={{ marginTop: '15px' }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsentModal;
