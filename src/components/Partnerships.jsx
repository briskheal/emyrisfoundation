'use client';
import React from 'react';

const Partnerships = () => {
  return (
    <section id="partnerships" className="involved-section scroll-spy">
      <div className="container">
        <div className="section-title-wrapper text-center">
          <span className="section-subtitle">Collaborate With Us</span>
          <h2 className="section-title">Corporate &amp; CSR Partnerships</h2>
          <div className="title-underline"></div>
        </div>

        <div className="involved-block" style={{marginTop: '0'}}>
          <p className="text-center involved-para">Align your company's ESG goals with Emyris Foundation. We facilitate customized CSR projects with 80G tax benefit certification and detailed impact measurement sheets.</p>
          
          <div className="support-cards-grid">
            <div className="glass-card support-item">
              <div className="support-icon"><i className="fa-solid fa-building-ngo"></i></div>
              <h4>CSR</h4>
              <p>Fully compliant with Schedule VII of the Companies Act, offering transparent reporting, audits, and impact metrics.</p>
            </div>
            <div className="glass-card support-item">
              <div className="support-icon"><i className="fa-solid fa-hand-holding-hand"></i></div>
              <h4>Employee Engagement</h4>
              <p>Coordinate corporate volunteering drives, local field trips, and skill-sharing seminars for your staff.</p>
            </div>
            <div className="glass-card support-item">
              <div className="support-icon"><i className="fa-solid fa-hand-holding-dollar"></i></div>
              <h4>Payroll Giving</h4>
              <p>Enable employees to seamlessly contribute a portion of their salary to drive sustainable social impact.</p>
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

export default Partnerships;
