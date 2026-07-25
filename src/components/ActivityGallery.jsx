'use client';
import React, { useState, useEffect } from 'react';

// Helper function to extract YouTube ID
const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v');
  } else if (url.includes('youtube.com/embed/')) {
    return url;
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

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
        
        {/* Horizontal Stacked Filters */}
        <div className="gallery-filters-top">
          <div className="filter-group-horizontal">
            <button className={`filter-chip gallery-filter-btn ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All Media</button>
            <button className={`filter-chip gallery-filter-btn ${filterType === 'photo' ? 'active' : ''}`} onClick={() => setFilterType('photo')}><i className="fa-solid fa-image"></i> Photos</button>
            <button className={`filter-chip gallery-filter-btn ${filterType === 'video' ? 'active' : ''}`} onClick={() => setFilterType('video')}><i className="fa-solid fa-brands fa-youtube"></i> Videos</button>
          </div>
          
          <div className="filter-group-horizontal">
            <button className={`filter-chip gallery-year-btn ${filterYear === 'all' ? 'active' : ''}`} onClick={() => setFilterYear('all')}>All Years</button>
            {availableYears.map(year => (
              <button key={year} className={`filter-chip gallery-year-btn ${filterYear === year ? 'active' : ''}`} onClick={() => setFilterYear(year)}>
                {year}
              </button>
            ))}
          </div>
          
          <div className="filter-group-horizontal">
            <button className={`filter-chip gallery-month-btn ${filterMonth === 'all' ? 'active' : ''}`} onClick={() => setFilterMonth('all')}>All Months</button>
            {availableMonths.map(month => (
              <button key={month} className={`filter-chip gallery-month-btn ${filterMonth === month ? 'active' : ''}`} onClick={() => setFilterMonth(month)}>
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid" id="gallery-grid-container" style={{ marginTop: '30px' }}>
          {loading ? (
            <p className="text-center" style={{ width: '100%', padding: '40px' }}>Loading gallery...</p>
          ) : filteredMedia.length > 0 ? (
            filteredMedia.map(item => (
              <div key={item.id} className="gallery-item glass-card" style={{ padding: '10px' }}>
                {item.type === 'photo' ? (
                  <img src={item.url} alt={item.title} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '4px' }} />
                ) : (
                  <iframe 
                    src={getYoutubeEmbedUrl(item.url)} 
                    style={{ width: '100%', height: '220px', border: 'none', borderRadius: '4px' }} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                )}
                <div style={{ marginTop: '15px', padding: '0 5px 5px 5px' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'var(--primary-blue)', fontWeight: 700 }}>{item.title || 'Untitled'}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className="fa-regular fa-calendar"></i> {item.month} {item.year}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center" style={{ width: '100%', padding: '40px' }}>No media found for the selected filters.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ActivityGallery;
