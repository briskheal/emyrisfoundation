'use client';
import React, { useState } from 'react';
import faqs from '../data/faqs.json';

const FAQs = () => {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq-section" className="faq-section scroll-spy">
      <div className="container">
        <div className="section-title-wrapper text-center">
          <span className="section-subtitle">Common Questions</span>
          <h2 className="section-title" style={{color: 'var(--white)'}}>Frequently Asked Questions</h2>
          <div className="title-underline"></div>
        </div>
        
        <div className="faq-accordion-container" id="faq-accordion-container">
          {faqs.map(faq => (
            <div key={faq.id} className={`faq-accordion-item glass-card ${openId === faq.id ? 'active' : ''}`}>
              <button className="faq-question-button" onClick={() => toggleFaq(faq.id)}>
                <span>{faq.q}</span>
                <i className={`fa-solid ${openId === faq.id ? 'fa-chevron-up' : 'fa-chevron-down'} faq-arrow-icon`}></i>
              </button>
              <div className="faq-answer-panel" style={{ maxHeight: openId === faq.id ? '200px' : null }}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;

