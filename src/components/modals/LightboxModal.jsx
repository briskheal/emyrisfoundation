'use client';
import React, { useEffect } from 'react';
import { useModals } from '../../context/ModalContext';

const LightboxModal = () => {
  const { activeModal, modalData, closeModal } = useModals();

  if (activeModal !== 'lightbox' || !modalData) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex', zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.92)' }} onClick={closeModal}>
      <div className="modal-content" style={{ background: 'transparent', boxShadow: 'none', padding: 0, width: 'auto', maxWidth: '95vw', maxHeight: '95vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={closeModal} 
          style={{ position: 'absolute', top: '20px', right: '30px', color: 'white', fontSize: '3rem', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10000, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          title="Close (Esc)"
        >&times;</button>
        <img src={modalData.url} alt={modalData.title || 'Zoomed Photo'} style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '4px' }} />
        {modalData.title && (
          <p style={{ color: 'white', marginTop: '15px', fontSize: '1.2rem', textAlign: 'center', fontWeight: '500', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            {modalData.title}
          </p>
        )}
      </div>
    </div>
  );
};

export default LightboxModal;
