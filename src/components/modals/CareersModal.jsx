'use client';
import React, { useState, useEffect } from 'react';
import { useModals } from '../../context/ModalContext';

const CareersModal = () => {
  const { activeModal, closeModal, openModal } = useModals();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeModal === 'careers') {
      fetch('/api/jobs')
        .then(res => res.json())
        .then(data => {
          // Filter to only show active jobs
          setJobs(data.filter(j => j.active !== false));
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [activeModal]);

  if (activeModal !== 'careers') return null;

  return (
    <div className="modal-overlay open" onClick={closeModal} style={{ zIndex: 1100, display: 'flex' }}>
      <div className="modal-content donate-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', backgroundColor: 'var(--bg-light)' }}>
        <button className="modal-close" onClick={closeModal}>
          <i className="fa-solid fa-times"></i>
        </button>

        <div className="modal-header">
          <h3>Work With Us</h3>
          <p>Join our mission and make an impact. Explore our current open positions below.</p>
        </div>

        <div className="modal-body" style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading open positions...</div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
              <i className="fa-solid fa-briefcase" style={{ fontSize: '3rem', marginBottom: '15px', color: 'var(--primary-orange)' }}></i>
              <p>There are currently no active job openings. Please check back later!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {jobs.map(job => (
                <div key={job.id} style={{ 
                  backgroundColor: 'var(--white)', 
                  padding: '24px', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div>
                    <span style={{ display: 'inline-block', backgroundColor: 'rgba(249, 115, 22, 0.1)', color: 'var(--primary-orange)', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <i className="fa-solid fa-building"></i> {job.dept}
                    </span>
                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--primary-blue)', fontSize: '1.4rem', lineHeight: '1.3', fontWeight: '800' }}>
                      {job.title}
                    </h4>
                    {job.loc && (
                      <div style={{ color: 'var(--text-light)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                        <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary-orange)' }}></i> {job.loc}
                      </div>
                    )}
                  </div>
                  
                  <p style={{ margin: '0', fontSize: '0.95rem', color: 'var(--text-dark)', lineHeight: '1.6' }}>
                    {job.desc}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => openModal('job', job)}
                      style={{ padding: '10px 24px', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      Apply Now <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareersModal;
