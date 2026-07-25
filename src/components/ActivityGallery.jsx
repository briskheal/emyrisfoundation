'use client';
import React, { useState, useEffect } from 'react';

const ActivityGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filterType, setFilterType] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          setMedia(data || []);
        }
      } catch (err) {
        console.error('Failed to load gallery', err);
      }
      setLoading(false);
    };
    fetchGallery();
  }, []);

  // Derive dynamic filters from the fetched media
  const availableYears = [...new Set(media.map(m => m.year))].sort((a, b) => b.localeCompare(a));
  const availableMonths = [...new Set(media.map(m => m.month))]; // Could sort by month index

  // Filter media based on selected filters
  const filteredMedia = media.filter(m => {
    if (filterType !== 'all' && m.type !== filterType) return false;
    if (filterYear !== 'all' && m.year !== filterYear) return false;
    if (filterMonth !== 'all' && m.month !== filterMonth) return false;
    return true;
  });

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
              <button className={`filter-chip gallery-year-btn ${filterYear === 'all' ? 'active' : ''}`} onClick={() => setFilterYear('all')}>All Years</button>
              {availableYears.map(year => (
                <button key={year} className={`filter-chip gallery-year-btn ${filterYear === year ? 'active' : ''}`} onClick={() => setFilterYear(year)}>
                  {year}
                </button>
              ))}
            </div>
            
            <div className="filter-group">
              <span className="filter-label">Month</span>
              <button className={`filter-chip gallery-month-btn ${filterMonth === 'all' ? 'active' : ''}`} onClick={() => setFilterMonth('all')}>All Months</button>
              {availableMonths.map(month => (
                <button key={month} className={`filter-chip gallery-month-btn ${filterMonth === month ? 'active' : ''}`} onClick={() => setFilterMonth(month)}>
                  {month}
                </button>
              ))}
            </div>
          </div>

          <div className="gallery-grid" id="gallery-grid-container">
            {loading ? (
              <p>Loading gallery...</p>
            ) : filteredMedia.length > 0 ? (
              filteredMedia.map(item => (
                <div key={item.id} className="gallery-item glass-card" style={{ padding: '10px' }}>
                  {item.type === 'photo' ? (
                    <img src={item.url} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : (
                    <video src={item.url} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} controls />
                  )}
                  <div style={{ marginTop: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-blue)' }}>{item.title || 'Untitled'}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.month} {item.year}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No media found for the selected filters.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivityGallery;
