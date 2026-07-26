import React, { useState, useEffect } from 'react';
import { ConflictBanner, LastEditedBadge } from '../../lib/useConflictSave';

const PresenceLocationManager = ({ token }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conflictInfo, setConflictInfo] = useState(null);
  const [loadedAt, setLoadedAt] = useState(null);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', hq: '', volunteers: '', coordinator: '', phone: '', programs: '' });

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/presence');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...formData, 
        programs: typeof formData.programs === 'string' ? formData.programs.split(',').map(s => s.trim()).filter(Boolean) : formData.programs,
        lastKnownUpdatedAt: loadedAt 
      };
      
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch('/api/presence', {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.status === 409) { const d = await res.json(); setConflictInfo(d); return; }
      if (res.ok) {
        setFormData({ id: '', name: '', hq: '', volunteers: '', coordinator: '', phone: '', programs: '' });
        setEditing(null);
        fetchItems();
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/presence?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchItems();
    } catch (err) { console.error(err); }
  };

  const editItem = (item) => {
    setEditing(item.id);
    setFormData({ ...item, programs: item.programs ? item.programs.join(', ') : '' });
  };

  return (
    <div className="admin-panel-section" style={{ display: 'block' }}>
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>Manage PresenceLocations</h2>
      
      <div className="glass-card" style={{ padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ color: '#15F5BA', marginBottom: '15px' }}>{editing ? 'Edit' : 'Add New'} PresenceLocation</h3>
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>ID</label>
            <input type="text" className="form-input" required value={formData.id || ''} onChange={e => setFormData({...formData, id: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>State Name</label>
            <input type="text" className="form-input" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>Headquarters</label>
            <input type="text" className="form-input" required value={formData.hq || ''} onChange={e => setFormData({...formData, hq: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>Volunteers</label>
            <input type="text" className="form-input" required value={formData.volunteers || ''} onChange={e => setFormData({...formData, volunteers: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>Coordinator</label>
            <input type="text" className="form-input" required value={formData.coordinator || ''} onChange={e => setFormData({...formData, coordinator: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>Phone</label>
            <input type="text" className="form-input" required value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>Programs (Comma separated)</label>
            <input type="text" className="form-input" value={formData.programs || ''} onChange={e => setFormData({...formData, programs: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} placeholder="e.g. Health Clinic, School Project" />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Save'}</button>
            {editing && <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setFormData({ id: '', name: '', hq: '', volunteers: '', coordinator: '', phone: '', programs: '' }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>ID</th><th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>State Name</th><th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>Headquarters</th><th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>Volunteers</th><th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>Coordinator</th><th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>Phone</th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#15F5BA' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px' }}>{item.id}</td><td style={{ padding: '12px' }}>{item.name}</td><td style={{ padding: '12px' }}>{item.hq}</td><td style={{ padding: '12px' }}>{item.volunteers}</td><td style={{ padding: '12px' }}>{item.coordinator}</td><td style={{ padding: '12px' }}>{item.phone}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button onClick={() => editItem(item)} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', marginRight: '15px' }}><i className="fa-solid fa-pen"></i></button>
                  <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PresenceLocationManager;
