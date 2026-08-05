import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { notFound } from 'next/navigation';
import { Blog } from '../../../lib/db';
import { getCorporateData } from '../../../lib/data-fetcher';
import { CorporateProvider } from '../../../context/CorporateContext';
import { ModalProvider } from '../../../context/ModalContext';
import Modals from '../../../components/Modals';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

const getResponsiveSize = (sizeStr) => {
  if (sizeStr === '1.5rem') return 'clamp(1.2rem, 2vw, 1.5rem)'; // Smallest
  if (sizeStr === '2.5rem') return 'clamp(1.5rem, 3vw, 2rem)'; // Small
  if (sizeStr === '4.5rem') return 'clamp(2rem, 5vw, 3rem)'; // Large
  if (sizeStr === '5.5rem') return 'clamp(2.2rem, 6vw, 3.5rem)'; // Huge
  return 'clamp(1.8rem, 4vw, 2.5rem)'; // Normal/Default
};

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  
  const blog = await Blog.findByPk(id);
  if (!blog) return notFound();

  const corpData = await getCorporateData();

  return (
    <CorporateProvider initialData={corpData}>
      <ModalProvider>
        <Header />
        <div style={{ paddingTop: '80px', minHeight: '80vh', background: 'var(--bg-light)' }}>
        
        {/* Banner Section (Image Only) */}
        {blog.bannerImg && (
          <div style={{ width: '100%', aspectRatio: '3 / 1', position: 'relative' }}>
            <Image 
              src={blog.bannerImg} 
              alt={blog.title} 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}

        {/* Content Section */}
        <div className="container" style={{ paddingTop: blog.bannerImg ? '60px' : '100px', paddingBottom: '80px' }}>
          
          <div style={{ 
            maxWidth: '900px',
            margin: '0 auto 40px auto',
            textAlign: 'left'
          }}>
            <div style={{ background: 'var(--primary-orange)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-block', marginBottom: '15px' }}>
              {new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}
            </div>
            <h1 style={{ color: 'var(--primary-blue)', fontSize: getResponsiveSize(blog.titleSize), margin: '0 0 10px 0', fontFamily: 'var(--font-title)', lineHeight: 1.2 }}>
              {blog.title}
            </h1>
            {blog.author && (
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>
                Written by <strong>{blog.author}</strong>
              </p>
            )}
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
              dangerouslySetInnerHTML={{ __html: blog.content }} 
            />
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link href="/#blog" className="btn btn-primary" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}>
              &larr; Back to Main Blog
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
