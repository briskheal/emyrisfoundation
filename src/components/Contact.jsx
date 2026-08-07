'use client';
import React, { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const Contact = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '', botField: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });
  const { executeRecaptcha } = useGoogleReCaptcha();

  React.useEffect(() => {
    // Component mounted or success state changed
  }, [status.success]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setStatus({ loading: true, success: false, error: '' });
      
      try {
      let captchaToken = '';
      if (executeRecaptcha) {
        captchaToken = await executeRecaptcha('contact');
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, captchaToken })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ loading: false, success: true, error: '' });
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '', botField: '' });
      } else {
        setStatus({ loading: false, success: false, error: data.error || 'Submission failed' });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Network error. Please try again later.' });
    }
  };
  return (
    <section id="contact" className="contact-section scroll-spy">
      <div className="container">
        <div className="section-title-wrapper text-center">
          <span className="section-subtitle">Reach Out</span>
          <h2 className="section-title" style={{color: 'var(--white)'}}>Get in Touch</h2>
          <div className="title-underline"></div>
        </div>

        <div className="contact-grid">
          <div className="contact-info-block glass-card">
            <h3>Emyris Head Office</h3>
            <p>Interested in partnerships, volunteering, or seeking guidance? Contact us directly.</p>
            
            <div className="info-list">
              <div className="info-item">
                <div className="info-icon"><i className="fa-solid fa-location-dot"></i></div>
                <div className="info-text">
                  <h4>Address</h4>
                  <p>Baroda, Gujarat / Bhubaneswar, Odisha, India</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><i className="fa-solid fa-phone"></i></div>
                <div className="info-text">
                  <h4>Phone</h4>
                  <p>+91 98765 43210</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><i className="fa-solid fa-envelope"></i></div>
                <div className="info-text">
                  <h4>Email</h4>
                  <p>connect@emyrisfoundation.com</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <a href="#"><i className="fa-brands fa-facebook"></i></a>
              <a href="#"><i className="fa-brands fa-instagram"></i></a>
              <a href="#"><i className="fa-brands fa-linkedin"></i></a>
              <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
            </div>
          </div>

          <div className="contact-form-block glass-card">
            <h3>Send Us a Message</h3>
            <form id="contact-form" onSubmit={handleSubmit}>
              {/* Honeypot field - hidden from users, filled by bots */}
              <input type="text" name="botField" value={formData.botField} onChange={e => setFormData({...formData, botField: e.target.value})} style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-first-name">First Name *</label>
                  <input type="text" id="c-first-name" className="form-control" required placeholder="e.g. John" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label htmlFor="c-last-name">Last Name *</label>
                  <input type="text" id="c-last-name" className="form-control" required placeholder="e.g. Doe" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-email">Email Address *</label>
                  <input type="email" id="c-email" className="form-control" required placeholder="e.g. john@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label htmlFor="c-phone">Phone Number *</label>
                  <input type="tel" id="c-phone" className="form-control" required placeholder="e.g. +91 98765 43210" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">How can we help you?</label>
                <textarea id="message" rows="4" className="form-control" placeholder="Tell us more about your inquiry..." required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
              </div>

              {status.error && <div className="form-error" style={{ color: '#ef4444', marginBottom: '15px' }}>{status.error}</div>}
              {status.success && <div style={{ color: '#15F5BA', marginBottom: '10px', fontSize: '0.9rem' }}><i className="fa-solid fa-circle-check"></i> Message sent successfully! We will get back to you soon.</div>}
              <button type="submit" className="btn btn-primary w-100" style={{marginTop: '10px'}} disabled={status.loading}>
                {status.loading ? 'Sending...' : <>Send Message <i className="fa-solid fa-paper-plane"></i></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

