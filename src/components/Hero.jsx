'use client';
import React, { useState, useEffect } from 'react';
import { useModals } from '../context/ModalContext';
import fallbackHeroSlides from '../data/heroSlides.json';

const Hero = ({ initialSlides, initialStats }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState(initialSlides && initialSlides.length > 0 ? initialSlides : fallbackHeroSlides);
  const [heroStats, setHeroStats] = useState(initialStats && initialStats.length > 0 ? initialStats : [
    { value: '25+', label: 'Villages & Slums Impacted' },
    { value: '3+', label: 'States Presence (Odisha, Gujarat, NE)' },
    { value: '5+', label: 'Active Core Projects' },
    { value: '8+', label: 'Future Target Operations' }
  ]);
  const { openModal } = useModals();

  useEffect(() => {
    // If we didn't get initial slides, try fetching them client-side as fallback
    if (!initialSlides) {
      fetch('/api/hero')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) setHeroSlides(data);
        })
        .catch(err => console.error("Failed to load hero slides", err));
    }
  }, [initialSlides]);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  if (heroSlides.length === 0) return null;

  return (
    <section id="home" className="hero-section">
      <div className="carousel-container" id="hero-carousel-container">
        {heroSlides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          const bgPosStyle = slide.img.includes('farmers') ? 'center 25%' : 'center center';
          return (
            <div
              key={slide.id}
              className={`carousel-slide ${isActive ? 'active' : ''}`}
              style={{ backgroundImage: `url('${slide.img}')`, backgroundPosition: bgPosStyle }}
            >
              <div className="container hero-content-wrapper">
                <div className="hero-content glass-card">
                  <span className="hero-tagline">
                    <i className="fa-solid fa-users"></i> Together We Grow
                  </span>
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-desc">{slide.motto}</p>
                  <div className="hero-ctas">
                    <button className="btn btn-primary" onClick={() => openModal('donate')}>
                      Donate Now <i className="fa-solid fa-indian-rupee-sign"></i>
                    </button>
                    <button className="btn btn-secondary" onClick={() => window.location.href = '#work'}>
                      Explore Work
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <button
          className="carousel-nav prev"
          id="hero-prev"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button
          className="carousel-nav next"
          id="hero-next"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
        <div className="carousel-dots" id="hero-dots">
          {heroSlides.map((_, idx) => (
            <div
              key={idx}
              className={`carousel-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
      </div>

      <div className="stats-bar">
        <div className="container stats-container">
          {heroStats.map((stat, idx) => (
            <React.Fragment key={idx}>
              <div className="stat-item">
                <h3 className="stat-num">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
              {idx < heroStats.length - 1 && <div className="stat-divider"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

