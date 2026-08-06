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

        <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: '30px', marginTop: '40px', paddingBottom: '20px', scrollSnapType: 'x mandatory' }}>
          {initialBlogs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', width: '100%' }}>No blogs published yet. Check back soon!</p>
          ) : (
            initialBlogs.map(post => {
              const strippedContent = post.content ? post.content.replace(/<[^>]+>/g, '') : '';
              const excerpt = strippedContent.length > 100 ? strippedContent.substring(0, 100) + '...' : strippedContent;
              return (
                <div key={post.id} className="glass-card" style={{ flex: '0 0 320px', scrollSnapAlign: 'start', background: 'rgba(30, 62, 98, 0.4)', borderColor: 'rgba(255,255,255,0.1)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ color: '#15F5BA', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.1rem', lineHeight: '1.4', margin: 0 }}>{post.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0, flexGrow: 1 }}>{excerpt}</p>
                  <Link href={`/blog/${post.id}`} style={{ color: '#f97316', fontSize: '0.9rem', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
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
