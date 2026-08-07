'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Partnerships = ({ initialPartnerships = [] }) => {
  const [partnerships, setPartnerships] = useState(initialPartnerships);

  useEffect(() => {
    if (initialPartnerships.length === 0) {
      fetch('/api/partnerships')
        .then(res => res.json())
        .then(data => setPartnerships(data || []))
        .catch(console.error);
    }
  }, [initialPartnerships]);

  // Determine if we need horizontal scrolling (more than 4 items)
  const isScrollable = partnerships.length > 4;
  const gridClass = isScrollable ? 'partnerships-scroll-container' : 'support-cards-grid';
  const itemClass = isScrollable ? 'partnerships-item glass-card support-item' : 'glass-card support-item';

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
          
          {partnerships.length > 0 ? (
            <div className={gridClass}>
              {partnerships.map((p) => (
                <div key={p.id} className={itemClass} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="support-icon"><i className={p.icon || 'fa-solid fa-handshake'}></i></div>
                  <h4>{p.title}</h4>
                  <p style={{ flexGrow: 1 }}>{p.summary}</p>
                  <Link href={`/partnership/${p.id}`} className="btn btn-outline-orange btn-sm btn-support-start" style={{ marginTop: '15px' }}>
                    Read more <i className="fa-solid fa-chevron-right"></i>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center" style={{ padding: '40px', color: 'var(--text-muted)' }}>
              Loading partnerships...
            </div>
          )}
          
          <div className="text-center" style={{marginTop: '40px'}}>
            <button className="btn btn-primary" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})}>Partner With Us <i className="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partnerships;
