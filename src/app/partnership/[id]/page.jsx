import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { notFound } from 'next/navigation';
import { Partnership } from '../../../lib/db';
import { getCorporateData } from '../../../lib/data-fetcher';
import { CorporateProvider } from '../../../context/CorporateContext';
import { ModalProvider } from '../../../context/ModalContext';
import Modals from '../../../components/Modals';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

const getResponsiveSize = (sizeStr) => {
  if (sizeStr === '1.5rem') return 'clamp(1.2rem, 2vw, 1.5rem)';
  if (sizeStr === '2.5rem') return 'clamp(1.5rem, 3vw, 2rem)';
  if (sizeStr === '4.5rem') return 'clamp(2rem, 5vw, 3rem)';
  if (sizeStr === '5.5rem') return 'clamp(2.2rem, 6vw, 3.5rem)';
  return 'clamp(1.8rem, 4vw, 2.5rem)';
};

export default async function PartnershipDetailPage({ params }) {
  const { id } = await params;
  
  const partnership = await Partnership.findByPk(id);
  if (!partnership) return notFound();

  const corpData = await getCorporateData();

  return (
    <CorporateProvider initialData={corpData}>
      <ModalProvider>
        <Header />
        <div style={{ paddingTop: '80px', minHeight: '80vh', background: 'var(--bg-light)' }}>
        
        {/* Banner Section (Image Only) */}
        {partnership.bannerImg && (
          <div style={{ width: '100%', aspectRatio: '3 / 1', position: 'relative' }}>
            <Image 
              src={partnership.bannerImg} 
              alt={partnership.title} 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}

        {/* Content Section */}
        <div className="container" style={{ paddingTop: partnership.bannerImg ? '60px' : '100px', paddingBottom: '80px' }}>
          
          <div style={{ 
            maxWidth: '900px',
            margin: '0 auto 40px auto',
            textAlign: 'left'
          }}>
            <h1 style={{ color: 'var(--primary-blue)', fontSize: getResponsiveSize(partnership.titleSize), margin: '0 0 10px 0', fontFamily: 'var(--font-title)', lineHeight: 1.2 }}>
              {partnership.title}
            </h1>
          </div>

          <div style={{ 
            background: 'white', 
            padding: '40px', 
            borderRadius: '16px', 
            boxShadow: 'var(--glass-shadow)',
            maxWidth: '900px',
            margin: '0 auto',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'var(--text-dark)'
          }}>
            <div 
              className="rich-text-content"
              dangerouslySetInnerHTML={{ __html: partnership.content }} 
            />
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link href="/#partnerships" className="btn btn-primary" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}>
              &larr; Back to Partnerships
            </Link>
          </div>
        </div>
      </div>
        <Footer />
        <Modals />
      </ModalProvider>
    </CorporateProvider>
  );
}
