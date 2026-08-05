import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../../api';
import { compressImage } from '../../lib/imageCompressor';
import ImageCropModal from './ImageCropModal';

const WorkDetailEditor = ({ token }) => {
  const [activeWork, setActiveWork] = useState('work-education');
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Banner Upload State
  const [uploadStatus, setUploadStatus] = useState('');
  const [cropSrc, setCropSrc] = useState(null);
  const [cropFileName, setCropFileName] = useState('');
  const bannerInputRef = useRef(null);

  useEffect(() => {
    fetchDetail();
  }, [activeWork]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/work-details/${activeWork}`);
      if (res.ok) {
        const data = await res.json();
        setDetail(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/work-details/${activeWork}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(detail)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleBannerSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (bannerInputRef.current) bannerInputRef.current.value = '';
    
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result);
      setCropFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile) => {
    setCropSrc(null);
    setUploadStatus('compressing');
    
    try {
      const compressedFile = await compressImage(croppedFile, 1200, 0.85);
      
      setUploadStatus('uploading');
      const formData = new FormData();
      formData.append('file', compressedFile);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      if (data.url) {
        setDetail({...detail, bannerImg: data.url});
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading banner');
    } finally {
      setUploadStatus('');
    }
  };

  if (loading || !detail) return <div>Loading...</div>;

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h2>Dedicated Page Details</h2>
      </div>
      <div className="admin-card-body">
        <div className="form-group mb-4">
          <label>Select Pillar to Edit:</label>
          <select className="form-control" value={activeWork} onChange={e => setActiveWork(e.target.value)}>
            <option value="work-education">Education</option>
            <option value="work-health">Healthcare</option>
            <option value="work-livelihood">Livelihood</option>
            <option value="work-women">Women Empowerment</option>
            <option value="work-farmers">Farmer's Connect</option>
          </select>
        </div>

        <div className="form-group mb-4" style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
          <label style={{ color: '#15F5BA', fontWeight: 'bold' }}>Page Banner Image (3:1 Ratio)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <input type="file" accept="image/*" ref={bannerInputRef} onChange={handleBannerSelect} disabled={uploadStatus !== ''} style={{ color: 'white' }} />
            <button 
              onClick={handleSave} 
              disabled={saving || !detail.bannerImg} 
              style={{ padding: '6px 12px', background: 'var(--primary-orange)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
            >
              {saving ? 'Saving...' : 'Save Banner'}
            </button>
          </div>
          {uploadStatus === 'compressing' && <span style={{ marginLeft: '10px', color: 'var(--primary-orange)' }}>Compressing image (this is fast)...</span>}
          {uploadStatus === 'uploading' && <span style={{ marginLeft: '10px', color: '#15F5BA' }}>Uploading to server...</span>}
          {uploadStatus === '' && detail.bannerImg && <span style={{ marginLeft: '10px', color: '#15F5BA', fontWeight: 'bold', display: 'block', marginTop: '5px' }}>✓ Image loaded! Click "Save Banner" to keep it.</span>}
        </div>

        <div className="form-group mb-3">
          <label>Banner Title</label>
          <input type="text" className="form-control" value={detail.bannerTitle || ''} onChange={e => setDetail({...detail, bannerTitle: e.target.value})} />
        </div>
        
        <div className="form-group mb-3">
          <label>Why Title</label>
          <input type="text" className="form-control" value={detail.whyTitle || ''} onChange={e => setDetail({...detail, whyTitle: e.target.value})} />
        </div>

        <div className="form-group mb-4">
          <label>Why Text (RTE / SDGs)</label>
          <textarea className="form-control" rows="8" value={detail.whyText || ''} onChange={e => setDetail({...detail, whyText: e.target.value})}></textarea>
        </div>

        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <i className="fa-solid fa-save"></i> {saving ? 'Saving...' : 'Save Page Changes'}
        </button>
        {saved && <span className="text-success ml-3" style={{marginLeft: '15px'}}><i className="fa-solid fa-check"></i> Saved successfully!</span>}
      </div>

      {cropSrc && (
        <ImageCropModal 
          imageSrc={cropSrc}
          fileName={cropFileName}
          aspect={3 / 1}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </div>
  );
};

export default WorkDetailEditor;
