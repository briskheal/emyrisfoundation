import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { notFound } from 'next/navigation';
import { Blog, CorporateProfile } from '../../../lib/db';
import DOMPurify from 'isomorphic-dompurify';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  
  const blog = await Blog.findByPk(id);
  if (!blog) return notFound();

  const corp = await CorporateProfile.findOne();

  const cleanContent = DOMPurify.sanitize(blog.content);

  return (
    <>
      <Header />
      <div style={{ paddingTop: '80px', minHeight: '80vh', background: 'var(--bg-light)' }}>
        
        {/* Banner Section */}
        {blog.bannerImg && (
          <div style={{ width: '100%', height: '400px', position: 'relative' }}>
            <img 
              src={blog.bannerImg} 
              alt={blog.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(11,25,44,0.9) 100%)' 
            }} />
            <div className="container" style={{ position: 'absolute', bottom: '40px', left: 0, right: 0, zIndex: 10 }}>
              <div style={{ background: 'var(--primary-orange)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-block', marginBottom: '15px' }}>
                {new Date(blog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <h1 style={{ color: 'white', fontSize: '3.5rem', margin: '0 0 10px 0', fontFamily: 'var(--font-title)', maxWidth: '900px', lineHeight: 1.1 }}>
                {blog.title}
              </h1>
              {blog.author && (
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', margin: 0 }}>
                  Written by <strong>{blog.author}</strong>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="container" style={{ paddingTop: blog.bannerImg ? '60px' : '100px', paddingBottom: '80px' }}>
          
          {!blog.bannerImg && (
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ color: 'var(--primary-blue)', fontSize: '3rem', fontFamily: 'var(--font-title)' }}>
                {blog.title}
              </h1>
              <p style={{ color: 'var(--text-muted)' }}>
                {new Date(blog.publishedAt).toLocaleDateString()} {blog.author && `| By ${blog.author}`}
              </p>
            </div>
          )}

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
              dangerouslySetInnerHTML={{ __html: cleanContent }} 
            />
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link href="/blog">
              <button className="btn-primary">
                &larr; Back to all Blogs
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer corp={corp} />
    </>
  );
}
