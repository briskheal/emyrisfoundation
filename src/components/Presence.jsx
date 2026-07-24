'use client';
import React, { useState } from 'react';
import presenceList from '../data/presence.json';

const Presence = () => {
  const [activeState, setActiveState] = useState(presenceList[0]?.id);

  const activeDetails = presenceList.find(p => p.id === activeState);

  return (
    <section id="presence" className="presence-section scroll-spy">
      <div className="container">
        <div className="section-title-wrapper text-center">
          <span className="section-subtitle">Where We Work</span>
          <h2 className="section-title">Our Presence &amp; Impact</h2>
          <div className="title-underline"></div>
        </div>
        
        <div className="presence-grid">
          <div className="presence-tabs" id="presence-tabs-container">
            {presenceList.map(p => (
              <button
                key={p.id}
                className={`presence-tab-btn ${activeState === p.id ? 'active' : ''}`}
                onClick={() => setActiveState(p.id)}
              >
                {p.name} <i className="fa-solid fa-chevron-right"></i>
              </button>
            ))}
          </div>
          
          <div className="glass-card presence-detail-card" id="presence-details-container" style={{ color: 'white' }}>
            {activeDetails && (
              <>
                <div className="presence-header">
                  <h3>{activeDetails.name} Operations</h3>
                  <span className="presence-hq"><i className="fa-solid fa-map-location-dot"></i> HQ: {activeDetails.hq}</span>
                </div>
                <div className="presence-stats">
                  <div className="p-stat">
                    <h4>{activeDetails.volunteers}+</h4>
                    <p>Active Volunteers</p>
                  </div>
                  <div className="p-stat">
                    <h4>{activeDetails.programs.length}</h4>
                    <p>Core Programs</p>
                  </div>
                </div>
                <div className="presence-contact">
                  <h4>State Coordinator</h4>
                  <p><i className="fa-solid fa-user-shield"></i> {activeDetails.coordinator}</p>
                  <p><i className="fa-solid fa-phone"></i> {activeDetails.phone}</p>
                </div>
                <div className="presence-programs">
                  <h4>Active Initiatives</h4>
                  <ul>
                    {activeDetails.programs.map((prog, idx) => (
                      <li key={idx}><i className="fa-solid fa-circle-check text-blue"></i> {prog}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Presence;

