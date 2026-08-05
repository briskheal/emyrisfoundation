import React, { useState, useEffect } from 'react';
import { ConflictBanner, LastEditedBadge } from '../../lib/useConflictSave';
import { compressImage } from '../../lib/imageCompressor';

const WorkManager = ({ token }) => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conflictInfo, setConflictInfo] = useState(null);
  const [loadedAt, setLoadedAt] = useState(null);
  const [editing, setEditing] = useState(null);
  
  const [formData, setFormData] = useState({ title: '', motto: '', statVal: '', statLbl: '', desc: '', bullets: [''], img: '' });
  const [uploading, setUploading] = useState(false);

  const fetchWorks = async () => {
    try {
      const res = await fetch('/api/work');
      const data = await res.json();
      setWorks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleUpload = async (e) => {
    const rawFile = e.target.files[0];
    if (!rawFile) return;
    e.target.value = '';

    const file = await compressImage(rawFile, 1200, 0.85); // 1200px max width
    const form = new FormData();
    form.append('file', file);
    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: form
      });
      const data = await res.json();
      if (res.ok) setFormData({ ...formData, img: data.url });
      else alert(data.error);
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleBulletChange = (index, value) => {
    const newBullets = [...formData.bullets];
    newBullets[index] = value;
    setFormData({ ...formData, bullets: newBullets });
  };

  const addBullet = () => setFormData({ ...formData, bullets: [...formData.bullets, ''] });
  const removeBullet = (index) => {
    const newBullets = formData.bullets.filter((_, i) => i !== index);
    setFormData({ ...formData, bullets: newBullets });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isNew = !editing;
    // Clean up empty bullets
    const cleanBullets = formData.bullets.filter(b => b.trim() !== '');
    
    try {
      const res = await fetch('/api/work', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, bullets: cleanBullets, id: isNew ? undefined : editing.id })
      });
      if (res.status === 409) { const d = await res.json(); setConflictInfo(d); return; }
      if (res.ok) {
        setEditing(null);
        setFormData({ title: '', motto: '', statVal: '', statLbl: '', desc: '', bullets: [''], img: '' });
        fetchWorks();
      } else {
        alert('Failed to save');
      }
    } catch (err) {
      alert('Error saving');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    try {
      const res = await fetch(`/api/work?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchWorks();
    } catch (err) {
      alert('Error deleting');
    }
  };

  if (loading) return <div style={{ color: 'white' }}>Loading...</div>;

  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: 'white' }}><i className="fa-solid fa-briefcase" style={{ color: '#f97316' }}></i> Our Work / Initiatives</h3>
        {!editing && (
          <button 
            onClick={() => { setEditing(true); setFormData({ title: '', motto: '', statVal: '', statLbl: '', desc: '', bullets: [''], img: '' }); }}
            style={{ padding: '8px 16px', background: '#f97316', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            + Add Initiative
          </button>
        )}
      </div>

      {editing && (
        <form onSubmit={handleSave} style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ color: 'white', marginBottom: '15px' }}>{editing === true ? 'New Initiative' : 'Edit Initiative'}</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Title</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Motto</label>
              <input type="text" value={formData.motto} onChange={e => setFormData({...formData, motto: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Statistic Value (e.g. "20 Villages")</label>
              <input type="text" value={formData.statVal} onChange={e => setFormData({...formData, statVal: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Statistic Label</label>
              <input type="text" value={formData.statLbl} onChange={e => setFormData({...formData, statLbl: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
            </div>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Description</label>
            <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} required rows="3" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Bullet Points</label>
            {formData.bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input type="text" value={b} onChange={e => handleBulletChange(i, e.target.value)} placeholder={`Bullet ${i+1}`} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
                <button type="button" onClick={() => removeBullet(i)} style={{ padding: '8px', background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer' }}><i className="fa-solid fa-times"></i></button>
              </div>
            ))}
            <button type="button" onClick={addBullet} style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Add Bullet</button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Grid Card Thumbnail (Single Image only. Go to 'Work Content' for Banners & Gallery)</label>
            <input type="file" accept="image/*" onChange={handleUpload} style={{ color: 'white', marginBottom: '10px' }} />
            {uploading && <span style={{ color: '#15F5BA', fontSize: '0.8rem' }}>Uploading & Optimizing...</span>}
            {formData.img && (
              <div style={{ marginTop: '10px' }}>
                <img src={formData.img} alt="Preview" style={{ height: '80px', borderRadius: '4px', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={uploading} style={{ padding: '8px 20px', background: '#15F5BA', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
            <button type="button" onClick={() => setEditing(null)} style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Image</th>
              <th style={{ padding: '12px' }}>Title</th>
              <th style={{ padding: '12px' }}>Statistic</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {works.map(w => (
              <tr key={w.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px' }}><img src={w.img} alt={w.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                <td style={{ padding: '12px' }}>{w.title}</td>
                <td style={{ padding: '12px' }}><span style={{ color: '#15F5BA' }}>{w.statVal}</span> {w.statLbl}</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => { setEditing(w); setFormData({ ...w, bullets: w.bullets || [''] }); }} style={{ background: 'transparent', border: 'none', color: '#15F5BA', cursor: 'pointer', marginRight: '15px' }}><i className="fa-solid fa-pen"></i></button>
                  <button onClick={() => handleDelete(w.id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
            {works.length === 0 && (
              <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No work initiatives found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkManager;
