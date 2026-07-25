'use client';
import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';

const ConsentModal = () => {
  const { activeModal, modalData, closeModal, openModal } = useModals();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({ name: '', gender: 'Other', age: '', address: '', phone: '', email: '' });

  if (activeModal !== 'consent') return null;

  const campaignTitle = modalData || 'Campaign Registration';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        campaign: campaignTitle,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        details: `Gender: ${formData.gender}\nAge: ${formData.age}\nAddress: ${formData.address}`
      };
      const res = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setFormData({ name: '', gender: 'Other', age: '', address: '', phone: '', email: '' });
    closeModal();
  };

  return (
    <div className="modal-overlay open" id="consent-modal" style={{ display: 'flex' }}>
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
                <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gender *</label>
                  <select className="form-select" required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input type="number" className="form-control" min="1" max="120" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Address *</label>
                <input type="text" className="form-control" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" className="form-control" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email Address (Optional)</label>
                  <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="form-group checkbox-group">
                <input type="checkbox" id="con-agree" required defaultChecked />
                <label htmlFor="con-agree" className="checkbox-label">I agree and give my consent to contact me regarding this campaign.</label>
              </div>
              
              {error && <div style={{ color: '#ef4444', marginBottom: '10px', fontSize: '0.9rem' }}>{error}</div>}
              
              <button type="submit" className="btn btn-primary w-100" style={{ marginTop: '15px' }} disabled={loading}>
                {loading ? 'Submitting...' : <>Submit Registration <i className="fa-solid fa-paper-plane"></i></>}
              </button>
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
