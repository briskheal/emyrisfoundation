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
            <h4>PAN NO</h4>
            <p id="trust-pan-text">{corporate?.pan || 'Loading...'}</p>
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
            <h4>CIN NO</h4>
            <p id="trust-cin-text">{corporate?.cin || 'Loading...'}</p>
          </div>
        </div>
        <div className="trust-badge-card">
          <div className="trust-badge-icon"><i className="fa-solid fa-certificate"></i></div>
          <div className="trust-badge-text">
            <h4>TAN NO</h4>
            <p id="trust-tan-text">{corporate?.tan || 'Loading...'}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSeals;

