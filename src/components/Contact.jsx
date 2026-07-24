'use client';
import React from 'react';

const Contact = () => {
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
            <form id="contact-form" onSubmit={(e) => { e.preventDefault(); alert("Message sent!"); }}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-first-name">First Name *</label>
                  <input type="text" id="c-first-name" className="form-control" required placeholder="e.g. John" />
                </div>
                <div className="form-group">
                  <label htmlFor="c-last-name">Last Name *</label>
                  <input type="text" id="c-last-name" className="form-control" required placeholder="e.g. Doe" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-email">Email Address *</label>
                  <input type="email" id="c-email" className="form-control" required placeholder="e.g. john@example.com" />
                </div>
                <div className="form-group">
                  <label htmlFor="c-phone">Phone Number *</label>
                  <input type="tel" id="c-phone" className="form-control" required placeholder="e.g. +91 98765 43210" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="c-message">Message *</label>
                <textarea id="c-message" className="form-control" rows="3" required placeholder="Describe your query..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100" style={{marginTop: '10px'}}>
                Send Message <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

