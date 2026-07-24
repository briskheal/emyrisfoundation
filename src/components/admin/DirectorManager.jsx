import React, { useState, useEffect } from 'react';

const DirectorManager = ({ token }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  
  const [formData, setFormData] = useState({ id: '', name: '', role: '', bio: '', img: '' });
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/directors');
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
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, img: data.url }));
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
    if (!formData.name) return alert('Name required');
    
    const isNew = !editing;
    const method = isNew ? 'POST' : 'PUT';
    
    const payload = { ...formData };
    if (isNew && !payload.id) {
      payload.id = 'dir-' + Date.now();
    }

    try {
      const res = await fetch('/api/directors', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setEditing(null);
        setFormData({ id: '', name: '', role: '', bio: '', img: '' });
        fetchItems();
      } else {
        alert('Save failed');
      }
    } catch (err) {
      alert('Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this director?')) return;
    try {
      const res = await fetch(`/api/directors?id=${id}`, {
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
    setFormData(item);
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({ id: '', name: '', role: '', bio: '', img: '' });
  };

  if (loading) return <div style={{ color: 'white' }}>Loading Directors...</div>;

  return (
    <div>
      <h3 style={{ color: 'white', marginBottom: '20px' }}><i className="fa-solid fa-user-tie" style={{ color: '#f97316' }}></i> Manage Board of Directors</h3>
      
      <div style={{ display: 'grid', gap: '16px', marginBottom: '30px' }}>
        {items.map(item => (
          <div key={item.id} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center'
          }}>
            {item.img ? (
              <img src={item.img} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>No Img</div>
            )}
            <div style={{ flex: 1 }}>
              <h4 style={{ color: 'white', margin: '0 0 4px 0', fontSize: '1.1rem' }}>{item.name}</h4>
              <p style={{ color: '#f97316', margin: '0 0 8px 0', fontSize: '0.85rem', fontWeight: 600 }}>{item.role}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.bio}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => editItem(item)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}><i className="fa-solid fa-pen"></i></button>
              <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.2)', border: 'none', color: '#f87171', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', padding: '24px' }}>
        <h4 style={{ color: 'white', marginTop: 0 }}>{editing ? 'Edit Director' : 'Add New Director'}</h4>
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px' }}>Name *</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px' }}>Role/Title *</label>
              <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', outline: 'none' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px' }}>Bio / Description</label>
            <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', minHeight: '80px', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px' }}>Photo Upload</label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <label style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '0.9rem' }}>
                <i className="fa-solid fa-upload"></i> {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
              </label>
              {formData.img && <img src={formData.img} alt="Preview" style={{ height: '40px', borderRadius: '4px' }} />}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button type="submit" style={{ padding: '10px 24px', background: '#f97316', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              {editing ? 'Update Director' : 'Add Director'}
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

export default DirectorManager;
