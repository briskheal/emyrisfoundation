import React, { useState, useEffect } from 'react';
import { ConflictBanner, LastEditedBadge } from '../../lib/useConflictSave';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const PresenceLocationManager = ({ token }) => {
  const [items, setItems] = useState([]);
  const [operationalCenters, setOperationalCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conflictInfo, setConflictInfo] = useState(null);
  const [loadedAt, setLoadedAt] = useState(null);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', hq: '', volunteers: '', coordinator: '', phone: '', programs: '' });

  const fetchItems = async () => {
    try {
      const [presenceRes, corpRes] = await Promise.all([
        fetch('/api/presence'),
        fetch('/api/corporate?t=' + Date.now())
      ]);
      const presenceData = await presenceRes.json();
      setItems(Array.isArray(presenceData) ? presenceData : []);
      
      const corpData = await corpRes.json();
      if (corpData && corpData.operationalCenters) {
        const centers = corpData.operationalCenters.split(',').map(s => s.trim()).filter(Boolean);
        setOperationalCenters(centers);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...formData, 
        id: editing ? formData.id : (formData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 5)),
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
        <h3 style={{ color: '#15F5BA', marginBottom: '15px' }}>{editing ? 'Edit' : 'Add New'} Presence & Location</h3>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#fff', fontSize: '0.85rem' }}>State Name</label>
              <select className="form-input" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', appearance: 'menulist' }}>
                <option value="" disabled>Select State</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state} style={{ color: '#000' }}>{state}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#fff', fontSize: '0.85rem' }}>Headquarters</label>
              <select className="form-input" required value={formData.hq || ''} onChange={e => setFormData({...formData, hq: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', appearance: 'menulist' }}>
                <option value="" disabled>Select HQ / Operations City</option>
                {operationalCenters.map(city => (
                  <option key={city} value={city} style={{ color: '#000' }}>{city}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#fff', fontSize: '0.85rem' }}>Volunteers Count</label>
              <input type="number" className="form-input" required value={formData.volunteers || ''} onChange={e => setFormData({...formData, volunteers: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#fff', fontSize: '0.85rem' }}>Coordinator Name</label>
              <input type="text" className="form-input" required value={formData.coordinator || ''} onChange={e => setFormData({...formData, coordinator: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ color: '#fff', fontSize: '0.85rem' }}>Phone</label>
              <input type="text" className="form-input" required value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '16px' }}>
            <label style={{ color: '#fff', fontSize: '0.85rem' }}>Programs (Comma separated)</label>
            <input type="text" className="form-input" value={formData.programs || ''} onChange={e => setFormData({...formData, programs: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px' }} placeholder="e.g. Health Clinic, School Project" />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Save New Location'}</button>
            {editing && <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setFormData({ id: '', name: '', hq: '', volunteers: '', coordinator: '', phone: '', programs: '' }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>State Location</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>Headquarters</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>Coordinator</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#15F5BA' }}>Volunteers</th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#15F5BA' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>ID: {item.id}</div>
                </td>
                <td style={{ padding: '12px' }}>{item.hq}</td>
                <td style={{ padding: '12px' }}>
                  <div>{item.coordinator}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{item.phone}</div>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ background: 'rgba(21, 245, 186, 0.1)', color: '#15F5BA', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>{item.volunteers}</span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button onClick={() => editItem(item)} style={{ background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)', color: '#f97316', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}><i className="fa-solid fa-pen"></i> Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No locations found. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PresenceLocationManager;
