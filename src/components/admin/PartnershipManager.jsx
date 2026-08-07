import React, { useState, useEffect } from 'react';

const PartnershipManager = ({ token, onEdit }) => {
  const [partnerships, setpartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');

  const fetchpartnerships = async () => {
    try {
      const res = await fetch('/api/partnerships');
      const data = await res.json();
      if (Array.isArray(data)) {
        setpartnerships(data);
      } else {
        console.error('API returned non-array:', data);
        setpartnerships([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchpartnerships();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await fetch('/api/partnerships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          order: partnerships.length
        })
      });
      if (res.ok) {
        setNewTitle('');
        fetchpartnerships();
      } else {
        alert('Failed to add partnership');
      }
    } catch (err) {
      alert('Error adding partnership');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this partnership?')) return;
    try {
      const res = await fetch(`/api/partnerships/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchpartnerships();
      }
    } catch (err) {
      alert('Error deleting partnership');
    }
  };

  if (loading) return <div>Loading partnerships...</div>;

  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
      <h3 style={{ color: 'white', marginBottom: '20px' }}><i className="fa-solid fa-handshake" style={{ color: '#15F5BA' }}></i> Partnerships</h3>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          value={newTitle} 
          onChange={e => setNewTitle(e.target.value)} 
          placeholder="New Partnership Title" 
          required 
          style={{ padding: '12px', flex: 1, border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', background: 'transparent', color: 'white', fontSize: '1rem' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: 'var(--primary-orange)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Add Partnership</button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {partnerships.map(partnership => (
          <div key={partnership.id} style={{ padding: '15px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'white' }}>
              <h4 style={{ margin: '0 0 5px 0', color: 'white' }}>{partnership.title}</h4>
              <small style={{ color: '#aaa' }}>{partnership.createdAt ? new Date(partnership.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : ''}</small>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ padding: '8px 16px', background: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => onEdit(partnership)}>Edit Content</button>
              <button style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => handleDelete(partnership.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnershipManager;
