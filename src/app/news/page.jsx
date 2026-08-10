'use client';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { CorporateProvider } from '../../context/CorporateContext';
import { ModalProvider } from '../../context/ModalContext';

const NewsPage = () => {
  const [corporateData, setCorporateData] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  
  // Read More Modal
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    // Fetch corporate data for Header/Footer
    fetch('/api/corporate', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setCorporateData(data))
      .catch(err => console.error(err));

    // Fetch news
    fetch('/api/news', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setNews(data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Filter options
  const months = [...new Set(news.map(n => n.month))].filter(Boolean);
  const years = [...new Set(news.map(n => n.year))].filter(Boolean);

  const filteredNews = news.filter(n => {
    let match = true;
    if (selectedMonth && n.month !== selectedMonth) match = false;
    if (selectedYear && n.year !== selectedYear) match = false;
    return match;
  });

  return (
    <CorporateProvider initialData={corporateData}>
      <ModalProvider>
        <Header />
        
        <main id="app-content" style={{ background: '#0b192c', minHeight: '100vh', color: '#fff', paddingTop: '80px' }}>
          
          <div style={{ width: '100%', aspectRatio: '3 / 1', position: 'relative' }}>
            <Image 
              src={corporateData?.newsBanner || '/images/hero-shiksha.webp'} 
              alt="News & Updates Banner" 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          {/* SCROLLING TITLE TICKER */}
          <div className="ticker-wrapper">
            <div className="ticker-text" style={{ animationDuration: '24.3s' }}>
              <span className="dot">•</span> Follow our Daily Journey and Activities. Together We Grow. <span className="dot">•</span> Follow our Daily Journey and Activities. Together We Grow. <span className="dot">•</span>
            </div>
          </div>

          {/* MAIN CONTENT SECTION */}
          <section style={{ padding: '60px 0' }}>
            <div className="container">
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-title)' }}>Activity Reports</h2>
                
                {/* FILTERS */}
                <div style={{ display: 'flex', gap: '15px' }}>
                  <select 
                    value={selectedMonth} 
                    onChange={e => setSelectedMonth(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 15px', borderRadius: '8px', outline: 'none' }}
                  >
                    <option value="" style={{ color: '#000' }}>All Months</option>
                    {months.map(m => (
                      <option key={m} value={m} style={{ color: '#000' }}>{m}</option>
                    ))}
                  </select>
                  <select 
                    value={selectedYear} 
                    onChange={e => setSelectedYear(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 15px', borderRadius: '8px', outline: 'none' }}
                  >
                    <option value="" style={{ color: '#000' }}>All Years</option>
                    {years.map(y => (
                      <option key={y} value={y} style={{ color: '#000' }}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* VERTICAL SCROLLABLE FEED CONTAINER */}
              <div style={{ 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '16px',
                padding: '20px',
                height: '70vh', // Takes up most of the screen height
                overflowY: 'auto', // Vertical scrollbar when content is long
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--primary-orange) rgba(255,255,255,0.1)'
              }}>
                {loading ? (
                  <div className="text-center" style={{ color: 'rgba(255,255,255,0.5)', padding: '40px' }}>Loading activities...</div>
                ) : filteredNews.length === 0 ? (
                  <div className="text-center" style={{ color: 'rgba(255,255,255,0.5)', padding: '40px' }}>No activities found for the selected dates.</div>
                ) : (
                  filteredNews.map(item => (
                    <div key={item.id} className="glass-card" style={{ background: 'rgba(30, 62, 98, 0.4)', borderColor: 'rgba(255,255,255,0.1)', padding: '15px', borderLeft: '4px solid var(--primary-orange)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: '15px', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', lineHeight: '1.4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h3>
                        <span style={{ color: '#15F5BA', fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                          <i className="fa-regular fa-calendar" style={{ marginRight: '6px' }}></i>
                          {item.activityDate ? new Date(item.activityDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                        </span>
                      </div>
                      
                      {/* Show snippet of content */}
                      <div 
                        style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.5, maxHeight: '43px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                      
                      <button 
                        onClick={() => setSelectedNews(item)}
                        className="btn btn-outline-orange btn-sm" 
                        style={{ marginTop: '15px', padding: '4px 10px', fontSize: '0.8rem' }}
                      >
                        Read More <i className="fa-solid fa-arrow-right" style={{ marginLeft: '5px' }}></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
        
        {/* READ MORE MODAL */}
        {selectedNews && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            background: 'rgba(0,0,0,0.85)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: '#0b192c', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', width: '100%', maxWidth: '800px',
              maxHeight: '90vh', display: 'flex', flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }}>
              <style>{`
                .news-modal-content {
                  color: rgba(255,255,255,0.9) !important;
                }
                .news-modal-content * {
                  color: rgba(255,255,255,0.9) !important;
                  background-color: transparent !important;
                }
                .news-modal-content a {
                  color: var(--primary-orange) !important;
                  text-decoration: underline;
                }
              `}</style>
              <div style={{ padding: '25px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: 'var(--primary-orange)' }}>{selectedNews.title}</h3>
                <button onClick={() => setSelectedNews(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>
                  &times;
                </button>
              </div>
              <div className="news-modal-content" style={{ padding: '30px', overflowY: 'auto', lineHeight: 1.7, color: 'rgba(255,255,255,0.9)' }} dangerouslySetInnerHTML={{ __html: selectedNews.content || '<p>No details provided.</p>' }}></div>
              <div style={{ padding: '20px 25px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                Activity Date: {selectedNews.activityDate ? new Date(selectedNews.activityDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
              </div>
            </div>
          </div>
        )}
      </ModalProvider>
    </CorporateProvider>
  );
};

export default NewsPage;
