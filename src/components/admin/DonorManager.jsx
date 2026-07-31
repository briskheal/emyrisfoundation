import React, { useState, useEffect } from 'react';

const DonorManager = ({ token }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conflictInfo, setConflictInfo] = useState(null);
  const [loadedAt, setLoadedAt] = useState(null);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', order: 0, image: null });
  const [preview, setPreview] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/donors');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
      setLoadedAt(new Date().toISOString());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      if (editing) data.append('id', editing);
      data.append('name', formData.name);
      data.append('order', formData.order);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const res = await fetch('/api/donors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (res.status === 409) {
        const d = await res.json();
        setConflictInfo(d);
        return;
      }

      if (res.ok) {
        setFormData({ name: '', order: 0, image: null });
        setPreview(null);
        setEditing(null);
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this champion?')) return;
    try {
      const res = await fetch(`/api/donors?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const editItem = (item) => {
    setEditing(item.id);
    setFormData({ name: item.name, order: item.order, image: null });
    setPreview(item.image);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="admin-panel-section" style={{ display: 'block' }}>
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>Manage Champions (Donors)</h2>
      
      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ color: '#15F5BA', marginBottom: '15px' }}>{editing ? 'Edit' : 'Add New'} Champion</h3>
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 80px 120px', gap: '15px', alignItems: 'end' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.85rem' }}>Champion Name</label>
            <input 
              required
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="admin-input" 
              placeholder="e.g. John Doe / Acme Corp" 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.85rem' }}>Logo/Photo (Auto WebP)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', height: '42.5px' }}>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="admin-input" 
                style={{ padding: '8px', flex: 1, height: '100%', boxSizing: 'border-box' }}
              />
              {preview && <img src={preview} alt="Preview" style={{ height: '36px', borderRadius: '4px' }} />}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.85rem' }}>Order</label>
            <input 
              type="number" 
              value={formData.order} 
              onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} 
              className="admin-input" 
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', height: '42.5px' }}>
            <button type="submit" className="admin-btn" style={{ flex: 1, padding: '0 10px' }}>
              <i className="fa-solid fa-save"></i> Save
            </button>
            {editing && (
              <button type="button" className="admin-btn" style={{ background: '#475569' }} onClick={() => {
                setEditing(null);
                setFormData({ name: '', order: 0, image: null });
                setPreview(null);
              }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ color: '#15F5BA', marginBottom: '15px' }}>Current Champions</h3>
        {loading ? <p style={{ color: '#fff' }}>Loading...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', color: '#fff', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Order</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Image</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding: '10px', textAlign: 'center', color: '#ccc' }}>No champions found.</td></tr>
                ) : items.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px' }}>{item.order}</td>
                    <td style={{ padding: '10px' }}>
                      {item.image ? <img src={item.image} alt="Logo" style={{ height: '30px', borderRadius: '4px' }} /> : 'None'}
                    </td>
                    <td style={{ padding: '10px' }}>{item.name}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <button onClick={() => editItem(item)} className="admin-btn" style={{ padding: '5px 10px', marginRight: '5px' }}>
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="admin-btn" style={{ padding: '5px 10px', background: '#ef4444' }}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorManager;
