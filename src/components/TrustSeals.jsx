'use client';
import React from 'react';
import { useCorporate } from '../context/CorporateContext';

const TrustSeals = () => {
  const { corporate } = useCorporate();
  
  const seals = [
    { icon: "fa-solid fa-file-shield", title: "PAN NO", id: "trust-pan-text", text: corporate?.pan || 'Loading...' },
    { icon: "fa-solid fa-circle-check", title: "CSR Regn. No.", id: "trust-darpan-text", text: corporate?.niti || 'Loading...' },
    { icon: "fa-solid fa-stamp", title: "CIN NO", id: "trust-cin-text", text: corporate?.cin || 'Loading...' },
    { icon: "fa-solid fa-certificate", title: "TAN NO", id: "trust-tan-text", text: corporate?.tan || 'Loading...' }
  ];

  return (
    <section className="trust-seals-section">
      <div className="container trust-container">
        <div className="trust-marquee-track">
          {[...seals, ...seals].map((seal, idx) => (
            <div key={idx} className={`trust-badge-card ${idx >= seals.length ? 'duplicate-seal' : ''}`}>
              <div className="trust-badge-icon"><i className={seal.icon}></i></div>
              <div className="trust-badge-text">
                <h4>{seal.title}</h4>
                <p id={idx < seals.length ? seal.id : undefined}>{seal.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSeals;
