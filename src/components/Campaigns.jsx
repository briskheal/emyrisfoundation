'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModals } from '../context/ModalContext';
import fallbackCampaigns from '../data/campaigns.json';

const Campaigns = ({ initialCampaigns }) => {
  const { openModal } = useModals();
  const [campaigns, setCampaigns] = useState(initialCampaigns && initialCampaigns.length > 0 ? initialCampaigns : fallbackCampaigns);
  const [activeTab, setActiveTab] = useState(campaigns[0]?.id || '');

  useEffect(() => {
    if (!initialCampaigns) {
      fetch('/api/campaigns')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setCampaigns(data);
            if (!activeTab) setActiveTab(data[0].id);
          }
        })
        .catch(err => console.error("Failed to load campaigns", err));
    } else if (initialCampaigns.length > 0 && !activeTab) {
      setActiveTab(initialCampaigns[0].id);
    }
  }, [initialCampaigns, activeTab]);

  useEffect(() => {
    // Check URL parameters when component mounts or URL changes
    const checkUrlParams = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const campTab = params.get('campTab');
        if (campTab && campaigns.some(c => c.id === campTab)) {
          setActiveTab(campTab);
        }
      }
    };
    
    checkUrlParams();
    window.addEventListener('hashchange', checkUrlParams);
    window.addEventListener('popstate', checkUrlParams);

    const handleCustomTabChange = (e) => {
      if (e.detail?.type === 'campaigns' && campaigns.some(c => c.id === e.detail.tabId)) {
        setActiveTab(e.detail.tabId);
      }
    };
    window.addEventListener('changeTab', handleCustomTabChange);
    
    return () => {
      window.removeEventListener('hashchange', checkUrlParams);
      window.removeEventListener('popstate', checkUrlParams);
      window.removeEventListener('changeTab', handleCustomTabChange);
    };
  }, [campaigns]);

  const tagColors = {
    "health": "red",
    "education": "blue",
    "welfare": "purple",
    "environment": "green",
    "social security": "teal"
  };
  
  const iconMap = {
    "health": "fa-heart-pulse",
    "education": "fa-graduation-cap",
    "welfare": "fa-hands-holding-child",
    "environment": "fa-leaf",
    "social security": "fa-shield-halved"
  };

  return (
    <section id="campaigns" className="campaign-section scroll-spy">
      <div className="container">
        <div className="section-title-wrapper text-center">
          <span className="section-subtitle">Join Our Actions</span>
          <h2 className="section-title">Ongoing Campaigns</h2>
          <div className="title-underline"></div>
        </div>

        {/* Tab Selectors */}
        <div className="work-tabs" id="campaign-tab-selectors" style={{ marginBottom: '40px' }}>
          {campaigns.map((c) => (
            <button
              key={c.id}
              className={`work-tab-btn ${activeTab === c.id ? 'active' : ''}`}
              onClick={() => setActiveTab(c.id)}
            >
              <i className={`fa-solid ${iconMap[c.tag.toLowerCase()] || 'fa-bullhorn'}`}></i> {c.title}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="work-tab-contents" id="campaign-tab-panels">
          {campaigns.map((c) => {
            if (activeTab !== c.id) return null;
            
            const tagClass = tagColors[c.tag.toLowerCase()] || "";
            const imageSrc = c.photo ? c.photo : c.img;

            return (
              <div key={c.id} className="work-panel active" id={`camp-${c.id}`}>
                <div className="work-panel-grid">
                  <div className="panel-info">
                    <span className="motto">"{c.motto}"</span>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                    
                    <div className="camp-actions" style={{ marginTop: '25px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                      {c.tag.toLowerCase() === 'education' ? (
                        <button className="btn btn-primary" onClick={() => openModal('donate')}>
                          Donate <i className="fa-solid fa-heart" style={{marginLeft: '5px'}}></i>
                        </button>
                      ) : c.tag.toLowerCase() === 'welfare' ? (
                        <button className="btn btn-outline-orange" onClick={() => window.location.href = '#contact'}>
                          Request Counsel
                        </button>
                      ) : (
                        <button className="btn btn-outline-orange" onClick={() => openModal('consent', c.title)}>
                          Join Campaign
                        </button>
                      )}
                      <Link href={`/campaigns/${c.id}`} className="btn btn-outline">
                        View Details <i className="fa-solid fa-arrow-right" style={{marginLeft: '5px'}}></i>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="panel-visual">
                    <Image src={imageSrc} alt={c.title} className="panel-img" fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
                    <div className={`panel-stat-bubble ${tagClass}`}>
                      <h4>Active</h4>
                      <p>{c.tag}</p>
                    </div>
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

