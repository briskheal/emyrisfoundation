'use client';
import React from 'react';
import directors from '../data/directors.json';
import mentors from '../data/mentors.json';

const AboutUs = () => {
  return (
    <section id="about" className="about-section scroll-spy">
      <div className="container">
        <div className="section-title-wrapper text-center">
          <span className="section-subtitle">Who We Are</span>
          <h2 className="section-title">Cultivating Growth & Generosity</h2>
          <div className="title-underline"></div>
        </div>

        <div id="about-vision" className="about-vision-grid">
          <div className="vision-text-block">
            <h3>"Together We Grow"</h3>
            <p className="lead-para">The Emyris Foundation, with its inspiring motto "Together We Grow," is dedicated to fostering community development and personal growth through collaborative efforts. We focus on empowering individuals by providing resources, education, and support systems to help them reach their full potential.</p>
            <p>We encourage people from all walks of life to work together, share knowledge, and build a more inclusive and supportive society. Whether through workshops, community projects, or mentorship programs, the foundation aims to create environments where everyone can thrive and contribute to a brighter future.</p>
            
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon"><i className="fa-solid fa-handshake"></i></div>
                <h4>Collaboration</h4>
              </div>
              <div className="value-card">
                <div className="value-icon"><i className="fa-solid fa-eye"></i></div>
                <h4>Transparency</h4>
              </div>
              <div className="value-card">
                <div className="value-icon"><i className="fa-solid fa-lightbulb"></i></div>
                <h4>Innovation</h4>
              </div>
              <div className="value-card">
                <div className="value-icon"><i className="fa-solid fa-shield-halved"></i></div>
                <h4>Accountability</h4>
              </div>
            </div>
          </div>

          <div className="vision-mission-cards">
            <div className="glass-card vision-card">
              <div className="card-badge orange">VISION</div>
              <h4>A Better Future</h4>
              <p>A world where every individual thrives in an environment of shared growth, equity, and sustainable development.</p>
            </div>
            <div className="glass-card mission-card">
              <div className="card-badge blue">MISSION</div>
              <h4>Purpose &amp; Action</h4>
              <p>Fostering community development through education, health initiatives, and environmental sustainability projects, ensuring that every member of society can grow and contribute to a healthier, educated, and greener world.</p>
            </div>
            <div className="glass-card serve-card">
              <div className="card-badge green">WHO WE SERVE</div>
              <h4>Empowering Communities</h4>
              <p>We empower individuals, particularly in underserved communities, by providing resources, education, and support systems that promote self-sufficiency and communal progress.</p>
            </div>
          </div>
        </div>

        <div id="about-leadership" className="team-block-wrapper">
          <div className="section-title-wrapper text-center">
            <span className="section-subtitle">Our Guides</span>
            <h3 className="subsection-title">Board of Directors</h3>
          </div>
          <div className="directors-grid" id="directors-list-container">
            {directors.map(d => (
              <div key={d.id} className="profile-card director-card glass-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {d.photo ? (
                      <img src={d.photo} className="profile-avatar-img" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} alt={d.name} />
                    ) : (
                      <i className="fa-solid fa-user-tie"></i>
                    )}
                  </div>
                  <div className="profile-meta">
                    <h4>{d.name}</h4>
                    <span className="role">{d.role}</span>
                  </div>
                </div>
                <p className="profile-bio">{d.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="about-mentors" className="team-block-wrapper">
          <div className="section-title-wrapper text-center">
            <span className="section-subtitle">Wisdom &amp; Support</span>
            <h3 className="subsection-title">Advisory Mentors</h3>
          </div>
          <div className="mentors-grid" id="mentors-list-container">
            {mentors.map(m => (
              <div key={m.id} className="profile-card mentor-card glass-card">
                <div className="profile-header">
                  <div className="profile-avatar mentor-avatar">
                    {m.photo ? (
                      <img src={m.photo} className="profile-avatar-img" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} alt={m.name} />
                    ) : (
                      <i className="fa-solid fa-user-graduate"></i>
                    )}
                  </div>
                  <div className="profile-meta">
                    <h4>{m.name}</h4>
                    <span className="role">{m.role}</span>
                  </div>
                </div>
                <div className="mentor-details">
                  <span className="qualification">{m.qual}</span>
                  <p>{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="our-people-block glass-card text-center">
          <h4>Our Core Team</h4>
          <p>Driven by the hard work of <strong>Mr. Girirajsinh Jadeja</strong>, <strong>Mr. Manoranjan Mishra</strong>, <strong>Ms. Rishita Dash</strong>, and our active network of local volunteers.</p>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;

