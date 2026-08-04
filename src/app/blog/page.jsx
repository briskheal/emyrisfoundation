import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Blog, CorporateProfile } from '../../lib/db';

export const dynamic = 'force-dynamic';

export default async function BlogListingPage() {
  const blogs = await Blog.findAll({
    order: [['publishedAt', 'DESC'], ['order', 'ASC']]
  });
  
  const corp = await CorporateProfile.findOne();

  return (
    <>
      <Header />
      <div style={{ paddingTop: '80px', minHeight: '80vh', background: 'var(--bg-light)', paddingBottom: '60px' }}>
        <div className="container" style={{ paddingTop: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-title)', color: 'var(--primary-blue)', marginBottom: '15px' }}>
              Our <span style={{ color: 'var(--primary-orange)' }}>Blog</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
              Insights, stories, and news from our ongoing mission to empower communities.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {blogs.length === 0 ? (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>No blogs published yet. Check back soon!</p>
            ) : (
              blogs.map(blog => (
                <Link href={`/blog/${blog.id}`} key={blog.id} style={{ textDecoration: 'none' }}>
                  <div style={{ 
                    background: 'white', borderRadius: '16px', overflow: 'hidden', 
                    boxShadow: 'var(--glass-shadow)', transition: 'transform 0.3s', cursor: 'pointer',
                    height: '100%', display: 'flex', flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ width: '100%', height: '220px', overflow: 'hidden' }}>
                      <img 
                        src={blog.bannerImg || '/placeholder.webp'} 
                        alt={blog.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <p style={{ color: 'var(--accent-teal)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px' }}>
                        {new Date(blog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <h3 style={{ margin: '0 0 15px 0', fontSize: '1.4rem', color: 'var(--primary-blue)' }}>
                        {blog.title}
                      </h3>
                      {blog.author && (
                        <p style={{ margin: 'auto 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          By <strong>{blog.author}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer corp={corp} />
    </>
  );
}
