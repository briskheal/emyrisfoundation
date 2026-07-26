import React, { useState, useEffect } from 'react';
import { ConflictBanner, LastEditedBadge } from '../../lib/useConflictSave';
import { API_URL } from '../../api';

const AboutManager = ({ token }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conflictInfo, setConflictInfo] = useState(null);
  const [loadedAt, setLoadedAt] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/about`)
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (field, value) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/about`, {
        method: 'PUT', // conflict-aware
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content)
      });
      if (res.status === 409) { const d = await res.json(); setConflictInfo(d); return; }
      if (res.ok) {
        setMessage('About section updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update.');
      }
    } catch (err) {
      setMessage('Network error.');
    }
    setSaving(false);
  };

  if (loading) return <div style={{ color: 'white' }}>Loading About data...</div>;

  return (
    <div>
      <h3 style={{ color: 'white', marginBottom: '20px' }}><i className="fa-solid fa-users" style={{ color: '#f97316' }}></i> Manage About Us</h3>
      
      {message && (
        <div style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '20px', color: '#4ade80' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {[
          { label: 'Title', field: 'title' },
          { label: 'Subtitle', field: 'subtitle' },
          { label: 'Motto', field: 'motto' },
          { label: 'Leadership Title', field: 'directorsTitle' },
          { label: 'Leadership Subtitle', field: 'directorsSubtitle' },
        ].map(({ label, field }) => (
          <div key={field}>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px', display: 'block' }}>{label}</label>
            <input
              type="text"
              value={content[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
                color: 'white', fontSize: '0.92rem', outline: 'none'
              }}
            />
          </div>
        ))}

        <div>
          <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px', display: 'block' }}>Paragraph 1</label>
          <textarea
            value={content.paragraph1 || ''}
            onChange={e => handleChange('paragraph1', e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
              color: 'white', fontSize: '0.92rem', minHeight: '120px', outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px', display: 'block' }}>Paragraph 2</label>
          <textarea
            value={content.paragraph2 || ''}
            onChange={e => handleChange('paragraph2', e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
              color: 'white', fontSize: '0.92rem', minHeight: '120px', outline: 'none'
            }}
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '12px 28px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
            color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer'
          }}>
            <i className="fa-solid fa-floppy-disk"></i> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutManager;
