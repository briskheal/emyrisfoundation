'use client';
import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';

const JobModal = () => {
  const { activeModal, modalData, closeModal } = useModals();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', city: '', pincode: '', experience: '' });

  if (activeModal !== 'job') return null;

  const jobTitle = modalData || 'Position Name';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        type: 'job',
        position: jobTitle,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        details: `City: ${formData.city}\nPincode: ${formData.pincode}\nExperience:\n${formData.experience}`
      };
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Submission failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setFormData({ name: '', email: '', phone: '', city: '', pincode: '', experience: '' });
    closeModal();
  };

  return (
    <div className="modal-overlay open" id="job-apply-modal" style={{ display: 'flex' }}>
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
                <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" className="form-control" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" className="form-control" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input type="text" className="form-control" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input type="text" className="form-control" required value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Experience / Why are you suitable for this role? *</label>
                <textarea className="form-control" rows="3" required placeholder="Describe your relevant corporate or NGO experience..." value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})}></textarea>
              </div>
              
              {error && <div style={{ color: '#ef4444', marginBottom: '10px', fontSize: '0.9rem' }}>{error}</div>}
              
              <button type="submit" className="btn btn-primary w-100" style={{ marginTop: '15px' }} disabled={loading}>
                {loading ? 'Submitting...' : <>Submit Application <i className="fa-solid fa-paper-plane"></i></>}
              </button>
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
