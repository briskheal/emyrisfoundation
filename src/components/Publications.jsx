'use client';
import React from 'react';
import publications from '../data/publications.json';

const Publications = () => {
  return (
    <section id="publications" className="publications-section scroll-spy">
      <div className="container">
        <div className="section-title-wrapper text-center">
          <span className="section-subtitle">Governance &amp; Transparency</span>
          <h2 className="section-title">Reports &amp; Certificates</h2>
          <div className="title-underline"></div>
        </div>
        
        <div className="publications-grid" id="publications-grid-container">
          {publications.map(pub => (
            <div key={pub.id} className="glass-card pub-card">
              <div className="pub-card-icon"><i className="fa-solid fa-file-pdf"></i></div>
              <div className="pub-card-content">
                  <h4>{pub.title}</h4>
                  <p>{pub.desc}</p>
                  <button className="btn btn-outline-orange btn-sm btn-pub-download">
                    Download PDF <i className="fa-solid fa-download"></i>
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publications;

