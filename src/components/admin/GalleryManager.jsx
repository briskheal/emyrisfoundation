'use client';
import React, { useState, useEffect, useRef } from 'react';

// Helper function to extract YouTube ID
export const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url;
};

export const formatTitle = (title) => {
  if (!title) return '';
  return title.replace(/^(?:#\S+\s*)+/, '').trim();
};

const GalleryManager = ({ token }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    type: 'photo',
    title: '',
    year: new Date().getFullYear().toString(),
    month: new Date().toLocaleString('default', { month: 'long' }),
    youtubeUrl: ''
  });

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMedia(data || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load gallery');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, [token]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    setUploading(true);
    setProgressText('Processing...');

    try {
      if (formData.type === 'photo') {
        const files = fileInputRef.current?.files;
        if (!files || files.length === 0) {
          alert('Please select an image file to upload');
          setUploading(false);
          setProgressText('');
          return;
        }
        
        for (let i = 0; i < files.length; i++) {
          setProgressText(`Uploading & Optimizing ${i + 1} of ${files.length}...`);
          const file = files[i];
          const data = new FormData();
          data.append('file', file);
    
          // Upload file
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: data
          });
    
          if (!uploadRes.ok) throw new Error(`File ${i + 1} upload failed`);
          const uploadData = await uploadRes.json();
          const finalUrl = uploadData.url;

          // Save media record
          const mediaRes = await fetch('/api/gallery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              type: formData.type,
              title: formData.title ? (files.length > 1 ? `${formData.title} ${i + 1}` : formData.title) : `Photo ${i + 1}`,
              year: formData.year,
              month: formData.month,
              url: finalUrl
            })
          });
          if (!mediaRes.ok) throw new Error(`Failed to save record for file ${i + 1}`);
        }

        setFormData({ ...formData, title: '', youtubeUrl: '' });
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchMedia();

      } else {
        // Video
        if (!formData.youtubeUrl) {
          alert('Please provide a valid YouTube URL');
          setUploading(false);
          setProgressText('');
          return;
        }
        const finalUrl = getYoutubeEmbedUrl(formData.youtubeUrl);

        // Save media record
        const mediaRes = await fetch('/api/gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            type: formData.type,
            title: formData.title,
            year: formData.year,
            month: formData.month,
            url: finalUrl
          })
        });

        if (mediaRes.ok) {
          setFormData({ ...formData, title: '', youtubeUrl: '' });
          if (fileInputRef.current) fileInputRef.current.value = '';
          fetchMedia();
        } else {
          throw new Error('Failed to save media record');
        }
      }
    } catch (err) {
      alert(err.message);
    }
    setUploading(false);
    setProgressText('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this media?')) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchMedia();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && media.length === 0) return <div>Loading gallery...</div>;

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: Math.max(1, currentYear - 2024 + 1)}, (_, i) => (2024 + i).toString()).reverse();

  return (
    <div className="admin-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Activity Gallery Manager</h3>
        <button className="btn btn-secondary btn-sm" onClick={fetchMedia}>Refresh</button>
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div className="glass-card" style={{ padding: '20px', marginBottom: '30px' }}>
        <h4>Add New Media</h4>
        <form onSubmit={handleUpload} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Media Type</label>
            <select name="type" value={formData.type} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }}>
              <option value="photo">Photo</option>
              <option value="video">YouTube Video</option>
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Title (Optional)</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Health Camp in Surat" style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ flex: '1 1 120px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Year</label>
            <select name="year" value={formData.year} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Month</label>
            <select name="month" value={formData.month} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }}>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          
          {formData.type === 'photo' ? (
            <div style={{ flex: '1 1 100%' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Image Files (Select multiple)</label>
              <input type="file" ref={fileInputRef} accept="image/*" multiple style={{ width: '100%', padding: '6px' }} />
            </div>
          ) : (
            <div style={{ flex: '1 1 100%' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>YouTube URL</label>
              <input type="text" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=..." style={{ width: '100%', padding: '8px' }} />
            </div>
          )}

          <div style={{ flex: '1 1 100%', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? progressText : (formData.type === 'photo' ? 'Upload Photos' : 'Add Video')}
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {media.map((item) => (
          <div key={item.id} className="glass-card" style={{ padding: '10px', position: 'relative' }}>
            {item.type === 'photo' ? (
              <img src={item.url} alt={item.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
            ) : (
              <iframe src={getYoutubeEmbedUrl(item.url)} style={{ width: '100%', height: '150px', border: 'none', borderRadius: '4px' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            )}
            <div style={{ marginTop: '10px' }}>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={formatTitle(item.title) || 'Untitled'}>{formatTitle(item.title) || 'Untitled'}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{item.month} {item.year}</p>
            </div>
            <button 
              onClick={() => handleDelete(item.id)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,0,0,0.8)', border: 'none', color: 'white', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;
