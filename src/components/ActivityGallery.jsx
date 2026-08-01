'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useModals } from '../context/ModalContext';

// Helper function to extract YouTube ID
const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?rel=0&modestbranding=1`;
  }
  return url;
};

// Helper function to strip leading hashtags from titles
const formatTitle = (title) => {
  if (!title) return 'Activity Archive';
  return title.replace(/^(?:#\S+\s*)+/, '').trim();
};

const ActivityGallery = () => {
  const { openModal } = useModals();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const scrollRef = useRef(null);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: Math.max(1, currentYear - 2024 + 1)}, (_, i) => (2024 + i).toString()).reverse();

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

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  const scrollUp = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ top: -300, behavior: 'smooth' });
  };

  const scrollDown = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ top: 300, behavior: 'smooth' });
  };

  return (
    <section id="activity-gallery" className="gallery-section scroll-spy">
      <div className="container" style={{ maxWidth: '1400px' }}>
        <div className="section-title-wrapper text-center" style={{ marginBottom: '12px' }}>
          <span className="section-subtitle" style={{ marginBottom: '2px', display: 'block' }}>Visual Archives</span>
          <h2 className="section-title" style={{ marginBottom: '4px', fontSize: '2.2rem', color: '#ffffff' }}>Our Activities</h2>
          <div className="title-underline" style={{ margin: '0 auto' }}></div>
        </div>
        
        {/* Master Media Filters */}
        <div className="gallery-filters-top" style={{ marginBottom: '8px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
          
          {/* Type Filters */}
          <div className="filter-group-horizontal" style={{ background: 'rgba(11, 25, 44, 0.4)', padding: '6px 10px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'inline-flex', gap: '6px' }}>
            <button className={`filter-chip gallery-filter-btn ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All Media</button>
            <button className={`filter-chip gallery-filter-btn ${filterType === 'photo' ? 'active' : ''}`} onClick={() => setFilterType('photo')}><i className="fa-solid fa-image"></i> Photos</button>
            <button className={`filter-chip gallery-filter-btn ${filterType === 'video' ? 'active' : ''}`} onClick={() => setFilterType('video')}><i className="fa-solid fa-brands fa-youtube"></i> Videos</button>
          </div>
          
          {/* Year & Month Dropdowns */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select 
              className="gallery-filter-select"
              value={filterYear} 
              onChange={(e) => setFilterYear(e.target.value)}
              style={{ padding: '6px 14px', margin: 0 }}
            >
              <option value="all">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            
            <select 
              className="gallery-filter-select"
              value={filterMonth} 
              onChange={(e) => setFilterMonth(e.target.value)}
              style={{ padding: '6px 14px', margin: 0 }}
            >
              <option value="all">All Months</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Fixed Results Block */}
        <div className="gallery-fixed-container" style={{ position: 'relative' }}>
          {loading ? (
            <div className="loading-state" style={{ height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <i className="fa-solid fa-circle-notch fa-spin"></i>
              <p>Loading archives...</p>
            </div>
          ) : media.length > 0 ? (
            <>
              {media.length > 3 && (
                <>
                  <button className="gallery-nav-btn left hide-on-mobile" onClick={scrollLeft} title="Scroll Left">
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button className="gallery-nav-btn up show-on-mobile" onClick={scrollUp} title="Scroll Up">
                    <i className="fa-solid fa-chevron-up"></i>
                  </button>
                </>
              )}
              
              <div className="gallery-fixed-track" ref={scrollRef}>
                {media.map(item => (
                  <div 
                    key={item.id} 
                    className="gallery-card"
                    onClick={() => item.type === 'photo' && openModal('lightbox', { url: item.url, title: formatTitle(item.title) })}
                    style={{ cursor: item.type === 'photo' ? 'zoom-in' : 'default' }}
                    title={item.type === 'photo' ? 'Click to expand' : ''}
                  >
                    <div className="gallery-card-media">
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
                      
                      {/* Only show badge inside overlay, remove title from here */}
                      <div className="netflix-card-overlay">
                        <div className="overlay-content">
                          <div className="media-type-badge">
                            {item.type === 'photo' ? <i className="fa-solid fa-camera"></i> : <i className="fa-solid fa-play"></i>}
                          </div>
                          {item.type === 'video' && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm watch-btn" style={{ marginTop: '10px' }}>
                              Watch on YouTube
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Title permanently below the image */}
                    <div className="gallery-card-info">
                      <h5 className="gallery-card-title" title={formatTitle(item.title)}>{formatTitle(item.title)}</h5>
                    </div>
                  </div>
                ))}
              </div>

              {media.length > 3 && (
                <>
                  <button className="gallery-nav-btn right hide-on-mobile" onClick={scrollRight} title="Scroll Right">
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                  <button className="gallery-nav-btn down show-on-mobile" onClick={scrollDown} title="Scroll Down">
                    <i className="fa-solid fa-chevron-down"></i>
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="empty-state" style={{ height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
