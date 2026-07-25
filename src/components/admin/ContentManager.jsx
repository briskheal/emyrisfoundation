import React, { useState, useEffect } from 'react';
import { ConflictBanner, LastEditedBadge } from '../../lib/useConflictSave';

const SectionContentManager = ({ token }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conflictInfo, setConflictInfo] = useState(null);
  const [loadedAt, setLoadedAt] = useState(null);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ id: '', title: '', subtitle: '', content: '' });

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch('/api/content', {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, lastKnownUpdatedAt: loadedAt })
      });
      if (res.status === 409) { const d = await res.json(); setConflictInfo(d); return; }
      if (res.ok) {
        setFormData({ id: '', title: '', subtitle: '', content: '' });
        setEditing(null);
        fetchItems();
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/content?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchItems();
    } catch (err) { console.error(err); }
  };

  const editItem = (item) => {
    setEditing(item.id);
    setFormData(item);
  };

  return (
    <div className="admin-panel-section" style={{ display: 'block' }}>
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>Manage SectionContents</h2>
      
      <div className="glass-card" style={{ padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ color: '#15F5BA', marginBottom: '15px' }}>{editing ? 'Edit' : 'Add New'} SectionContent</h3>
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>Section ID</label>
            <input type="text" className="form-input" required value={formData.id || ''} onChange={e => setFormData({...formData, id: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>Title</label>
            <input type="text" className="form-input" required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>Subtitle</label>
            <input type="text" className="form-input" required value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>Content</label>
            <input type="text" className="form-input" required value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Save'}</button>
            {editing && <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setFormData({ id: '', title: '', subtitle: '', content: '' }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>Section ID</th><th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>Title</th><th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>Subtitle</th><th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>Content</th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#15F5BA' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px' }}>{item.id}</td><td style={{ padding: '12px' }}>{item.title}</td><td style={{ padding: '12px' }}>{item.subtitle}</td><td style={{ padding: '12px' }}>{item.content}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button onClick={() => editItem(item)} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', marginRight: '15px' }}><i className="fa-solid fa-pen"></i></button>
                  <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionContentManager;
