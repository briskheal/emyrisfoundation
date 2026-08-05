import React from 'react';
import Link from 'next/link';
import { getWorkDetail, getCorporateData } from '../../../lib/data-fetcher';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { CorporateProvider } from '../../../context/CorporateContext';
import { ModalProvider } from '../../../context/ModalContext';
import Modals from '../../../components/Modals';

export const dynamic = 'force-dynamic';

export default async function WorkCategoryPage({ params }) {
  const { category } = await params; // e.g. 'education'
  const detailId = `work-${category}`;
  const data = await getWorkDetail(detailId);
  const corporateData = await getCorporateData();

  const getCurrentFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0 is Jan, 3 is Apr
    if (month >= 3) {
      return `${year.toString().slice(-2)}-${(year + 1).toString().slice(-2)}`;
    }
    return `${(year - 1).toString().slice(-2)}-${year.toString().slice(-2)}`;
  };
  const currentFy = getCurrentFinancialYear();

  if (!data) {
    return (
      <CorporateProvider initialData={corporateData}>
        <ModalProvider>
          <div className="container" style={{ paddingTop: '120px', textAlign: 'center', minHeight: '60vh' }}>
            <Header />
            <h2>Content not found</h2>
            <Link href="/" className="btn btn-outline">Back to Home</Link>
            <Footer />
          </div>
        </ModalProvider>
      </CorporateProvider>
    );
  }

  return (
    <CorporateProvider initialData={corporateData}>
      <ModalProvider>
        <Header />
        <main id="app-content" style={{ paddingTop: '80px' }}>
        {/* HERO BANNER */}
        <section className="work-detail-hero" style={{ 
          backgroundImage: `url('${data.bannerImg || `/Emyris Foundation Photos/emyris_hero_${category}.webp`}')`,
          aspectRatio: '3 / 1',
          width: '100%',
          height: 'auto',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
        </section>

        {/* SCROLLING TITLE TICKER */}
        <div className="ticker-wrapper">
          <div className="ticker-text">
            <span className="dot">•</span> {data.bannerTitle} <span className="dot">•</span> {data.bannerTitle} <span className="dot">•</span>
          </div>
        </div>

        {/* WHY SECTION */}
        <section className="work-detail-why" style={{ padding: '20px 0' }}>
          <div className="container">
            <div className="section-title-wrapper text-center" style={{ marginBottom: '10px' }}>
              <h2 className="section-title" style={{ fontSize: '1.8rem' }}>{data.whyTitle}</h2>
              <div className="title-underline"></div>
            </div>
            <div className="glass-card" style={{ padding: '15px', marginTop: '10px', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {data.whyText.split('\n').map((para, idx) => (
                <p key={idx} style={{ marginBottom: '15px', textAlign: 'justify' }}>{para}</p>
              ))}
            </div>
          </div>
        </section>

        {/* SDG GRID */}
        {data.sdgGrid && data.sdgGrid.length > 0 && (
          <section className="work-detail-grid" style={{ padding: '20px 0', backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <div className="container">
              <div className="section-title-wrapper text-center" style={{ marginBottom: '10px' }}>
                <h2 className="section-title" style={{ fontSize: '1.8rem' }}>What We Do</h2>
                <div className="title-underline"></div>
              </div>
              <div className="horizontal-scroll-container sdg-scroll">
                <div className="sdg-grid">
                  {data.sdgGrid.map((item, idx) => (
                    <div key={idx} className="glass-card sdg-card">
                      <h4>{item.title}</h4>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* REACH & PRESENCE */}
        {data.reachStats && data.reachStats.length > 0 && (
          <section className="work-detail-reach" style={{ padding: '20px 0' }}>
            <div className="container">
              <div className="section-title-wrapper text-center" style={{ marginBottom: '10px' }}>
                <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Reach & Presence</h2>
                <div className="title-underline"></div>
              </div>
              <div className="reach-stats-flex">
                {data.reachStats.map((stat, idx) => (
                  <div key={idx} className="reach-circle-container">
                    <div className="reach-circle" style={{ backgroundColor: stat.color }}>
                      <h3>{stat.count}</h3>
                    </div>
                    <p className="reach-label">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* IMPACT PHOTOS */}
        {data.impactMedia && data.impactMedia.length > 0 && (
          <section className="work-detail-impact" style={{ padding: '20px 0', backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <div className="container">
              <div className="section-title-wrapper text-center" style={{ marginBottom: '10px' }}>
                <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Impact {currentFy}</h2>
                <div className="title-underline"></div>
              </div>
              <div className="impact-gallery">
                {data.impactMedia.map((media, idx) => (
                  <div key={idx} className="impact-photo-card">
                    <img src={media.url} alt={`Impact ${idx}`} className="img-fluid" style={{ borderRadius: '8px' }} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TOGETHER WE ARE GROWING (TESTIMONIALS) */}
        {data.testimonials && data.testimonials.length > 0 && (
          <section className="work-detail-testimonials" style={{ padding: '20px 0' }}>
            <div className="container">
              <div className="section-title-wrapper text-center" style={{ marginBottom: '10px' }}>
                <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Together We Are Growing</h2>
                <div className="title-underline"></div>
              </div>
              <div className="horizontal-scroll-container">
                <div className="testimonial-flex">
                  {data.testimonials.map((t, idx) => (
                    <div key={idx} className="testimonial-card">
                      <i className="fa-solid fa-quote-left quote-icon" style={{ color: 'var(--primary-orange)', fontSize: '1.2rem', marginBottom: '5px' }}></i>
                      <p className="testi-text">"{t.text}"</p>
                      <h4 className="testi-author">- {t.name}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* VIDEOS */}
        {data.videos && data.videos.length > 0 && (
          <section className="work-detail-videos" style={{ padding: '20px 0', backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <div className="container">
              <div className="section-title-wrapper text-center" style={{ marginBottom: '10px' }}>
                <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Their Success, Our Happiness</h2>
                <div className="title-underline"></div>
              </div>
              <div className="horizontal-scroll-container">
                <div className="videos-flex">
                  {data.videos.map((vid, idx) => (
                    <div key={idx} className="video-card">
                      <iframe 
                        width="100%"
                        height="125"
                        src={vid.url}
                        title={vid.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                      </iframe>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <Modals />
      </ModalProvider>
    </CorporateProvider>
  );
}
