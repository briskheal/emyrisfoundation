import React, { useState, useEffect, useRef } from 'react';
import WysiwygEditor from './WysiwygEditor';
import { compressImage } from '../../lib/imageCompressor';
import ImageCropModal from './ImageCropModal';

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
  
  // Crop state
  const [cropSrc, setCropSrc] = useState(null);
  const [cropFileName, setCropFileName] = useState('');
  const fileInputRef = useRef(null);

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

  const handleFileSelect = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) {
        return;
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result);
        setCropFileName(file.name);
      };
      reader.onerror = (err) => {
        alert('FileReader error: ' + err);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert('Error in handleFileSelect: ' + err.message);
    }
  };

  const handleDeleteBanner = () => {
    if (confirm('Are you sure you want to delete the banner? (You MUST click "Save Content" at the top to permanently remove it from the database)')) {
      setFormData(prev => ({ ...prev, bannerImg: '' }));
    }
  };

  const handleCropComplete = async (croppedFile) => {
    setCropSrc(null); // Close modal
    setUploadStatus('compressing');
    try {
      const compressedFile = await compressImage(croppedFile);
      
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

  const handleCropCancel = () => {
    setCropSrc(null);
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
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
              <img src={formData.bannerImg} alt="Banner" style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }} />
              <button 
                type="button" 
                onClick={handleDeleteBanner}
                style={{ position: 'absolute', top: '5px', right: '5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Delete Banner"
              >
                ✕
              </button>
            </div>
          )}
          <br/>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} disabled={uploadStatus !== ''} />
            <button 
              onClick={handleSave} 
              disabled={saving || !formData.bannerImg} 
              style={{ padding: '6px 12px', background: 'var(--primary-orange)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
            >
              {saving ? 'Saving...' : 'Save Banner'}
            </button>
          </div>
          {uploadStatus === 'compressing' && <span style={{ marginLeft: '10px', color: 'var(--primary-orange)' }}>Compressing image (this is fast)...</span>}
          {uploadStatus === 'uploading' && <span style={{ marginLeft: '10px', color: '#15F5BA' }}>Uploading to server...</span>}
          {uploadStatus === '' && formData.bannerImg && <span style={{ marginLeft: '10px', color: '#15F5BA', fontWeight: 'bold', display: 'block', marginTop: '5px' }}>✓ Image loaded! Click "Save Banner" to keep it.</span>}
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

      {cropSrc && (
        <ImageCropModal 
          imageSrc={cropSrc}
          fileName={cropFileName}
          aspect={3 / 1}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default BlogDetailEditor;
