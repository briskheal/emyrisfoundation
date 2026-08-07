'use client';
import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const SupportModal = () => {
  const { activeModal, modalData, closeModal } = useModals();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  // Reset form when opened with different data
  React.useEffect(() => {
    if (activeModal === 'support') {
      setSuccess(false);
      setError('');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }
  }, [activeModal, modalData]);

  if (activeModal !== 'support') return null;

  const supportType = modalData || 'General Support';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let captchaToken = '';
      if (executeRecaptcha) {
        captchaToken = await executeRecaptcha('support');
      }

      const payload = {
        supportType,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        captchaToken
      };
      
      const res = await fetch('/api/support', {
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
    setFormData({ name: '', email: '', phone: '', message: '' });
    closeModal();
  };

  return (
    <div className="modal-overlay open" id="support-modal" style={{ display: 'flex' }}>
      <div className="modal-card glass-card">
        <button className="modal-close-btn" onClick={handleClose}><i className="fa-solid fa-xmark"></i></button>
        
        {!success ? (
          <>
            <div className="modal-header text-center">
              <i className="fa-solid fa-hand-holding-heart modal-icon-lg" style={{ color: 'var(--primary)', fontSize: '3rem', marginBottom: '15px' }}></i>
              <h3 className="modal-title">{supportType}</h3>
              <p className="modal-subtitle">Thank you for your interest in supporting Emyris Foundation. Please provide your details below.</p>
            </div>
            {error && <div className="alert alert-danger" style={{marginBottom: '20px', padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '4px', border: '1px solid #ef4444'}}>{error}</div>}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Full Name <span style={{color: 'red'}}>*</span></label>
                <div className="input-with-icon">
                  <i className="fa-regular fa-user"></i>
                  <input type="text" className="form-control" required placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address <span style={{color: 'red'}}>*</span></label>
                <div className="input-with-icon">
                  <i className="fa-regular fa-envelope"></i>
                  <input type="email" className="form-control" required placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-phone"></i>
                  <input type="tel" className="form-control" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>How would you like to contribute?</label>
                <div className="input-with-icon">
                  <i className="fa-regular fa-comment" style={{top: '15px', transform: 'none'}}></i>
                  <textarea className="form-control" rows="3" placeholder={`I would like to help with ${supportType.toLowerCase()}...`} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                </div>
              </div>
              <p className="privacy-note"><i className="fa-solid fa-lock"></i> Your details are secure and will only be used to contact you regarding this support area.</p>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? <><i className="fa-solid fa-spinner fa-spin"></i> Submitting...</> : 'Submit Details'}
              </button>
            </form>
          </>
        ) : (
          <div className="modal-success text-center py-4">
            <div className="success-icon-wrapper mb-4">
              <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: '4rem' }}></i>
            </div>
            <h3 className="mb-3">Thank You!</h3>
            <p className="mb-4">We have successfully received your details for <strong>{supportType}</strong>.</p>
            <p className="mb-4" style={{fontSize: '0.9rem', color: 'var(--text-light)'}}>Our team will contact you shortly. A confirmation email has been sent to {formData.email}.</p>
            <button className="btn btn-outline-orange" onClick={handleClose}>Close Window</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportModal;
