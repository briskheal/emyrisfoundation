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
      
      <div className="glass-card" style={{ padding: '25px', marginBottom: '30px', background: 'rgba(15, 23, 42, 0.6)', borderLeft: '4px solid #15F5BA' }}>
        <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '20px', fontWeight: '600' }}>
          <i className="fa-solid fa-user-plus" style={{ color: '#15F5BA', marginRight: '10px' }}></i>
          {editing ? 'Edit Champion Details' : 'Add New Champion'}
        </h3>
        
        <form onSubmit={handleSave} style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          
          {/* Name Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '2 1 250px' }}>
            <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: '500', letterSpacing: '0.5px' }}>CHAMPION NAME</label>
            <input 
              required
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)',
                color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'border 0.3s'
              }}
              placeholder="e.g. John Doe or Acme Corp" 
            />
          </div>

          {/* Logo Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '2 1 250px' }}>
            <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: '500', letterSpacing: '0.5px' }}>LOGO OR PHOTO (OPTIONAL)</label>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: '8px',
                  border: '1px dashed rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.1)',
                  color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', cursor: 'pointer'
                }}
              />
              {preview && <img src={preview} alt="Preview" style={{ height: '42px', width: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} />}
            </div>
          </div>

          {/* Order Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100px' }}>
            <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: '500', letterSpacing: '0.5px' }}>ORDER</label>
            <input 
              type="number" 
              value={formData.order} 
              onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} 
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)',
                color: 'white', fontSize: '0.95rem', outline: 'none', textAlign: 'center'
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', height: '46px', flex: '1 1 120px' }}>
            <button type="submit" style={{
              flex: 1, padding: '0 20px', background: '#15F5BA', color: '#000',
              border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background 0.2s', whiteSpace: 'nowrap'
            }}>
              <i className="fa-solid fa-floppy-disk"></i> {editing ? 'Save Changes' : 'Save'}
            </button>
            {editing && (
              <button type="button" onClick={() => {
                setEditing(null);
                setFormData({ name: '', order: 0, image: null });
                setPreview(null);
              }} style={{
                padding: '0 20px', background: 'rgba(255,255,255,0.1)', color: 'white',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: '500',
                cursor: 'pointer', transition: 'background 0.2s'
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
