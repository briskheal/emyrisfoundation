'use client';
import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';

const ConsentModal = () => {
  const { activeModal, modalData, closeModal, openModal } = useModals();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({ name: '', gender: 'Male', age: '', state: '', pin: '', address: '', bloodGroup: 'O+', phone: '', email: '' });

  if (activeModal !== 'consent') return null;

  const campaignTitle = modalData || 'Campaign Registration';
  const isBloodCampaign = campaignTitle.toLowerCase().includes('blood');

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
        details: `Gender: ${formData.gender}\nAge: ${formData.age}\nState: ${formData.state}\nPin: ${formData.pin}\nAddress: ${formData.address}\nBlood Group: ${formData.bloodGroup}`
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
    setFormData({ name: '', gender: 'Male', age: '', state: '', pin: '', address: '', bloodGroup: 'O+', phone: '', email: '' });
    closeModal();
  };

  return (
    <div className="modal-overlay open" id="consent-modal" style={{ display: 'flex' }}>
      <div className="modal-card glass-card" style={{ maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="modal-close-btn" onClick={handleClose}><i className="fa-solid fa-xmark"></i></button>

        {!success ? (
          <>
            <div className="modal-header text-center">
              <i className="fa-solid fa-file-signature vol-header-icon"></i>
              <h2>{isBloodCampaign ? 'Blood: The Universal Bond' : campaignTitle}</h2>
              <p>{isBloodCampaign ? 'Consent form to Contact and Coordinate' : 'Fill out the form below to support our social initiatives.'}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" className="form-control" required placeholder="Enter your full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
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
                  <input type="number" className="form-control" min="18" max="70" required placeholder="Age" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>State *</label>
                  <input type="text" className="form-control" required placeholder="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Pin Code *</label>
                  <input type="text" className="form-control" required placeholder="Postal Pin" value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Address *</label>
                <input type="text" className="form-control" required placeholder="Full residential address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone No *</label>
                  <input type="tel" className="form-control" required placeholder="Mobile Contact" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Blood Group *</label>
                  <select className="form-select" required value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="Not Sure">Not Sure / Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Email ID (If Any)</label>
                <input type="email" className="form-control" placeholder="Optional email address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group checkbox-group" style={{ margin: '12px 0' }}>
                <input type="checkbox" id="con-agree" required defaultChecked />
                <label htmlFor="con-agree" className="checkbox-label">I agree and give my consent to contact me regarding this camp invite.</label>
              </div>
              
              {error && <div style={{ color: '#ef4444', marginBottom: '10px', fontSize: '0.9rem' }}>{error}</div>}
              
              <button type="submit" className="btn btn-primary w-100" style={{ marginTop: '10px', padding: '12px' }} disabled={loading}>
                {loading ? 'Submitting...' : <>Submit Consent <i className="fa-solid fa-paper-plane" style={{ marginLeft: '6px' }}></i></>}
              </button>
            </form>
          </>
        ) : (
          <div className="form-success-msg text-center" style={{ display: 'block', padding: '20px 10px' }}>
            <i className="fa-solid fa-circle-check success-check-icon" style={{ fontSize: '3rem', color: '#22c55e', marginBottom: '15px' }}></i>
            <h3 style={{ marginBottom: '10px', fontSize: '1.4rem' }}>Thankx for your submission.</h3>
            <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '20px', color: 'rgba(255,255,255,0.9)' }}>
              You will be invited for this great cause to nearest camp arranged.
            </p>
            <div className="donate-prompt-box" style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'justify', marginBottom: '20px' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '12px', lineHeight: '1.5' }}>
                If you are willing to support Emyris Foundation which relentlessly working for Social Causes, do consider to contribute. Each contribution brings happiness in other lives. In a Society, we believe , <strong>“Together We Grow”</strong>.
              </p>
              <button className="btn btn-primary w-100" style={{ padding: '10px' }} onClick={() => openModal('donate')}>
                Donation Tab <i className="fa-solid fa-heart" style={{ marginLeft: '6px' }}></i>
              </button>
            </div>
            <button type="button" className="btn btn-outline w-100" onClick={handleClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsentModal;
