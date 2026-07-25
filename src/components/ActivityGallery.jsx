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

const monthOrder = {
  "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
  "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
};

const ActivityGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

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

  // Filter media based on selected media type
  const filteredMedia = media.filter(m => filterType === 'all' || m.type === filterType);

  // Group by Year -> Month
  const groupedMedia = filteredMedia.reduce((acc, item) => {
    if (!acc[item.year]) acc[item.year] = {};
    if (!acc[item.year][item.month]) acc[item.year][item.month] = [];
    acc[item.year][item.month].push(item);
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedMedia).sort((a, b) => b.localeCompare(a));

  return (
    <section id="activity-gallery" className="gallery-section scroll-spy">
      <div className="container" style={{ maxWidth: '1400px' }}>
        <div className="section-title-wrapper text-center">
          <span className="section-subtitle">Visual Archives</span>
          <h2 className="section-title">Our Activities</h2>
          <div className="title-underline"></div>
        </div>
        
        {/* Master Media Filter */}
        <div className="gallery-filters-top" style={{ marginBottom: '40px' }}>
          <div className="filter-group-horizontal" style={{ background: 'rgba(11, 25, 44, 0.4)', padding: '10px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <button className={`filter-chip gallery-filter-btn ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All Media</button>
            <button className={`filter-chip gallery-filter-btn ${filterType === 'photo' ? 'active' : ''}`} onClick={() => setFilterType('photo')}><i className="fa-solid fa-image"></i> Photos</button>
            <button className={`filter-chip gallery-filter-btn ${filterType === 'video' ? 'active' : ''}`} onClick={() => setFilterType('video')}><i className="fa-solid fa-brands fa-youtube"></i> Videos</button>
          </div>
        </div>

        {/* Netflix Style Rows */}
        <div className="netflix-archive-container">
          {loading ? (
            <div className="loading-state">
              <i className="fa-solid fa-circle-notch fa-spin"></i>
              <p>Loading archives...</p>
            </div>
          ) : sortedYears.length > 0 ? (
            sortedYears.map(year => {
              const sortedMonths = Object.keys(groupedMedia[year]).sort((a, b) => monthOrder[b] - monthOrder[a]);
              return (
                <div key={year} className="netflix-year-block">
                  <h3 className="netflix-year-title">{year} Overview</h3>
                  
                  {sortedMonths.map(month => (
                    <div key={`${year}-${month}`} className="netflix-month-row">
                      <h4 className="netflix-row-title">{month} <span className="netflix-row-count">({groupedMedia[year][month].length})</span></h4>
                      
                      <div className="netflix-track-wrapper">
                        <button className="netflix-scroll-btn prev" onClick={(e) => {
                          const track = e.currentTarget.nextElementSibling;
                          track.scrollBy({ left: -400, behavior: 'smooth' });
                        }}>
                          <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        
                        <div className="netflix-track">
                          {groupedMedia[year][month].map(item => (
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
                        
                        <button className="netflix-scroll-btn next" onClick={(e) => {
                          const track = e.currentTarget.previousElementSibling;
                          track.scrollBy({ left: 400, behavior: 'smooth' });
                        }}>
                          <i className="fa-solid fa-chevron-right"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <i className="fa-regular fa-folder-open"></i>
              <p>No visual archives found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ActivityGallery;
