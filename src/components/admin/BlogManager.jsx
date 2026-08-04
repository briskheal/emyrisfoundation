import React, { useState, useEffect } from 'react';

const BlogManager = ({ token, onEdit }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          publishedAt: new Date().toISOString(),
          order: blogs.length
        })
      });
      if (res.ok) {
        setNewTitle('');
        fetchBlogs();
      } else {
        alert('Failed to add blog');
      }
    } catch (err) {
      alert('Error adding blog');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (err) {
      alert('Error deleting blog');
    }
  };

  if (loading) return <div>Loading Blogs...</div>;

  return (
    <div className="admin-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Manage Blogs</h2>
      </div>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New Blog Title"
          style={{ padding: '8px', flex: 1, border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button type="submit" className="admin-btn">Add Blog</button>
      </form>

      <div style={{ display: 'grid', gap: '15px' }}>
        {blogs.map(blog => (
          <div key={blog.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>{blog.title}</h4>
              <small style={{ color: '#666' }}>{new Date(blog.publishedAt).toLocaleDateString()}</small>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="admin-btn" style={{ background: 'var(--secondary-blue)' }} onClick={() => onEdit(blog)}>Edit Content</button>
              <button className="admin-btn" style={{ background: '#dc3545' }} onClick={() => handleDelete(blog.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogManager;
