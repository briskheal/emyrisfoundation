'use client';
import React from 'react';
import { useModals } from '../context/ModalContext';

const GetInvolved = () => {
  const { openModal } = useModals();
  return (
    <section id="get-involved" className="involved-section scroll-spy">
      <div className="container">
        <div className="section-title-wrapper text-center">
          <span className="section-subtitle">Get Involved</span>
          <h2 className="section-title">Support and Growth Pathways</h2>
          <div className="title-underline"></div>
        </div>

        <div id="involved-support" className="involved-block">
          <h3 className="subsection-title text-center">Individual Support</h3>
          <p className="text-center involved-para">You can play a significant role in various capacities, contributing to the operational success of Emyris Foundation.</p>
          
          <div className="support-cards-grid">
            <div className="glass-card support-item">
              <div className="support-icon"><i className="fa-solid fa-hands-helping"></i></div>
              <h4>Direct Service</h4>
              <p>Engage directly with the community by assisting in teaching, health services, environmental clean-ups, or campaigns.</p>
              <button className="btn btn-outline-orange btn-sm btn-support-start" onClick={() => openModal('support', 'Direct Service')}>Start <i className="fa-solid fa-chevron-right"></i></button>
            </div>
            <div className="glass-card support-item">
              <div className="support-icon"><i className="fa-solid fa-circle-dollar-to-slot"></i></div>
              <h4>Financial &amp; In-Kind</h4>
              <p>Donate money directly to Shiksha Hi Surakhya or coordinate in-kind donation of books, clothes, and rations.</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button className="btn btn-outline-orange btn-sm btn-support-start" onClick={() => openModal('donate')} style={{ margin: 0 }}>Donate <i className="fa-solid fa-heart"></i></button>
                <button className="btn btn-outline-orange btn-sm btn-support-start" onClick={() => openModal('support', 'Financial & In-Kind')} style={{ margin: 0 }}>Contribute In-Kind <i className="fa-solid fa-gift"></i></button>
              </div>
            </div>
            <div className="glass-card support-item">
              <div className="support-icon"><i className="fa-solid fa-bullhorn"></i></div>
              <h4>Advocacy &amp; Media</h4>
              <p>Create videos, write articles, or coordinate social media campaigns to raise visibility for our causes.</p>
              <button className="btn btn-outline-orange btn-sm btn-support-start" onClick={() => openModal('support', 'Advocacy & Media')}>Start <i className="fa-solid fa-chevron-right"></i></button>
            </div>
            <div className="glass-card support-item">
              <div className="support-icon"><i className="fa-solid fa-chalkboard-user"></i></div>
              <h4>Skill-based Volunteering</h4>
              <p>Offer your professional expertise in marketing, finance, IT, training, or project management pro-bono.</p>
              <button className="btn btn-outline-orange btn-sm btn-support-start" onClick={() => openModal('support', 'Skill-based Volunteering')}>Start <i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
        </div>



        <div id="involved-volunteer" className="involved-block" style={{marginTop: '60px'}}>
          <h3 className="subsection-title text-center">Volunteers & Interns</h3>
          <p className="text-center involved-para">Join our hands-on programs and gain valuable field experience while making a real difference.</p>
          <div className="text-center" style={{marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <button className="btn btn-primary" onClick={() => openModal('volunteer')}>Join as Volunteer <i className="fa-solid fa-handshake-angle"></i></button>
            <button className="btn btn-outline" onClick={() => openModal('internship')}>Apply for Internship <i className="fa-solid fa-graduation-cap"></i></button>
          </div>
        </div>

        <div id="involved-work" className="involved-block" style={{marginTop: '60px'}}>
          <h3 className="subsection-title text-center">Work with Us (Careers)</h3>
          <p className="text-center involved-para">Looking for a full-time role to drive social change? Explore our active job openings across various departments and locations.</p>
          <div className="text-center" style={{marginTop: '30px'}}>
            <button className="btn btn-primary" onClick={() => openModal('careers')}>Browse Open Positions <i className="fa-solid fa-briefcase"></i></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInvolved;

