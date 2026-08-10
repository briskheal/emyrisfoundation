import React, { useState, useEffect } from 'react';

const NewsManager = ({ token, onEdit }) => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      setNewsList(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    const today = new Date();
    const month = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear().toString();

    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          activityDate: today.toISOString().slice(0,10),
          month,
          year,
          content: ''
        })
      });
      if (res.ok) {
        setNewTitle('');
        fetchNews();
      } else {
        alert('Failed to add news activity');
      }
    } catch (err) {
      alert('Error adding news activity');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this news activity?')) return;
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchNews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ color: 'white' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: 'white' }}>Manage News & Activities</h2>
      </div>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="New Activity Title" 
          className="admin-input" 
          style={{ flex: 1 }}
        />
        <button type="submit" className="admin-btn admin-btn-primary">Add New</button>
      </form>

      <div style={{ display: 'grid', gap: '15px' }}>
        {newsList.map(news => (
          <div key={news.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
            <div style={{ color: 'white' }}>
              <h4 style={{ margin: '0 0 5px 0', color: 'white' }}>{news.title}</h4>
              <small style={{ color: '#aaa' }}>{news.activityDate ? new Date(news.activityDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : ''}</small>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => onEdit(news)} className="admin-btn">Edit Details & Content</button>
              <button onClick={() => handleDelete(news.id)} className="admin-btn" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>Delete</button>
            </div>
          </div>
        ))}
        {newsList.length === 0 && <p style={{ color: '#aaa' }}>No activities found.</p>}
      </div>
    </div>
  );
};

export default NewsManager;
