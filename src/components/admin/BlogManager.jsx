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
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
      <h3 style={{ color: 'white', marginBottom: '20px' }}><i className="fa-solid fa-blog" style={{ color: '#15F5BA' }}></i> Blog Posts</h3>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          value={newTitle} 
          onChange={e => setNewTitle(e.target.value)} 
          placeholder="New Blog Title" 
          required 
          style={{ padding: '12px', flex: 1, border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', background: 'transparent', color: 'white', fontSize: '1rem' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: 'var(--primary-orange)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Add Blog</button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {blogs.map(blog => (
          <div key={blog.id} style={{ padding: '15px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'white' }}>
              <h4 style={{ margin: '0 0 5px 0', color: 'white' }}>{blog.title}</h4>
              <small style={{ color: '#aaa' }}>{new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</small>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ padding: '8px 16px', background: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => onEdit(blog)}>Edit Content</button>
              <button style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => handleDelete(blog.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogManager;
