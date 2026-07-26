'use client';
import React, { useState, useEffect } from 'react';
import { useModals } from '../context/ModalContext';
import fallbackCampaigns from '../data/campaigns.json';

const Campaigns = ({ initialCampaigns }) => {
  const { openModal } = useModals();
  const [campaigns, setCampaigns] = useState(initialCampaigns && initialCampaigns.length > 0 ? initialCampaigns : fallbackCampaigns);

  useEffect(() => {
    if (!initialCampaigns) {
      fetch('/api/campaigns')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) setCampaigns(data);
        })
        .catch(err => console.error("Failed to load campaigns", err));
    }
  }, [initialCampaigns]);

  const tagColors = {
    "health": "red",
    "education": "",
    "welfare": "purple",
    "environment": "green",
    "social security": "teal"
  };

  return (
    <section id="campaigns" className="campaign-section scroll-spy">
      <div className="container">
        <div className="section-title-wrapper text-center">
          <span className="section-subtitle">Join Our Actions</span>
          <h2 className="section-title">Ongoing Campaigns</h2>
          <div className="title-underline"></div>
        </div>

        <div className="campaigns-grid" id="campaigns-list-container">
          {campaigns.map((c) => {
            const tagClass = tagColors[c.tag.toLowerCase()] || "";
            const imageSrc = c.photo ? c.photo : c.img;

            return (
              <div key={c.id} className="campaign-card glass-card" id={`camp-${c.id}`}>
                <div className="camp-img-wrapper">
                  <img src={imageSrc} alt={c.title} className="camp-img" />
                  <span className={`camp-tag ${tagClass}`}>{c.tag}</span>
                </div>
                <div className="camp-body">
                  <h3>{c.title}</h3>
                  <p className="camp-motto">"{c.motto}"</p>
                  <p>{c.desc}</p>
                  <div className="camp-actions">
                    {c.tag.toLowerCase() === 'education' ? (
                      <button className="btn btn-primary btn-sm btn-donate-camp" onClick={() => openModal('donate')}>Donate <i className="fa-solid fa-heart"></i></button>
                    ) : c.tag.toLowerCase() === 'welfare' ? (
                      <button className="btn btn-outline-orange btn-sm" onClick={() => window.location.href = '#contact'}>
                        Request Counsel
                      </button>
                    ) : (
                      <button className="btn btn-outline-orange btn-sm">Join Campaign</button>
                    )}
                    <button className="btn btn-outline btn-sm">Details</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Campaigns;

