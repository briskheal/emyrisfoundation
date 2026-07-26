'use client';
import React, { useState, useEffect } from 'react';
import { useCorporate } from '../context/CorporateContext';
import { useModals } from '../context/ModalContext';

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
        <a href="#" className="logo-area" id="brand-logo">
          <img src={corporate?.logo || '/emyris_logo.webp'} alt={`${corporate?.name || 'Emyris'} Logo`} className="nav-logo" id="pub-header-logo" />
          <div className="logo-info">
            <span className="logo-text" id="pub-header-name">
              Emyris<span className="highlight">Foundation</span>
            </span>
            <span className="logo-tagline" id="pub-header-tagline">Together We Grow</span>
          </div>
        </a>
        
        <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`} id="nav-links">
          <a href="#home" className="nav-link active" onClick={() => setMobileMenuOpen(false)}>Home</a>
          
          <div className={`nav-dropdown ${activeDropdown === 'about' ? 'active' : ''}`}>
            <a href="#about" className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown(e, 'about')}>About Us <i className="fa-solid fa-chevron-down"></i></a>
            <div className="dropdown-menu">
              <a href="#about-vision" onClick={() => setMobileMenuOpen(false)}>Vision & Mission</a>
              <a href="#about-leadership" onClick={() => setMobileMenuOpen(false)}>Leadership Team</a>
              <a href="#about-mentors" onClick={() => setMobileMenuOpen(false)}>Our Mentors</a>
            </div>
          </div>

          <div className={`nav-dropdown ${activeDropdown === 'work' ? 'active' : ''}`}>
            <a href="#work" className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown(e, 'work')}>Our Work <i className="fa-solid fa-chevron-down"></i></a>
            <div className="dropdown-menu">
              <a href="#work" onClick={() => setMobileMenuOpen(false)}>Education</a>
              <a href="#work" onClick={() => setMobileMenuOpen(false)}>Health</a>
              <a href="#work" onClick={() => setMobileMenuOpen(false)}>Livelihood</a>
              <a href="#work" onClick={() => setMobileMenuOpen(false)}>Women Empowerment</a>
              <a href="#work" onClick={() => setMobileMenuOpen(false)}>Farmer's Connect</a>
            </div>
          </div>

          <div className={`nav-dropdown ${activeDropdown === 'campaigns' ? 'active' : ''}`}>
            <a href="#campaigns" className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown(e, 'campaigns')}>Campaigns <i className="fa-solid fa-chevron-down"></i></a>
            <div className="dropdown-menu">
              <a href="#camp-shiksha" onClick={() => setMobileMenuOpen(false)}>Shiksha Hi Surakhya</a>
              <a href="#camp-blood" onClick={() => setMobileMenuOpen(false)}>Blood Donation</a>
              <a href="#camp-organ" onClick={() => setMobileMenuOpen(false)}>Organ Donation</a>
              <a href="#camp-plantation" onClick={() => setMobileMenuOpen(false)}>Plantation Awareness</a>
              <a href="#camp-welfare" onClick={() => setMobileMenuOpen(false)}>Social Welfare</a>
            </div>
          </div>

          <div className={`nav-dropdown ${activeDropdown === 'partnerships' ? 'active' : ''}`}>
            <a href="#presence" className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown(e, 'partnerships')}>Partnerships <i className="fa-solid fa-chevron-down"></i></a>
            <div className="dropdown-menu">
              <a href="#involved-csr" onClick={() => setMobileMenuOpen(false)}>Corporate Partnerships</a>
              <a href="#involved-csr" onClick={() => setMobileMenuOpen(false)}>Institutional Partnerships</a>
              <a href="#presence" onClick={() => setMobileMenuOpen(false)}>Engagement with Government</a>
            </div>
          </div>

          <div className={`nav-dropdown ${activeDropdown === 'resources' ? 'active' : ''}`}>
            <a href="#publications" className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown(e, 'resources')}>Resources <i className="fa-solid fa-chevron-down"></i></a>
            <div className="dropdown-menu">
              <a href="#campaigns" onClick={() => setMobileMenuOpen(false)}>Latest Blog</a>
              <a href="#publications" onClick={() => setMobileMenuOpen(false)}>Resource Centre</a>
              <a href="#publications" onClick={() => setMobileMenuOpen(false)}>Annual Reports</a>
              <a href="#publications" onClick={() => setMobileMenuOpen(false)}>Other Reports</a>
              <a href="#faq-section" onClick={() => setMobileMenuOpen(false)}>FAQs</a>
              <a href="#activity-gallery" onClick={() => setMobileMenuOpen(false)}>Activity Gallery</a>
            </div>
          </div>

          <div className={`nav-dropdown ${activeDropdown === 'involved' ? 'active' : ''}`}>
            <a href="#get-involved" className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown(e, 'involved')}>Get Involved <i className="fa-solid fa-chevron-down"></i></a>
            <div className="dropdown-menu">
              <a href="#involved-support" onClick={() => setMobileMenuOpen(false)}>Individual Support</a>
              <a href="#involved-volunteer" onClick={() => setMobileMenuOpen(false)}>Volunteers & Interns</a>
              <a href="#involved-work" onClick={() => setMobileMenuOpen(false)}>Work with Us</a>
            </div>
          </div>

          <a href="#contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact Us</a>
        </nav>

        <div className="nav-cta-group">
          <button className="btn btn-primary btn-donate" id="global-donate-btn" onClick={() => openModal('donate')}>Donate Now <i className="fa-solid fa-heart"></i></button>
          <button className="mobile-nav-toggle" id="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

