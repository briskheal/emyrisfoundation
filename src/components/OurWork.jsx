'use client';
import React, { useState, useEffect } from 'react';
import fallbackWork from '../data/work.json';

const OurWork = ({ initialWork }) => {
  const [workList, setWorkList] = useState(initialWork && initialWork.length > 0 ? initialWork : fallbackWork);
  const [activeTab, setActiveTab] = useState(workList[0]?.id || '');

  useEffect(() => {
    if (!initialWork) {
      fetch('/api/work')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setWorkList(data);
            setActiveTab(data[0].id);
          }
        })
        .catch(err => console.error("Failed to load work", err));
    }
  }, [initialWork]);

  const iconMap = {
    "work-education": "fa-graduation-cap",
    "work-health": "fa-heart-pulse",
    "work-livelihood": "fa-briefcase",
    "work-women": "fa-venus",
    "work-farmers": "fa-tractor"
  };

  const colorMap = {
    "work-education": "",
    "work-health": "blue",
    "work-livelihood": "",
    "work-women": "blue",
    "work-farmers": "green"
  };

  return (
    <section id="work" className="work-section scroll-spy">
      <div className="container">
        <div className="section-title-wrapper text-center">
          <span className="section-subtitle">What We Do</span>
          <h2 className="section-title">Core Program Initiatives</h2>
          <div className="title-underline"></div>
          <p className="section-desc">
            Emyris Foundation works in alignment with the UN Sustainable Development Goals (SDGs) to make structured, measurable impact in five key areas.
          </p>
        </div>

        <div className="work-tabs" id="work-tab-selectors">
          {workList.map((w) => (
            <button
              key={w.id}
              className={`work-tab-btn ${activeTab === w.id ? 'active' : ''}`}
              onClick={() => setActiveTab(w.id)}
            >
              <i className={`fa-solid ${iconMap[w.id] || 'fa-leaf'}`}></i> {w.title}
            </button>
          ))}
        </div>

        <div className="work-tab-contents" id="work-tab-panels">
          {workList.map((w) => {
            if (activeTab !== w.id) return null;
            return (
              <div key={w.id} className="work-panel active" id={w.id}>
                <div className="work-panel-grid">
                  <div className="panel-info">
                    <span className="motto">"{w.motto}"</span>
                    <h3>{w.title} Core Initiatives</h3>
                    <p>{w.desc}</p>
                    <ul className="work-bullets">
                      {w.bullets.map((b, idx) => (
                        <li key={idx}>
                          <i className={`fa-solid fa-check ${w.id.includes('health') || w.id.includes('women') ? 'text-blue' : w.id.includes('farmers') ? 'text-green' : 'text-orange'}`}></i> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="panel-visual">
                    <img src={w.img} alt={w.title} className="panel-img" />
                    <div className={`panel-stat-bubble ${colorMap[w.id] || ''}`}>
                      <h4>{w.statVal}</h4>
                      <p>{w.statLbl}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="impact-testimonial glass-card mt-5" style={{marginTop: '30px'}}>
          <div className="testimonial-header">
            <i className="fa-solid fa-quote-left quote-icon"></i>
            <h4>Stories of Success &amp; Growth</h4>
          </div>
          <div className="slider-testimonial" id="testimonial-slider">
            <div className="testi-slide active">
              <p>"Happy to learn and now I can put my signature in place of my thumb impression. Education has given me respect."</p>
              <span className="testi-author">- Rani, Slum Education Program (Odisha)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurWork;

