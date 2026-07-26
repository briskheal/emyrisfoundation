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
    <div className="modal-overlay" onClick={closeModal} style={{ zIndex: 1100 }}>
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
                  padding: '20px', 
                  borderRadius: '10px', 
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: 'var(--primary-blue)', fontSize: '1.2rem' }}>{job.title}</h4>
                      <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '10px' }}>
                        <span><i className="fa-solid fa-building"></i> {job.dept}</span>
                        <span><i className="fa-solid fa-location-dot"></i> {job.loc}</span>
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary btn-sm" 
                      onClick={() => openModal('job', job.title)}
                    >
                      Apply Now <i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{job.desc}</p>
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
