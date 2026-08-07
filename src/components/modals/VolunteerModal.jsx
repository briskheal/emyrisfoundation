'use client';
import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const VolunteerModal = () => {
  const { activeModal, closeModal } = useModals();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', pincode: '', capacity: '' });

  React.useEffect(() => {
    // Component mounted or active modal changed
  }, [activeModal]);

  if (activeModal !== 'volunteer') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let captchaToken = '';
      if (executeRecaptcha) {
        captchaToken = await executeRecaptcha('volunteer');
      }

      const payload = {
        type: 'volunteer',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        details: `Address: ${formData.address}\nPincode: ${formData.pincode}\nCapacity: ${formData.capacity}`,
        captchaToken
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
    <div className="modal-overlay open" id="volunteer-modal" style={{ display: 'flex' }}>
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
                  <label>In what capacity can you volunteer? *</label>
                  <select className="form-select" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})}>
                    <option value="" disabled>Select option...</option>
                    <option value="Online / Remote">Online / Remote Tasks</option>
                    <option value="On-ground (Weekends)">On-ground (Weekends)</option>
                    <option value="On-ground (Flexible)">On-ground (Flexible)</option>
                    <option value="Skill-based (Design, Tech, etc.)">Skill-based (Design, Tech, etc.)</option>
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
