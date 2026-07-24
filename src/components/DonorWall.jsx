'use client';
import React from 'react';
import donors from '../data/donors.json';

const DonorWall = () => {
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
            <div key={idx} className="donor-tag">
              <i className={donor.icon || "fa-solid fa-medal"}></i> {donor.name}
            </div>
          ))}
          {donors.map((donor, idx) => (
            <div key={`dup-${idx}`} className="donor-tag">
              <i className={donor.icon || "fa-solid fa-medal"}></i> {donor.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DonorWall;

