'use client';
import React from 'react';
import { useCorporate } from '../context/CorporateContext';

const TrustSeals = () => {
  const { corporate } = useCorporate();
  return (
    <section className="trust-seals-section">
      <div className="container trust-container">
        <div className="trust-badge-card">
          <div className="trust-badge-icon"><i className="fa-solid fa-file-shield"></i></div>
          <div className="trust-badge-text">
            <h4>80G Tax Exempted</h4>
            <p id="trust-80g-text">{corporate?.tax80g || 'Loading...'}</p>
          </div>
        </div>
        <div className="trust-badge-card">
          <div className="trust-badge-icon"><i className="fa-solid fa-circle-check"></i></div>
          <div className="trust-badge-text">
            <h4>CSR Regn. No.</h4>
            <p id="trust-darpan-text">{corporate?.niti || 'Loading...'}</p>
          </div>
        </div>
        <div className="trust-badge-card">
          <div className="trust-badge-icon"><i className="fa-solid fa-stamp"></i></div>
          <div className="trust-badge-text">
            <h4>ISO 9001:2015</h4>
            <p>Quality Management Certified</p>
          </div>
        </div>
        <div className="trust-badge-card">
          <div className="trust-badge-icon"><i className="fa-solid fa-certificate"></i></div>
          <div className="trust-badge-text">
            <h4>12A Registered</h4>
            <p id="trust-12a-text">{corporate?.tax12a || 'Loading...'}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSeals;

