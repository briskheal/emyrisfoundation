'use client';
import React, { useRef, useState, useEffect } from 'react';

export default function MediaScroller({ children }) {
  const scrollRef = useRef(null);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    // Check if scrollable
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        setShowControls(scrollWidth > clientWidth);
      }
    };
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', width: '100%', padding: '0 10px' }}>
      {showControls && (
        <button 
          onClick={scrollLeft}
          style={{ position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(235, 94, 40, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', transition: 'background 0.3s' }}
          className="d-none d-md-flex hover-opacity"
          aria-label="Scroll Left"
        >
          <i className="fa-solid fa-chevron-left" style={{ fontSize: '1.2rem' }}></i>
        </button>
      )}

      <div 
        ref={scrollRef} 
        className="horizontal-scroll-container" 
        style={{ overflowX: 'auto', scrollBehavior: 'smooth', paddingBottom: '20px' }}
      >
        {children}
      </div>

      {showControls && (
        <button 
          onClick={scrollRight}
          style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(235, 94, 40, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', transition: 'background 0.3s' }}
          className="d-none d-md-flex hover-opacity"
          aria-label="Scroll Right"
        >
          <i className="fa-solid fa-chevron-right" style={{ fontSize: '1.2rem' }}></i>
        </button>
      )}
    </div>
  );
}
