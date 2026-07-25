'use client';
import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';

const VolunteerModal = () => {
  const { activeModal, closeModal } = useModals();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', pincode: '', capacity: '' });

  if (activeModal !== 'volunteer') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        type: 'volunteer',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        details: `Address: ${formData.address}\nPincode: ${formData.pincode}\nCapacity: ${formData.capacity}`
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
    setFormData({ name: '', email: '', phone: '', address: '', pincode: '', capacity: '' });
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
                <div className="form-group flex-2">
                  <label>Address *</label>
                  <input type="text" className="form-control" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input type="text" className="form-control" required value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Capacity I am interested to support in *</label>
                <select className="form-select" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})}>
                  <option value="" disabled>Select Area of Interest</option>
                  <option value="Direct Service">Direct Service (Teaching, Health support, planting)</option>
                  <option value="Admin">Administrative support (Office, Scheduling)</option>
                  <option value="Fundraising">Fundraising Events</option>
                  <option value="Advocacy / Media">Advocacy &amp; Social Media Campaigns</option>
                  <option value="Skill-based">Skill-based Consulting (IT, Marketing, Finance)</option>
                </select>
              </div>
              
              {error && <div style={{ color: '#ef4444', marginBottom: '10px', fontSize: '0.9rem' }}>{error}</div>}
              
              <button type="submit" className="btn btn-primary w-100" style={{ marginTop: '15px' }} disabled={loading}>
                {loading ? 'Submitting...' : <>Register Now <i className="fa-solid fa-circle-check"></i></>}
              </button>
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
