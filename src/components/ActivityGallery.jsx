'use client';
import React, { useState } from 'react';

const ActivityGallery = () => {
  const [filterType, setFilterType] = useState('all');

  return (
    <section id="activity-gallery" className="gallery-section scroll-spy">
      <div className="container">
        <div className="section-title-wrapper text-center">
          <span className="section-subtitle">Visual Archives</span>
          <h2 className="section-title">Activity Gallery</h2>
          <div className="title-underline"></div>
        </div>
        
        <div className="gallery-main-layout">
          <div className="gallery-filter-sidebar">
            <div className="filter-group">
              <span className="filter-label">Media Type</span>
              <button className={`filter-chip gallery-filter-btn ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All Media</button>
              <button className={`filter-chip gallery-filter-btn ${filterType === 'photo' ? 'active' : ''}`} onClick={() => setFilterType('photo')}><i className="fa-solid fa-image"></i> Photos</button>
              <button className={`filter-chip gallery-filter-btn ${filterType === 'video' ? 'active' : ''}`} onClick={() => setFilterType('video')}><i className="fa-solid fa-video"></i> Videos</button>
            </div>
            
            <div className="filter-group">
              <span className="filter-label">Year</span>
              <button className="filter-chip gallery-year-btn active" data-year="all">All Years</button>
              <button className="filter-chip gallery-year-btn" data-year="2026">2026</button>
              <button className="filter-chip gallery-year-btn" data-year="2025">2025</button>
            </div>
            
            <div className="filter-group">
              <span className="filter-label">Month</span>
              <button className="filter-chip gallery-month-btn active" data-month="all">All Months</button>
              <button className="filter-chip gallery-month-btn" data-month="June">June</button>
              <button className="filter-chip gallery-month-btn" data-month="May">May</button>
              <button className="filter-chip gallery-month-btn" data-month="April">April</button>
            </div>
          </div>

          <div className="gallery-grid" id="gallery-grid-container">
            {/* Gallery items would be loaded from JSON and filtered here */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivityGallery;

