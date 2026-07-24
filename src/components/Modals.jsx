'use client';
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useDonateModal } from '../context/DonateModalContext';
import { API_URL } from '../api';

const buildUpiUri = (corp) => {
  const pa = corp?.upiId
    ? corp.upiId
    : `${corp?.accountNo || ''}.${corp?.ifsc || ''}.ifsc.npci@upi`;
  const pn = encodeURIComponent(corp?.accountName || 'Emyris Foundation');
  const tn = encodeURIComponent('Donation to Emyris Foundation');
  return `upi://pay?pa=${pa}&pn=${pn}&cu=INR&tn=${tn}`;
};

const Modals = () => {
  const { isOpen, closeDonateModal } = useDonateModal();
  const [corporate, setCorporate] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/corporate`)
      .then(res => res.json())
      .then(data => setCorporate(data))
      .catch(err => console.error('Failed to fetch corporate data:', err));
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') closeDonateModal(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeDonateModal]);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', animation: 'fadeIn 0.2s ease'
      }}
      onClick={closeDonateModal}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '780px',
          position: 'relative', maxHeight: '90vh', overflowY: 'auto',
          animation: 'slideUp 0.3s ease',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeDonateModal}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%', width: '36px', height: '36px', color: 'white',
            cursor: 'pointer', fontSize: '1rem', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <i className="fa-solid fa-heart-pulse" style={{ fontSize: '2.2rem', color: '#f97316', marginBottom: '10px', display: 'block' }}></i>
          <h2 style={{ color: 'white', fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', margin: '0 0 6px' }}>
            Support the Cause, Make a Difference
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', margin: 0 }}>
            Eligible for 50% tax benefit under Section 80G &mdash; PAN: {corporate?.pan || 'Loading...'}
          </p>
        </div>

        {/* Payment Cards */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

          {/* ── Bank Transfer ── */}
          <div style={{
            flex: '1 1 270px', padding: '22px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(249,115,22,0.25)',
            borderRadius: '14px'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#f97316', fontSize: '1rem' }}>
              <i className="fa-solid fa-building-columns"></i> Bank Transfer
            </h3>
            <div className="bank-details-card">
              <div className="bank-detail-item">
                <span className="detail-label">Account Name</span>
                <span className="detail-value">{corporate?.accountName || 'Loading...'}</span>
              </div>
              <div className="bank-detail-item">
                <span className="detail-label">Account Number</span>
                <span className="detail-value">{corporate?.accountNo || 'Loading...'}</span>
              </div>
              <div className="bank-detail-item">
                <span className="detail-label">IFSC Code</span>
                <span className="detail-value">{corporate?.ifsc || 'Loading...'}</span>
              </div>
              <div className="bank-detail-item">
                <span className="detail-label">Bank &amp; Branch</span>
                <span className="detail-value">{corporate?.bankName}, {corporate?.bankBranch}</span>
              </div>
            </div>
            <div style={{ marginTop: '14px', padding: '10px 12px', background: 'rgba(249,115,22,0.07)', borderRadius: '8px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
              <i className="fa-solid fa-circle-info"></i> After transfer, email{' '}
              <strong style={{ color: '#f97316' }}>{corporate?.email}</strong>{' '}
              with your reference number to receive your 80G certificate.
            </div>
          </div>

          {/* ── UPI / QR ── */}
          <div style={{
            flex: '1 1 270px', padding: '22px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(74,222,128,0.25)',
            borderRadius: '14px', textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '8px', color: '#4ade80', fontSize: '1rem' }}>
              <i className="fa-solid fa-qrcode"></i> Scan &amp; Pay — UPI
            </h3>
            <p style={{ marginBottom: '14px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
              Open any UPI app → tap <strong>Scan QR</strong> → pay instantly
            </p>

            {/* QR Code */}
            <div style={{
              background: 'white', padding: '12px', display: 'inline-block',
              borderRadius: '12px', marginBottom: '14px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
              {corporate?.qrCode ? (
                <img src={corporate.qrCode} alt="Scan to Donate via UPI" className="upi-qr-image" />
              ) : corporate ? (
                <QRCodeSVG 
                  value={buildUpiUri(corporate)} 
                  size={200}
                  level="M"
                  includeMargin={true}
                  className="upi-qr-image"
                />
              ) : (
                <div className="loading-qr">Loading...</div>
              )}
            </div>

            {/* UPI ID */}
            <div style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px' }}>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>UPI Address</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', fontWeight: 700, color: '#4ade80', wordBreak: 'break-all' }}>
                {corporate?.upiId || 'Loading...'}
              </p>
            </div>

            {/* App chips */}
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['PhonePe', 'GPay', 'Paytm', 'BHIM', 'Amazon Pay'].map(app => (
                <span key={app} style={{
                  background: 'rgba(255,255,255,0.07)', borderRadius: '20px',
                  padding: '3px 10px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)'
                }}>{app}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
};

export default Modals;

