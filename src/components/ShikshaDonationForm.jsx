'use client';
import React, { useState } from 'react';

export default function ShikshaDonationForm() {
  const [selectedAmount, setSelectedAmount] = useState('1500');

  const handleSubmit = (e) => {
    e.preventDefault();
    // This could trigger a payment gateway or just open a generic modal
    alert(`Initiating donation for ₹${selectedAmount}`);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '20px' }}>
        <span className="section-subtitle" style={{ color: 'var(--primary-orange)', fontSize: '0.85rem' }}>SUPPORT THE PURPOSE</span>
        <h2 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>
          We Can Make a difference.
        </h2>
        <div className="title-underline" style={{ margin: '0 0 15px 0' }}></div>
      </div>

      <div className="glass-card" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '25px', background: 'rgba(11, 25, 44, 0.7)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <form onSubmit={handleSubmit} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px', alignItems: 'center' }}>
          {['1500', '3000', '6000', '12000'].map((amount) => (
            <label 
              key={amount} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                cursor: 'pointer', 
                padding: '12px 25px',
                background: selectedAmount === amount ? 'rgba(235, 94, 40, 0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${selectedAmount === amount ? 'var(--primary-orange)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '8px',
                width: '100%',
                maxWidth: '200px',
                transition: 'all 0.2s ease'
              }}
            >
              <input 
                type="radio" 
                name="donationAmount" 
                value={amount} 
                checked={selectedAmount === amount} 
                onChange={(e) => setSelectedAmount(e.target.value)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary-orange)' }}
              />
              <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: selectedAmount === amount ? '600' : '400' }}>₹ {amount}</span>
            </label>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', fontWeight: '600', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            YOUR DONATION WILL HELP EDUCATION
          </p>
          <button type="submit" className="btn btn-primary w-100" style={{ padding: '14px', fontSize: '1.1rem', fontWeight: '700', borderRadius: '8px', letterSpacing: '1px' }}>
            DONATE NOW
          </button>
        </div>

        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', lineHeight: '1.5', margin: '0 0 10px 0' }}>
            "YOUR CONTRIBUTIONS ARE ELIGIBLE FOR UPTO 50% TAX BENEFIT UNDER SECTION 80G AS EMYRIS FOUNDATION IS REGISTERED AS NON PROFIT ORGANIZATION"
          </p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: '600', margin: 0 }}>
            PAN: XXXXXXXX | 80G NUMBER: XXXXXXXX
          </p>
        </div>
      </form>
    </div>
    </div>
  );
}
