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
  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : url;
};

const ActivityGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = Array.from({length: 10}, (_, i) => (new Date().getFullYear() - i).toString());

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filterType !== 'all') queryParams.append('type', filterType);
        if (filterYear !== 'all') queryParams.append('year', filterYear);
        if (filterMonth !== 'all') queryParams.append('month', filterMonth);
        
        const res = await fetch(`/api/gallery?${queryParams.toString()}`);
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
  }, [filterType, filterYear, filterMonth]);

  return (
    <section id="activity-gallery" className="gallery-section scroll-spy">
      <div className="container" style={{ maxWidth: '1400px' }}>
        <div className="section-title-wrapper text-center" style={{ marginBottom: '20px' }}>
          <span className="section-subtitle">Visual Archives</span>
          <h2 className="section-title">Our Activities</h2>
          <div className="title-underline"></div>
        </div>
        
        {/* Master Media Filters */}
        <div className="gallery-filters-top" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          
          {/* Type Filters */}
          <div className="filter-group-horizontal" style={{ background: 'rgba(11, 25, 44, 0.4)', padding: '8px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'inline-flex' }}>
            <button className={`filter-chip gallery-filter-btn ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All Media</button>
            <button className={`filter-chip gallery-filter-btn ${filterType === 'photo' ? 'active' : ''}`} onClick={() => setFilterType('photo')}><i className="fa-solid fa-image"></i> Photos</button>
            <button className={`filter-chip gallery-filter-btn ${filterType === 'video' ? 'active' : ''}`} onClick={() => setFilterType('video')}><i className="fa-solid fa-brands fa-youtube"></i> Videos</button>
          </div>
          
          {/* Year & Month Dropdowns */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <select 
              className="gallery-filter-select"
              value={filterYear} 
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="all">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            
            <select 
              className="gallery-filter-select"
              value={filterMonth} 
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option value="all">All Months</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Fixed Results Block */}
        <div className="gallery-fixed-container">
          {loading ? (
            <div className="loading-state" style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <i className="fa-solid fa-circle-notch fa-spin"></i>
              <p>Loading archives...</p>
            </div>
          ) : media.length > 0 ? (
            <div className="gallery-fixed-grid">
              {media.map(item => (
                <div key={item.id} className="netflix-card">
                  <div className="netflix-card-media">
                    {item.type === 'photo' ? (
                      <img src={item.url} alt={item.title} loading="lazy" />
                    ) : (
                      <div className="netflix-video-wrapper">
                        <iframe 
                          src={getYoutubeEmbedUrl(item.url)} 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                          title={item.title}
                        ></iframe>
                        <div className="video-overlay-blocker"></div>
                      </div>
                    )}
                    <div className="netflix-card-overlay">
                      <div className="overlay-content">
                        <div className="media-type-badge">
                          {item.type === 'photo' ? <i className="fa-solid fa-camera"></i> : <i className="fa-solid fa-play"></i>}
                        </div>
                        <h5 className="media-title">{item.title || 'Activity Archive'}</h5>
                        {item.type === 'video' && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm watch-btn">
                            Watch on YouTube
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <i className="fa-regular fa-folder-open"></i>
              <p>No visual archives found for this selection.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ActivityGallery;
