'use client';
import React, { useState, useEffect } from 'react';

const Publications = () => {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    fetch('/api/publications', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setPublications(data); })
      .catch(console.error);
  }, []);

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
                  <p>{pub.year || 'Corporate Document'}</p>
                  {pub.pdfLink ? (
                    <a href={pub.pdfLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline-orange btn-sm btn-pub-download">
                      Download PDF <i className="fa-solid fa-download"></i>
                    </a>
                  ) : (
                    <button className="btn btn-outline-orange btn-sm btn-pub-download" disabled style={{ opacity: 0.5 }}>
                      Coming Soon <i className="fa-solid fa-clock"></i>
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publications;
