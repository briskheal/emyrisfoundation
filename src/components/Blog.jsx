'use client';
import React from 'react';

const Blog = () => {
  return (
    <section id="blog" className="blog-section scroll-spy" style={{ background: '#0b192c', padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <div className="section-title-wrapper text-center">
          <span className="section-subtitle">Insights & Stories</span>
          <h2 className="section-title" style={{ color: '#fff' }}>Latest Blog</h2>
          <div className="title-underline"></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '40px' }}>
          {[
            { id: 1, title: 'Empowering Women Through Skill Development', date: 'Jul 20, 2026', excerpt: 'Learn how our new training centers are helping women achieve financial independence.' },
            { id: 2, title: 'The Impact of Clean Water Initiatives', date: 'Jul 15, 2026', excerpt: 'A deep dive into our recent rural health camps and the installation of clean water facilities.' },
            { id: 3, title: 'Bridging the Digital Divide in Education', date: 'Jul 10, 2026', excerpt: 'How we are equipping remote village schools with modern digital learning tools.' }
          ].map(post => (
            <div key={post.id} className="glass-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ color: '#15F5BA', fontSize: '0.85rem', fontWeight: 'bold' }}>{post.date}</div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', margin: 0 }}>{post.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0, flexGrow: 1 }}>{post.excerpt}</p>
              <a href="#" style={{ color: '#f97316', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>Read More <i className="fa-solid fa-arrow-right"></i></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
