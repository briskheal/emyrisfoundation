import React from 'react';
import Link from 'next/link';

const Blog = ({ initialBlogs = [] }) => {
  return (
    <section id="blog" className="blog-section scroll-spy" style={{ background: '#0b192c', padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <div className="section-title-wrapper text-center">
          <span className="section-subtitle">Insights & Stories</span>
          <h2 className="section-title" style={{ color: '#fff' }}>Latest Blog</h2>
          <div className="title-underline"></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '40px' }}>
          {initialBlogs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', gridColumn: '1 / -1' }}>No blogs published yet. Check back soon!</p>
          ) : (
            initialBlogs.slice(0, 3).map(post => {
              const strippedContent = post.content ? post.content.replace(/<[^>]+>/g, '') : '';
              const excerpt = strippedContent.length > 100 ? strippedContent.substring(0, 100) + '...' : strippedContent;
              return (
                <div key={post.id} className="glass-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ color: '#15F5BA', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.3rem', margin: 0 }}>{post.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0, flexGrow: 1 }}>{excerpt}</p>
                  <Link href={`/blog/${post.id}`} style={{ color: '#f97316', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    Read More <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;
