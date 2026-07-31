'use client';
import React, { useState } from 'react';
import { useModals } from '../context/ModalContext';

export default function CampaignDetailForm({ campaignTitle, isBloodCampaign, campaignId }) {
  const { openModal } = useModals();
  const [formData, setFormData] = useState({ name: '', gender: 'Male', age: '', state: '', pin: '', address: '', bloodGroup: 'O+', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        campaign: campaignTitle,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        details: `Gender: ${formData.gender}\nAge: ${formData.age}\nState: ${formData.state}\nPin: ${formData.pin}\nAddress: ${formData.address}${(isBloodCampaign || campaignId === 'organ') ? `\nBlood Group: ${formData.bloodGroup}` : ''}`
      };
      const res = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="glass-card" style={{ padding: '30px 25px', textAlign: 'center', background: 'rgba(11, 25, 44, 0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px' }}>
        <i className="fa-solid fa-circle-check" style={{ fontSize: '3.5rem', color: '#22c55e', marginBottom: '15px', display: 'block' }}></i>
        <h3 style={{ color: '#ffffff', marginBottom: '12px', fontSize: '1.5rem' }}>Thankx for your submission.</h3>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '25px' }}>
          You will be invited for this great cause to nearest camp arranged.
        </p>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'justify', marginBottom: '20px' }}>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '16px' }}>
            If you are willing to support Emyris Foundation which relentlessly working for Social Causes, do consider to contribute. Each contribution brings happiness in other lives. In a Society, we believe , <strong>“Together We Grow”</strong>.
          </p>
          <button className="btn btn-primary w-100" style={{ padding: '12px', fontSize: '1rem', fontWeight: '600' }} onClick={() => openModal('donate')}>
            Donation Tab <i className="fa-solid fa-heart" style={{ marginLeft: '8px', color: '#ff4d4f' }}></i>
          </button>
        </div>
        <button className="btn btn-outline w-100" onClick={() => setSuccess(false)}>Register Another Participant</button>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '20px' }}>
        <span className="section-subtitle" style={{ color: 'var(--primary-orange)', fontSize: '0.85rem' }}>
          {isBloodCampaign ? 'Consent form to Contact and Coordinate' : 'Fill up the form below to become part of our movement.'}
        </span>
        <h2 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>
          {isBloodCampaign ? '"Blood: The Universal Bond"' : `Join ${campaignTitle}`}
        </h2>
        <div className="title-underline" style={{ margin: '0 0 15px 0' }}></div>
      </div>

      <div className="glass-card" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '25px', background: 'rgba(11, 25, 44, 0.7)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
      <form onSubmit={handleSubmit}>
        
        {/* Name */}
        <div className="form-group" style={{ marginBottom: '14px' }}>
          <label style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Name – *</label>
          <input type="text" className="form-control" required placeholder="Enter your full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }} />
        </div>
        
        {/* Compact Grid: Gender, Age, optionally Blood Group */}
        <div style={{ display: 'grid', gridTemplateColumns: isBloodCampaign ? 'repeat(auto-fit, minmax(80px, 1fr))' : '1fr 1fr', gap: '15px', marginBottom: '14px' }}>
          <div className="form-group">
            <label style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Gender – *</label>
            <select className="form-select" required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} style={{ background: '#0b192c', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Age – *</label>
            <input type="number" className="form-control" min="18" max="70" required placeholder="Age" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }} />
          </div>
          {(isBloodCampaign || campaignId === 'organ') && (
            <div className="form-group">
              <label style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Blood Group – *</label>
              <select className="form-select" required value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} style={{ background: '#0b192c', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="Not Sure">Other</option>
              </select>
            </div>
          )}
        </div>

        {/* Compact Grid: State, Pin */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '14px' }}>
          <div className="form-group">
            <label style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>State – *</label>
            <input type="text" className="form-control" required placeholder="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }} />
          </div>
          <div className="form-group">
            <label style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Pin – *</label>
            <input type="text" className="form-control" required placeholder="Postal Pin" value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value})} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }} />
          </div>
        </div>

        {/* Address */}
        <div className="form-group" style={{ marginBottom: '14px' }}>
          <label style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Address – *</label>
          <input type="text" className="form-control" required placeholder="Full residential address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }} />
        </div>

        {/* Phone & Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '18px' }}>
          <div className="form-group">
            <label style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Phone No – *</label>
            <input type="tel" className="form-control" required placeholder="Mobile Contact" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }} />
          </div>
          <div className="form-group">
            <label style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Email id- (If Any)</label>
            <input type="email" className="form-control" placeholder="Optional email address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }} />
          </div>
        </div>

        {campaignId === 'organ' && (
          <div className="form-group" style={{ marginBottom: '18px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <input type="checkbox" required style={{ marginTop: '4px', accentColor: 'var(--primary-orange)', width: '18px', height: '18px', cursor: 'pointer' }} />
            <label style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', lineHeight: '1.4', cursor: 'pointer' }}>
              I am agreed and giving my consent to contact me and make me understand more about Organ Donation.
            </label>
          </div>
        )}

        {error && <div style={{ color: '#ef4444', marginBottom: '12px', fontSize: '0.9rem' }}>{error}</div>}

        <button type="submit" className="btn btn-primary w-100" style={{ padding: '12px', fontSize: '1rem', fontWeight: '600', marginTop: '5px' }} disabled={loading}>
          {loading ? 'Submitting...' : <>Submit Consent Form <i className="fa-solid fa-paper-plane" style={{ marginLeft: '8px' }}></i></>}
        </button>
      </form>
    </div>
    </div>
  );
}
