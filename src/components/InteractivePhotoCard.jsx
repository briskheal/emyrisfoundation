'use client';
import React from 'react';
import { useModals } from '../context/ModalContext';

export default function InteractivePhotoCard({ photo }) {
  const { openModal } = useModals();

  return (
    <div 
      className="gallery-card" 
      onClick={() => openModal('lightbox', { url: photo.url, title: photo.title })}
      style={{ cursor: 'zoom-in', transition: 'transform 0.3s' }}
      title="Click to expand"
    >
      <div className="gallery-card-media">
        <img src={photo.url} alt={photo.title || 'Gallery'} />
      </div>
      {photo.title && (
        <div className="gallery-card-info">
          <h5 className="gallery-card-title">
            <i className="fa-solid fa-camera" style={{ color: 'var(--primary-orange)', marginRight: '8px' }}></i> {photo.title}
          </h5>
        </div>
      )}
    </div>
  );
}
