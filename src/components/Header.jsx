'use client';
import React, { useState, useEffect } from 'react';
import { useCorporate } from '../context/CorporateContext';
import { useModals } from '../context/ModalContext';
import Link from 'next/link';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { corporate } = useCorporate();
  const { openModal } = useModals();

  const toggleDropdown = (e, menuName) => {
    if (window.innerWidth <= 992) {
      e.preventDefault();
      setActiveDropdown(activeDropdown === menuName ? null : menuName);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <Link href="/" className="logo-area" id="brand-logo">
          <img src={corporate?.logo || '/emyris_logo.webp'} alt={`${corporate?.name || 'Emyris'} Logo`} className="nav-logo" id="pub-header-logo" />
          <div className="logo-info">
            <span className="logo-text" id="pub-header-name">
              Emyris<span className="highlight">Foundation</span>
            </span>
            <span className="logo-tagline" id="pub-header-tagline">Together We Grow</span>
          </div>
        </Link>
        
        <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`} id="nav-links">
          <div className={`nav-dropdown ${activeDropdown === 'about' ? 'active' : ''}`}>
            <Link href="/#about" className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown(e, 'about')}>About Us <i className="fa-solid fa-chevron-down"></i></Link>
            <div className="dropdown-menu">
              <Link href="/#about-vision" onClick={() => setMobileMenuOpen(false)}>Vision & Mission</Link>
              <Link href="/#about-leadership" onClick={() => setMobileMenuOpen(false)}>Leadership Team</Link>
              <Link href="/#about-mentors" onClick={() => setMobileMenuOpen(false)}>Our Mentors</Link>
            </div>
          </div>

          <div className={`nav-dropdown ${activeDropdown === 'work' ? 'active' : ''}`}>
            <Link href="/#work" className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown(e, 'work')}>Our Work <i className="fa-solid fa-chevron-down"></i></Link>
            <div className="dropdown-menu">
              <Link href="/?workTab=work-education#work" onClick={() => setMobileMenuOpen(false)}>Education</Link>
              <Link href="/?workTab=work-health#work" onClick={() => setMobileMenuOpen(false)}>Health</Link>
              <Link href="/?workTab=work-livelihood#work" onClick={() => setMobileMenuOpen(false)}>Livelihood</Link>
              <Link href="/?workTab=work-women#work" onClick={() => setMobileMenuOpen(false)}>Women Empowerment</Link>
              <Link href="/?workTab=work-farmers#work" onClick={() => setMobileMenuOpen(false)}>Farmer's Connect</Link>
              <Link href="/#presence" onClick={() => setMobileMenuOpen(false)}>Where We Work</Link>
            </div>
          </div>

          <div className={`nav-dropdown ${activeDropdown === 'campaigns' ? 'active' : ''}`}>
            <Link href="/#campaigns" className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown(e, 'campaigns')}>Campaigns <i className="fa-solid fa-chevron-down"></i></Link>
            <div className="dropdown-menu">
              <Link href="/?campTab=campaign-shiksha#campaigns" onClick={() => setMobileMenuOpen(false)}>Shiksha Hi Surakhya</Link>
              <Link href="/?campTab=campaign-blood#campaigns" onClick={() => setMobileMenuOpen(false)}>Blood Donation</Link>
              <Link href="/?campTab=campaign-organ#campaigns" onClick={() => setMobileMenuOpen(false)}>Organ Donation</Link>
              <Link href="/?campTab=campaign-plantation#campaigns" onClick={() => setMobileMenuOpen(false)}>Plantation Awareness</Link>
              <Link href="/?campTab=campaign-welfare#campaigns" onClick={() => setMobileMenuOpen(false)}>Social Welfare</Link>
            </div>
          </div>

          <div className={`nav-dropdown ${activeDropdown === 'involved' ? 'active' : ''}`}>
            <Link href="/#get-involved" className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown(e, 'involved')}>Get Involved <i className="fa-solid fa-chevron-down"></i></Link>
            <div className="dropdown-menu">
              <Link href="/#involved-support" onClick={() => setMobileMenuOpen(false)}>Individual Support</Link>
              <Link href="/#involved-volunteer" onClick={() => setMobileMenuOpen(false)}>Volunteering</Link>
              <a href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); openModal('careers'); }}>Work with Us</a>
            </div>
          </div>

          <div className={`nav-dropdown ${activeDropdown === 'partnerships' ? 'active' : ''}`}>
            <Link href="/#partnerships" className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown(e, 'partnerships')}>Partnerships <i className="fa-solid fa-chevron-down"></i></Link>
            <div className="dropdown-menu">
              <Link href="/#partnerships" onClick={() => setMobileMenuOpen(false)}>CSR</Link>
              <Link href="/#partnerships" onClick={() => setMobileMenuOpen(false)}>Employee Engagement</Link>
              <Link href="/#partnerships" onClick={() => setMobileMenuOpen(false)}>Payroll Giving</Link>
              <Link href="/#partnerships" onClick={() => setMobileMenuOpen(false)}>Cause Marketing</Link>
            </div>
          </div>

          <div className={`nav-dropdown ${activeDropdown === 'resources' ? 'active' : ''}`}>
            <Link href="/#resources" className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown(e, 'resources')}>Resources <i className="fa-solid fa-chevron-down"></i></Link>
            <div className="dropdown-menu">
              <Link href="/#blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link href="/#activity-gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
              <Link href="/#publications" onClick={() => setMobileMenuOpen(false)}>Reports</Link>
              <Link href="/#faq-section" onClick={() => setMobileMenuOpen(false)}>FAQs</Link>
            </div>
          </div>

          <Link href="/#contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
        </nav>

        <div className="nav-cta-group">
          <button className="btn btn-primary btn-donate" id="global-donate-btn" onClick={() => openModal('donate')}>Donate <i className="fa-solid fa-heart"></i></button>
          <button className="mobile-nav-toggle" id="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

