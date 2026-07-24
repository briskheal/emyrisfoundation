'use client';
import React from 'react';
import { useCorporate } from '../context/CorporateContext';
import { useModals } from '../context/ModalContext';

const Footer = () => {
  const { corporate } = useCorporate();
  const { openModal } = useModals();
  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src={corporate?.logo || '/emyris_logo.png'} alt={`${corporate?.name || 'Emyris'} Logo`} className="footer-logo" id="pub-footer-logo" />
          <span className="logo-text" id="pub-footer-name">Emyris<span className="highlight">Foundation</span></span>
          <p id="pub-footer-desc">
            Motto: "Together We Grow" — Fostering community development, education, and health initiatives to ensure everyone can grow and thrive.
          </p>
          <div className="social-links" id="pub-footer-socials">
            <a href={corporate?.fb || '#'} id="pub-fb"><i className="fa-brands fa-facebook"></i></a>
            <a href={corporate?.insta || '#'} id="pub-insta"><i className="fa-brands fa-instagram"></i></a>
            <a href={corporate?.linkedin || '#'} id="pub-linkedin"><i className="fa-brands fa-linkedin"></i></a>
          </div>
        </div>
        
        <div className="footer-links">
          <h4>Quick Links</h4>
          <a href="#home">Home</a>
          <a href="#about-vision">About Vision &amp; Mission</a>
          <a href="#about-leadership">Leadership Team</a>
          <a href="#work">Our Core Work</a>
          <a href="#campaigns">Ongoing Campaigns</a>
        </div>

        <div className="footer-links">
          <h4>Join the Cause</h4>
          <a href="#involved-support">Ways to Support</a>
          <a href="#involved-volunteer">Volunteer Openings</a>
          <a href="#involved-volunteer">Internships</a>
          <a href="#involved-work">Job Vacancies</a>
          <a href="admin.html">Administrator login</a>
        </div>

        <div className="footer-newsletter">
          <h4>Corporate Philanthropy</h4>
          <p>Registered Non-Profit Organisation eligible for up to 50% tax benefit under Section 80G. PAN: {corporate?.pan || 'Loading...'}.</p>
          <div className="newsletter-form">
            <button className="btn btn-primary w-100" onClick={() => openModal('donate')}>
              Donate Online <i className="fa-solid fa-indian-rupee-sign"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; 2026 {corporate?.name || 'Emyris Foundation'}. All rights reserved. Registered under Indian Non Profit Organizations Trust Act. Together We Grow.</p>
      </div>
    </footer>
  );
};

export default Footer;

