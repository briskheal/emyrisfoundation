'use client';
import React, { useState, useEffect } from 'react';
import { useCorporate } from '../context/CorporateContext';
import { useDonateModal } from '../context/DonateModalContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { corporate } = useCorporate();
  const { openDonateModal } = useDonateModal();
  return (
    <header className="main-header">
      <div className="container header-container">
        <a href="#" className="logo-area" id="brand-logo">
          <img src={corporate?.logo || '/emyris_logo.png'} alt={`${corporate?.name || 'Emyris'} Logo`} className="nav-logo" id="pub-header-logo" />
          <div className="logo-info">
            <span className="logo-text" id="pub-header-name">
              Emyris<span className="highlight">Foundation</span>
            </span>
            <span className="logo-tagline" id="pub-header-tagline">Together We Grow</span>
          </div>
        </a>
        
        <nav className="nav-menu" id="nav-links">
          <a href="#home" className="nav-link active">Home</a>
          
          <div className="nav-dropdown">
            <a href="#about" className="nav-link dropdown-toggle">About Us <i className="fa-solid fa-chevron-down"></i></a>
            <div className="dropdown-menu">
              <a href="#about-vision">Vision & Mission</a>
              <a href="#about-leadership">Leadership Team</a>
              <a href="#about-mentors">Our Mentors</a>
            </div>
          </div>

          <div className="nav-dropdown">
            <a href="#work" className="nav-link dropdown-toggle">Our Work <i className="fa-solid fa-chevron-down"></i></a>
            <div className="dropdown-menu">
              <a href="#work" data-tab="work-education">Education</a>
              <a href="#work" data-tab="work-health">Health</a>
              <a href="#work" data-tab="work-livelihood">Livelihood</a>
              <a href="#work" data-tab="work-women">Women Empowerment</a>
              <a href="#work" data-tab="work-farmers">Farmer's Connect</a>
            </div>
          </div>

          <div className="nav-dropdown">
            <a href="#campaigns" className="nav-link dropdown-toggle">Campaigns <i className="fa-solid fa-chevron-down"></i></a>
            <div className="dropdown-menu">
              <a href="#camp-shiksha">Shiksha Hi Surakhya</a>
              <a href="#camp-blood">Blood Donation</a>
              <a href="#camp-organ">Organ Donation</a>
              <a href="#camp-plantation">Plantation Awareness</a>
              <a href="#camp-welfare">Social Welfare</a>
            </div>
          </div>

          <div className="nav-dropdown">
            <a href="#presence" className="nav-link dropdown-toggle">Partnerships <i className="fa-solid fa-chevron-down"></i></a>
            <div className="dropdown-menu">
              <a href="#involved-csr">Corporate Partnerships</a>
              <a href="#involved-csr">Institutional Partnerships</a>
              <a href="#presence">Engagement with Government</a>
            </div>
          </div>

          <div className="top-bar-contact">
            <a href={`mailto:${corporate?.email || ''}`} className="contact-link">
              <i className="fa-regular fa-envelope"></i> {corporate?.email || 'Loading...'}
            </a>
            <span className="contact-divider"></span>
            <a href={`tel:${corporate?.phone1 || ''}`} className="contact-link">
              <i className="fa-solid fa-phone"></i> +91 {corporate?.phone1 || 'Loading...'}
            </a>
          </div>

          <div className="nav-dropdown">
            <a href="#publications" className="nav-link dropdown-toggle">Resources <i className="fa-solid fa-chevron-down"></i></a>
            <div className="dropdown-menu">
              <a href="#campaigns">Latest Blog</a>
              <a href="#publications">Resource Centre</a>
              <a href="#publications">Annual Reports</a>
              <a href="#publications">Other Reports</a>
              <a href="#faq-section">FAQs</a>
              <a href="#activity-gallery">Activity Gallery</a>
            </div>
          </div>

          <div className="nav-dropdown">
            <a href="#get-involved" className="nav-link dropdown-toggle">Get Involved <i className="fa-solid fa-chevron-down"></i></a>
            <div className="dropdown-menu">
              <a href="#involved-support">Individual Support</a>
              <a href="#involved-volunteer">Volunteers & Interns</a>
              <a href="#involved-work">Work with Us</a>
            </div>
          </div>

          <a href="#contact" className="nav-link">Contact Us</a>
        </nav>

        <div className="nav-cta-group">
          <button className="btn btn-primary btn-donate" id="global-donate-btn" onClick={openDonateModal}>Donate Now <i className="fa-solid fa-heart"></i></button>
          <button className="mobile-nav-toggle" id="menu-toggle">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

