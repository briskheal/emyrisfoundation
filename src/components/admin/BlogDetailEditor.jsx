import React, { useState, useEffect } from 'react';
import WysiwygEditor from './WysiwygEditor';
import { compressImage } from '../../lib/imageCompressor';

const BlogDetailEditor = ({ blog, token, onBack }) => {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    titleSize: blog?.titleSize || '3.5rem',
    bannerImg: blog?.bannerImg || '',
    content: blog?.content || '',
    author: blog?.author || '',
    publishedAt: blog?.publishedAt ? new Date(blog.publishedAt).toISOString().slice(0,10) : ''
  });
  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(''); // '' | 'compressing' | 'uploading'
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        titleSize: blog.titleSize || '3.5rem',
        bannerImg: blog.bannerImg || '',
        content: blog.content || '',
        author: blog.author || '',
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString().slice(0,10) : ''
      });
    }
  }, [blog]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus('compressing');
    try {
      const compressedFile = await compressImage(file);
      
      setUploadStatus('uploading');
      const form = new FormData();
      form.append('file', compressedFile);
      const res = await fetch('/api/upload', { 
        method: 'POST', 
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form 
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, bannerImg: data.url }));
      } else {
        alert('Upload failed: ' + (data.error || 'Server error'));
      }
    } catch (err) {
      alert('Failed to upload image: ' + (err.message || String(err)));
      setUploadStatus('');
    }
    setUploadStatus('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert('Save failed');
      }
    } catch (err) {
      alert('Error saving data');
    }
    setSaving(false);
  };

  return (
    <div className="admin-section">
      <button onClick={onBack} style={{ marginBottom: '20px', padding: '8px 16px', background: 'var(--text-muted)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
        &larr; Back to Blogs
      </button>

      <h2 style={{ color: 'var(--primary-orange)', marginBottom: '20px' }}>Editing Blog: {formData.title}</h2>

      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--primary-orange)' }}>Title</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', color: 'black' }}
              placeholder="Blog Title"
            />
            <select
              value={formData.titleSize}
              onChange={(e) => setFormData({...formData, titleSize: e.target.value})}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: 'white' }}
              title="Title Font Size"
            >
              <option value="1.5rem">Smallest</option>
              <option value="2.5rem">Small</option>
              <option value="3.5rem">Normal (Default)</option>
              <option value="4.5rem">Large</option>
              <option value="5.5rem">Huge</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--primary-orange)' }}>Author</label>
          <input 
            type="text" 
            value={formData.author} 
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', color: 'black' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--primary-orange)' }}>Publish Date</label>
          <input 
            type="date" 
            value={formData.publishedAt} 
            onChange={(e) => setFormData({...formData, publishedAt: e.target.value})}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', color: 'black' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--primary-orange)' }}>Banner Image (Auto-converts to WebP)</label>
          {formData.bannerImg && (
            <img src={formData.bannerImg} alt="Banner" style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', marginBottom: '10px' }} />
          )}
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploadStatus !== ''} />
          {uploadStatus === 'compressing' && <span style={{ marginLeft: '10px', color: 'var(--primary-orange)' }}>Compressing image (this is fast)...</span>}
          {uploadStatus === 'uploading' && <span style={{ marginLeft: '10px', color: '#15F5BA' }}>Uploading to server...</span>}
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--primary-orange)', fontWeight: 600 }}>
            Blog Content (Rich Text Editor)
          </label>
          <WysiwygEditor 
            value={formData.content} 
            onChange={(html) => setFormData({ ...formData, content: html })} 
          />
        </div>

        <button onClick={handleSave} style={{ padding: '15px 30px', background: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }} disabled={saving}>
          {saving ? 'Saving...' : 'Save Blog'}
        </button>
        {saved && <span style={{ marginLeft: '15px', color: 'green', fontWeight: 'bold' }}>Saved Successfully!</span>}
      </div>
    </div>
  );
};

export default BlogDetailEditor;
