'use client';
import React, { useState } from 'react';
import fallbackDonors from '../data/donors.json';

const DonorWall = ({ initialDonors }) => {
  const [donors, setDonors] = useState(initialDonors && initialDonors.length > 0 ? initialDonors : fallbackDonors);
  return (
    <section className="donor-wall-section">
      <div className="container text-center" style={{marginBottom: '25px'}}>
        <span className="section-subtitle">Our Champions</span>
        <h3 style={{color: 'var(--white)', fontWeight: 700, fontSize: '1.6rem', fontFamily: 'var(--font-title)', margin: 0}}>
          Emyris Foundation Wall of Fame
        </h3>
      </div>
      <div className="donor-marquee-wrapper">
        <div className="donor-marquee" id="donor-marquee-container">
          {donors.map((donor, idx) => (
            <div key={idx} className="donor-tag" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {donor.image ? (
                <img src={donor.image} alt="Logo" style={{ height: '30px', width: '30px', objectFit: 'contain', borderRadius: '4px' }} />
              ) : (
                <i className={donor.icon || "fa-solid fa-medal"}></i>
              )}
              <span>{donor.name}</span>
            </div>
          ))}
          {donors.map((donor, idx) => (
            <div key={`dup-${idx}`} className="donor-tag" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {donor.image ? (
                <img src={donor.image} alt="Logo" style={{ height: '30px', width: '30px', objectFit: 'contain', borderRadius: '4px' }} />
              ) : (
                <i className={donor.icon || "fa-solid fa-medal"}></i>
              )}
              <span>{donor.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DonorWall;

