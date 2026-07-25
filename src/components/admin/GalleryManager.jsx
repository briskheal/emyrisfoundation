'use client';
import React, { useState, useEffect, useRef } from 'react';

// Helper function to extract YouTube ID
export const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v');
  } else if (url.includes('youtube.com/embed/')) {
    return url;
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const GalleryManager = ({ token }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    type: 'photo',
    title: '',
    year: new Date().getFullYear().toString(),
    month: new Date().toLocaleString('default', { month: 'long' }),
    youtubeUrl: ''
  });

  const seedSampleData = async () => {
    setLoading(true);
    const mediaItems = [
      { type: 'video', title: 'Community Outreach 2025', url: 'https://youtu.be/ut7Nfd8Pq3s?si=id3g2T4HCDOP3-lu', year: '2025', month: 'January' },
      { type: 'video', title: 'Education Program 2025', url: 'https://youtu.be/mY78VWPhyw8?si=nLmyCoWDQqd1AZos', year: '2025', month: 'March' },
      { type: 'photo', title: 'Food Distribution', url: 'https://images.unsplash.com/photo-1593113589914-07599c18fda7?auto=format&fit=crop&w=800&q=80', year: '2025', month: 'January' },
      { type: 'photo', title: 'School Supplies', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80', year: '2025', month: 'March' },
      { type: 'photo', title: 'Medical Camp 2026', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80', year: '2026', month: 'August' },
      { type: 'video', title: 'Annual Gala 2026', url: 'https://youtu.be/ut7Nfd8Pq3s?si=id3g2T4HCDOP3-lu', year: '2026', month: 'August' },
      { type: 'photo', title: 'Volunteer Training', url: 'https://images.unsplash.com/photo-1559027615-cd4628ce02df?auto=format&fit=crop&w=800&q=80', year: '2026', month: 'September' },
    ];
    for (const item of mediaItems) {
      await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(item)
      });
    }
    await fetchMedia();
    setSuccess('Sample data seeded successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

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
    let finalUrl = '';

    try {
      if (formData.type === 'photo') {
        const file = fileInputRef.current?.files[0];
        if (!file) {
          alert('Please select an image file to upload');
          setUploading(false);
          return;
        }
        
        const data = new FormData();
        data.append('file', file);
  
        // Upload file
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: data
        });
  
        if (!uploadRes.ok) throw new Error('File upload failed');
        const uploadData = await uploadRes.json();
        finalUrl = uploadData.url;
      } else {
        // Video
        if (!formData.youtubeUrl) {
          alert('Please provide a valid YouTube URL');
          setUploading(false);
          return;
        }
        finalUrl = formData.youtubeUrl;
      }

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
    } catch (err) {
      alert(err.message);
    }
    setUploading(false);
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
  const years = Array.from({length: 10}, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <div className="admin-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Activity Gallery Manager</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={seedSampleData}>Seed Sample Data</button>
          <button className="btn btn-secondary btn-sm" onClick={fetchMedia}>Refresh</button>
        </div>
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
              <label style={{ display: 'block', marginBottom: '5px' }}>Image File</label>
              <input type="file" ref={fileInputRef} accept="image/*" style={{ width: '100%', padding: '6px' }} />
            </div>
          ) : (
            <div style={{ flex: '1 1 100%' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>YouTube URL</label>
              <input type="text" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=..." style={{ width: '100%', padding: '8px' }} />
            </div>
          )}

          <div style={{ flex: '1 1 100%', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? 'Processing...' : (formData.type === 'photo' ? 'Upload Photo' : 'Add Video')}
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
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title || 'Untitled'}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'gray' }}>{item.month} {item.year}</p>
            </div>
            <button 
              onClick={() => handleDelete(item.id)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', zIndex: 10 }}
              title="Delete"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        ))}
        {media.length === 0 && <p style={{ gridColumn: '1 / -1' }}>No media found.</p>}
      </div>
    </div>
  );
};

export default GalleryManager;
