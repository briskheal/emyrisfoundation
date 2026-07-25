import React, { useState, useEffect } from 'react';
import { ConflictBanner, LastEditedBadge } from '../../lib/useConflictSave';

const MenuLinkManager = ({ token }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conflictInfo, setConflictInfo] = useState(null);
  const [loadedAt, setLoadedAt] = useState(null);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ id: '', label: '', url: '', parentMenu: '' });

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/menus');
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
      const res = await fetch('/api/menus', {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, lastKnownUpdatedAt: loadedAt })
      });
      if (res.status === 409) { const d = await res.json(); setConflictInfo(d); return; }
      if (res.ok) {
        setFormData({ id: '', label: '', url: '', parentMenu: '' });
        setEditing(null);
        fetchItems();
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/menus?id=${id}`, {
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
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>Manage MenuLinks</h2>
      
      <div className="glass-card" style={{ padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ color: '#15F5BA', marginBottom: '15px' }}>{editing ? 'Edit' : 'Add New'} MenuLink</h3>
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>ID</label>
            <input type="text" className="form-input" required value={formData.id || ''} onChange={e => setFormData({...formData, id: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>Label</label>
            <input type="text" className="form-input" required value={formData.label || ''} onChange={e => setFormData({...formData, label: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>URL</label>
            <input type="text" className="form-input" required value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>Parent Menu</label>
            <input type="text" className="form-input" required value={formData.parentMenu || ''} onChange={e => setFormData({...formData, parentMenu: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Save'}</button>
            {editing && <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setFormData({ id: '', label: '', url: '', parentMenu: '' }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>ID</th><th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>Label</th><th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>URL</th><th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>Parent Menu</th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#15F5BA' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px' }}>{item.id}</td><td style={{ padding: '12px' }}>{item.label}</td><td style={{ padding: '12px' }}>{item.url}</td><td style={{ padding: '12px' }}>{item.parentMenu}</td>
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

export default MenuLinkManager;
