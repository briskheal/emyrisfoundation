import React from 'react';
import Link from 'next/link';
import { getCampaignDetail, getCorporateData } from '../../../lib/data-fetcher';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { CorporateProvider } from '../../../context/CorporateContext';
import { ModalProvider } from '../../../context/ModalContext';
import Modals from '../../../components/Modals';
import CampaignDetailForm from '../../../components/CampaignDetailForm';
import ShikshaDonationForm from '../../../components/ShikshaDonationForm';

export const dynamic = 'force-dynamic';

export default async function CampaignPage({ params }) {
  const { id } = await params; // e.g. 'blood', 'shiksha'
  const data = await getCampaignDetail(id);
  const corporateData = await getCorporateData();

  if (!data) {
    return (
      <CorporateProvider initialData={corporateData}>
        <ModalProvider>
          <div className="container" style={{ paddingTop: '120px', textAlign: 'center', minHeight: '60vh' }}>
            <Header />
            <h2>Campaign not found</h2>
            <Link href="/" className="btn btn-outline" style={{ marginTop: '20px' }}>Back to Home</Link>
            <Footer />
            <Modals />
          </div>
        </ModalProvider>
      </CorporateProvider>
    );
  }

  const isBlood = id === 'blood' || id === 'campaign-blood';

  // Map default hero background images for visual aesthetics
  const getHeroImg = (campId) => {
    switch(campId) {
      case 'blood':
      case 'campaign-blood':
        return '/Emyris Foundation Photos/blood-donor-day-poster-with-heart-blood-drop_1017-25357.webp';
      case 'shiksha':
        return '/Emyris Foundation Photos/modern-hand-drawn-education-concept_23-2147906438.avif';
      case 'organ':
        return '/Emyris Foundation Photos/low-angle-hands-holding-heart-shape-with-sky_23-2148635107.webp';
      case 'plantation':
        return '/Emyris Foundation Photos/environment-concept_23-2147517224.webp';
      default:
        return '/Emyris Foundation Photos/hands-composition-about-support_23-2150510481.webp';
    }
  };

  const heroBg = getHeroImg(id);

  return (
    <CorporateProvider initialData={corporateData}>
      <ModalProvider>
        <Header />
        <main id="app-content" style={{ background: '#0b192c', minHeight: '100vh', color: '#fff' }}>
          {/* HERO BANNER */}
          <section className="work-detail-hero" style={{ backgroundImage: `url('${heroBg}')`, position: 'relative' }}>
            <div className="work-hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(11,25,44,0.65) 0%, rgba(11,25,44,0.95) 100%)', padding: '120px 0 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '320px' }}>
              <div className="container text-center">
                <span className="section-subtitle" style={{ color: 'var(--primary-orange)', display: 'inline-block', marginBottom: '8px', fontSize: '1rem', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '700' }}>
                  {data.motto}
                </span>
                <h1 className="hero-title" style={{ fontSize: '2.8rem', color: '#ffffff', marginBottom: '15px', fontWeight: '800' }}>
                  {data.title}
                </h1>
                {data.bannerMsg && (
                  <p style={{ maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                    {data.bannerMsg}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* MAIN NARRATIVE + LIVE REGISTRATION FORM (SIDE-BY-SIDE) */}
          <section style={{ padding: '40px 0 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '40px', alignItems: 'stretch' }}>
                
                {/* Left Column: Campaign Narrative */}
                <div className="campaign-narrative" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <span className="section-subtitle" style={{ color: 'var(--primary-orange)', fontSize: '0.85rem' }}>Overview & Impact</span>
                    <h2 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>
                      {isBlood ? 'Every Drop is a Testament to Life' : 'Driving Transformation Together'}
                    </h2>
                    <div className="title-underline" style={{ margin: '0 0 15px 0' }}></div>
                  </div>

                  <div className="glass-card" style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', fontSize: '1rem', lineHeight: '1.7', color: 'rgba(255,255,255,0.9)', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flexGrow: 1 }}>
                      {data.introText ? data.introText.split('\n\n').map((para, idx) => (
                        <p key={idx} style={{ marginBottom: '16px', textAlign: 'justify', opacity: '0.92' }}>{para}</p>
                      )) : null}
                    </div>
                    
                    <div style={{ background: 'rgba(235, 94, 40, 0.1)', borderLeft: '4px solid var(--primary-orange)', padding: '15px 20px', borderRadius: '4px', marginTop: '20px' }}>
                      <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: '#ffffff' }}>
                        {isBlood 
                          ? '“Come and shower your love in saving someone’s life. Join hands and fill up the consent form to coordinate your invitation.”' 
                          : '“Your participation builds resilient communities. Join hands and sign up today.”'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Embedded Registration Form */}
                <div className="campaign-form-column" id="consent-section" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {id === 'shiksha' ? (
                    <ShikshaDonationForm />
                  ) : (
                    <CampaignDetailForm campaignTitle={data.title} isBloodCampaign={isBlood} campaignId={id} />
                  )}
                </div>
              </div>

              {/* Go Back Button */}
              <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <Link href="/#campaigns" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.95rem' }}>
                  <i className="fa-solid fa-arrow-left"></i> Go Back to Campaigns
                </Link>
              </div>
            </div>
          </section>

          {/* WHY VOLUNTEERS SHOULD DONATE / PARTICIPATE */}
          {data.whyGrid && data.whyGrid.length > 0 && (
            <section style={{ padding: '35px 0', backgroundColor: 'rgba(0,0,0,0.25)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="container">
                <div className="section-title-wrapper text-center" style={{ marginBottom: '15px' }}>
                  <span className="section-subtitle">Core Motivators</span>
                  <h2 className="section-title" style={{ fontSize: '2.1rem', color: '#ffffff', marginBottom: '6px' }}>{data.whyTitle || 'Why You Should Participate'}</h2>
                  <div className="title-underline" style={{ margin: '0 auto' }}></div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
                  {data.whyGrid.map((item, idx) => (
                    <div key={idx} className="glass-card sdg-card" style={{ flex: '1 1 200px', maxWidth: '300px', padding: '22px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(235, 94, 40, 0.2)', color: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '14px' }}>
                        0{idx + 1}
                      </div>
                      <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px' }}>{item.title}</h4>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0, textAlign: 'justify', flex: 1 }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* VISUAL ARCHIVES ("Blood: The Universal Bond") */}
          {data.galleryPhotos && data.galleryPhotos.length > 0 && (
            <section style={{ padding: '35px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="container">
                <div className="section-title-wrapper text-center" style={{ marginBottom: '15px' }}>
                  <span className="section-subtitle">Visual Archives</span>
                  <h2 className="section-title" style={{ fontSize: '2.1rem', color: '#ffffff', marginBottom: '6px' }}>
                    {data.galleryTitle || (isBlood ? '"Blood: The Universal Bond"' : 'Campaign Photographs')}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', marginBottom: '8px' }}>
                    {data.gallerySubtitle || (isBlood ? 'Photographs on Blood Donation with scroll option for our future camp captures.' : 'Moments captured during our recent drives and community workshops.')}
                  </p>
                  <div className="title-underline" style={{ margin: '0 auto' }}></div>
                </div>

                <div className="impact-gallery" style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '15px' }}>
                  {data.galleryPhotos.map((photo, idx) => (
                    <div key={idx} className="impact-photo-card" style={{ minWidth: '320px', maxWidth: '380px', flex: '0 0 auto', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <img src={photo.url} alt={photo.title || `Gallery ${idx}`} style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
                      {photo.title && (
                        <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '0.95rem', fontWeight: '600' }}>
                          <i className="fa-solid fa-camera" style={{ color: 'var(--primary-orange)', marginRight: '8px' }}></i> {photo.title}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* VIDEOS IN MOTION */}
          {data.videos && data.videos.length > 0 && (
            <section style={{ padding: '35px 0', backgroundColor: 'rgba(0,0,0,0.25)' }}>
              <div className="container">
                <div className="section-title-wrapper text-center" style={{ marginBottom: '15px' }}>
                  <span className="section-subtitle">Video Archives</span>
                  <h2 className="section-title" style={{ fontSize: '2.1rem', color: '#ffffff', marginBottom: '6px' }}>
                    {data.videoTitle || (isBlood ? 'Blood Donation in Motion' : 'Campaign Stories in Motion')}
                  </h2>
                  {data.videoSubtitle && (
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', marginBottom: '8px' }}>
                      {data.videoSubtitle}
                    </p>
                  )}
                  <div className="title-underline" style={{ margin: '0 auto' }}></div>
                </div>

                <div className="horizontal-scroll-container">
                  <div className="videos-flex">
                    {data.videos.map((vid, idx) => (
                      <div key={idx} className="video-card">
                        <iframe 
                          width="100%" 
                          height="200" 
                          src={vid.url} 
                          title={vid.title || `Video ${idx}`} 
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
