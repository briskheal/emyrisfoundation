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
              <button className="btn btn-outline-orange btn-sm btn-vol-start" onClick={() => openModal('volunteer')}>Join as Volunteer <i className="fa-solid fa-handshake-angle"></i></button>
              <button className="btn btn-outline btn-sm btn-intern-start" onClick={() => openModal('internship')}>Apply for Internship <i className="fa-solid fa-graduation-cap"></i></button>
            </div>
            <div className="glass-card support-item">
              <div className="support-icon"><i className="fa-solid fa-circle-dollar-to-slot"></i></div>
              <h4>Financial &amp; In-Kind</h4>
              <p>Donate money directly to Shiksha Hi Surakhya or coordinate in-kind donation of books, clothes, and rations.</p>
              <button className="btn btn-outline-orange btn-sm btn-support-start" onClick={() => openModal('donate')}>Donate <i className="fa-solid fa-heart"></i></button>
            </div>
            <div className="glass-card support-item">
              <div className="support-icon"><i className="fa-solid fa-bullhorn"></i></div>
              <h4>Advocacy &amp; Media</h4>
              <p>Create videos, write articles, or coordinate social media campaigns to raise visibility for our causes.</p>
              <button className="btn btn-outline-orange btn-sm btn-support-start">Start <i className="fa-solid fa-chevron-right"></i></button>
            </div>
            <div className="glass-card support-item">
              <div className="support-icon"><i className="fa-solid fa-chalkboard-user"></i></div>
              <h4>Skill-based Volunteering</h4>
              <p>Offer your professional expertise in marketing, finance, IT, training, or project management pro-bono.</p>
              <button className="btn btn-outline-orange btn-sm btn-support-start">Start <i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
        </div>

        <div id="involved-csr" className="involved-block">
          <h3 className="subsection-title text-center">Corporate &amp; CSR Partnerships</h3>
          <p className="text-center involved-para">Align your company's ESG goals with Emyris Foundation. We facilitate customized CSR projects with 80G tax benefit certification and detailed impact measurement sheets.</p>
          
          <div className="support-cards-grid">
            <div className="glass-card support-item">
              <div className="support-icon"><i className="fa-solid fa-building-ngo"></i></div>
              <h4>ESG &amp; CSR Compliance</h4>
              <p>Fully compliant with Schedule VII of the Companies Act, offering transparent reporting, audits, and impact metrics.</p>
            </div>
            <div className="glass-card support-item">
              <div className="support-icon"><i className="fa-solid fa-hand-holding-hand"></i></div>
              <h4>Employee Engagement</h4>
              <p>Coordinate corporate volunteering drives, local field trips, and skill-sharing seminars for your staff.</p>
            </div>
            <div className="glass-card support-item">
              <div className="support-icon"><i className="fa-solid fa-shield-heart"></i></div>
              <h4>Cause Marketing</h4>
              <p>Co-brand sustainability campaigns, plantation drives, and student learning kits to build shared values.</p>
            </div>
          </div>
          
          <div className="text-center" style={{marginTop: '30px'}}>
            <button className="btn btn-primary" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})}>Partner With Us <i className="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInvolved;

