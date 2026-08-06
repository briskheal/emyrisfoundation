import React, { useState, useEffect, useRef } from 'react';
import { ConflictBanner, LastEditedBadge } from '../../lib/useConflictSave';

const PublicationManager = ({ token }) => {
  const formRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conflictInfo, setConflictInfo] = useState(null);
  const [loadedAt, setLoadedAt] = useState(null);
  const [editing, setEditing] = useState(null);
  
  const [formData, setFormData] = useState({ id: '', title: '', year: '', pdfLink: '' });
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/publications');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/upload', { 
        method: 'POST', 
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form 
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, pdfLink: data.url }));
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      alert('Upload failed');
    }
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert('Title required');
    
    const isNew = !editing;
    const method = isNew ? 'POST' : 'PUT';
    
    const payload = { ...formData };
    if (isNew && !payload.id) {
      payload.id = 'pub-' + Date.now();
    }

    try {
      const res = await fetch('/api/publications', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.status === 409) { const d = await res.json(); setConflictInfo(d); return; }
      if (res.ok) {
        setEditing(null);
        setFormData({ id: '', title: '', year: '', pdfLink: '' });
        fetchItems();
      } else {
        alert('Save failed');
      }
    } catch (err) {
      alert('Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this publication?')) return;
    try {
      const res = await fetch(`/api/publications?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchItems();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const editItem = (item) => {
    setEditing(item.id);
    setFormData({
      id: item.id || '',
      title: item.title || '',
      year: item.year || '',
      pdfLink: item.pdfLink || ''
    });
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({ id: '', title: '', year: '', pdfLink: '' });
  };

  if (loading) return <div style={{ color: 'white' }}>Loading Publications...</div>;

  return (
    <div>
      <h3 style={{ color: 'white', marginBottom: '20px' }}><i className="fa-solid fa-file-pdf" style={{ color: '#f97316' }}></i> Manage Publications & Reports</h3>
      
      <div style={{ display: 'grid', gap: '16px', marginBottom: '30px' }}>
        {items.map(item => (
          <div key={item.id} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center'
          }}>
            <div style={{ width: '50px', height: '50px', background: 'rgba(249,115,22,0.1)', color: '#f97316', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              <i className="fa-solid fa-file-pdf"></i>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: 'white', margin: '0 0 4px 0', fontSize: '1.1rem' }}>{item.title}</h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.85rem' }}>{item.year || 'No Year'} {item.pdfLink && <span>• <a href={item.pdfLink} target="_blank" style={{ color: '#f97316', textDecoration: 'none' }}>View File</a></span>}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => editItem(item)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}><i className="fa-solid fa-pen"></i></button>
              <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.2)', border: 'none', color: '#f87171', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
            </div>
          </div>
        ))}
      </div>

      <div ref={formRef} style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', padding: '24px' }}>
        <h4 style={{ color: 'white', marginTop: 0 }}>{editing ? 'Edit Publication' : 'Add New Publication'}</h4>
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px' }}>Title *</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px' }}>Year</label>
              <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} placeholder="e.g. 2023-2024" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', outline: 'none' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px' }}>PDF File Upload</label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <label style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '0.9rem' }}>
                <i className="fa-solid fa-upload"></i> {uploading ? 'Uploading...' : 'Upload PDF'}
                <input type="file" accept=".pdf" onChange={handleUpload} style={{ display: 'none' }} />
              </label>
              {formData.pdfLink && <span style={{ color: '#4ade80', fontSize: '0.85rem' }}><i className="fa-solid fa-circle-check"></i> File attached</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button type="submit" style={{ padding: '10px 24px', background: '#f97316', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              {editing ? 'Update Publication' : 'Add Publication'}
            </button>
            {editing && (
              <button type="button" onClick={cancelEdit} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                Cancel
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default PublicationManager;
