import React, { useState, useEffect, useRef } from 'react';
import { compressImage } from '../../lib/imageCompressor';
import ImageCropModal from './ImageCropModal';

const NewsManager = ({ token, onEdit }) => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  
  // Banner state
  const [corporateData, setCorporateData] = useState({});
  const [bannerSaving, setBannerSaving] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [cropFileName, setCropFileName] = useState('');
  const fileInputRef = useRef(null);

  const fetchNews = async () => {
    try {
      const resCorp = await fetch('/api/corporate');
      const dataCorp = await resCorp.json();
      setCorporateData(dataCorp || {});

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

  const handleFileSelect = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      if (fileInputRef.current) fileInputRef.current.value = '';
      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result);
        setCropFileName(file.name.replace(/\.[^/.]+$/, "") + ".webp");
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error reading file:", err);
    }
  };

  const handleCropComplete = async (croppedFile) => {
    setCropSrc(null);
    setBannerSaving(true);
    try {
      const compressedFile = await compressImage(croppedFile);
      const form = new FormData();
      form.append('file', compressedFile);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: form
      });
      
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const imageUrl = data.url;

      const saveRes = await fetch('/api/corporate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...corporateData, newsBanner: imageUrl })
      });
      
      if (saveRes.ok) {
        setCorporateData({ ...corporateData, newsBanner: imageUrl });
      } else {
        alert('Failed to save banner');
      }
    } catch (err) {
      alert('Error uploading banner');
    } finally {
      setBannerSaving(false);
    }
  };

  if (loading) return <div style={{ color: 'white' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: 'white' }}>Manage News & Activities</h2>
      </div>

      {/* Banner Upload Section */}
      <div className="admin-card" style={{ padding: '20px', marginBottom: '30px', display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.03)' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>News Page Hero Banner</h3>
          <p style={{ margin: '0 0 15px 0', color: '#aaa', fontSize: '0.9rem' }}>Upload a custom 3:1 banner for the public News page.</p>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileSelect} 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            id="news-banner-upload"
          />
          <label htmlFor="news-banner-upload" className="admin-btn admin-btn-primary" style={{ cursor: 'pointer', display: 'inline-block' }}>
            {bannerSaving ? 'Uploading...' : 'Upload Banner'}
          </label>
        </div>
        {corporateData.newsBanner && (
          <div style={{ flex: 1 }}>
            <img src={corporateData.newsBanner} alt="News Banner" style={{ width: '100%', maxHeight: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
        )}
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

      {cropSrc && (
        <ImageCropModal 
          imageSrc={cropSrc}
          fileName={cropFileName}
          aspect={3 / 1}
          onCropComplete={handleCropComplete}
          onClose={() => setCropSrc(null)}
        />
      )}
    </div>
  );
};

export default NewsManager;
