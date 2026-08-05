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
  
  // Unified Uploader State
  const [uploadTarget, setUploadTarget] = useState('banner'); // 'banner' or 'impact'
  const [uploadStatus, setUploadStatus] = useState('');
  const [cropSrc, setCropSrc] = useState(null);
  const [cropFileName, setCropFileName] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDetail();
  }, [activeWork]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/work-details/${activeWork}`);
      if (res.ok) {
        const data = await res.json();
        setDetail(data);
      } else {
        // If it doesn't exist yet, start with a blank template
        setDetail({
          bannerImg: '',
          bannerTitle: '',
          whyTitle: '',
          whyText: '',
          impactMedia: []
        });
      }
    } catch (err) {
      console.error(err);
      setDetail({ bannerImg: '', bannerTitle: '', whyTitle: '', whyText: '', impactMedia: [] });
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result);
      setCropFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const removeImpactPhoto = (index) => {
    const newMedia = [...(detail.impactMedia || [])];
    newMedia.splice(index, 1);
    setDetail({ ...detail, impactMedia: newMedia });
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
        if (uploadTarget === 'banner') {
          setDetail({...detail, bannerImg: data.url});
        } else if (uploadTarget === 'impact') {
          setDetail(prev => ({
            ...prev,
            impactMedia: [...(prev.impactMedia || []), { url: data.url, title: 'New Impact Photo' }]
          }));
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploadStatus('');
    }
  };

  if (loading || !detail) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: 'white' }}><i className="fa-solid fa-file-lines" style={{ color: '#15F5BA' }}></i> Work Pillar Page Editor</h3>
      </div>
      
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '8px' }}>Select Pillar to Edit:</label>
          <select 
            value={activeWork} 
            onChange={e => setActiveWork(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#222', color: 'white' }}
          >
            <option value="work-education">Education</option>
            <option value="work-health">Healthcare</option>
            <option value="work-livelihood">Livelihood</option>
            <option value="work-women">Women Empowerment</option>
            <option value="work-farmers">Farmer's Connect</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Banner Title</label>
            <input type="text" value={detail.bannerTitle || ''} onChange={e => setDetail({...detail, bannerTitle: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Why Title</label>
            <input type="text" value={detail.whyTitle || ''} onChange={e => setDetail({...detail, whyTitle: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Why Text (RTE / SDGs)</label>
          <textarea rows="5" value={detail.whyText || ''} onChange={e => setDetail({...detail, whyText: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }}></textarea>
        </div>

        {/* Impact Photos Preview */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginBottom: '20px' }}>
          <h4 style={{ color: '#15F5BA', marginBottom: '15px' }}>Impact Photos Gallery</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
            {(detail.impactMedia || []).map((photo, idx) => (
              <div key={idx} style={{ position: 'relative', width: '150px' }}>
                <img src={photo.url} alt="Impact" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />
                <button 
                  onClick={() => removeImpactPhoto(idx)}
                  style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', color: '#ff4d4d', border: 'none', cursor: 'pointer', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Remove Photo"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            ))}
            {(!detail.impactMedia || detail.impactMedia.length === 0) && (
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>No impact photos added yet. Use the Smart Uploader below.</span>
            )}
          </div>
        </div>

        {/* Unified Smart Uploader */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginBottom: '20px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px' }}>
          <h4 style={{ color: '#15F5BA', marginBottom: '15px' }}><i className="fa-solid fa-cloud-arrow-up"></i> Smart Media Uploader</h4>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '15px' }}>Select what you want to upload, then pick your image. It will automatically be cropped and optimized for the site.</p>
          
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="uploadTarget" 
                value="banner" 
                checked={uploadTarget === 'banner'} 
                onChange={() => setUploadTarget('banner')} 
              />
              Page Banner Image (3:1)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="uploadTarget" 
                value="impact" 
                checked={uploadTarget === 'impact'} 
                onChange={() => setUploadTarget('impact')} 
              />
              Impact Photo (1.5:1)
            </label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              disabled={uploadStatus !== ''} 
              style={{ display: 'none' }} 
              id="work-unified-uploader"
            />
            <label htmlFor="work-unified-uploader" style={{ padding: '8px 16px', background: 'var(--primary-orange)', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}>
              Choose File
            </label>
            
            {uploadStatus === 'compressing' && <span style={{ marginLeft: '10px', color: 'var(--primary-orange)' }}>Compressing image...</span>}
            {uploadStatus === 'uploading' && <span style={{ marginLeft: '10px', color: '#15F5BA' }}>Uploading to server...</span>}
            {uploadStatus === '' && detail.bannerImg && uploadTarget === 'banner' && <span style={{ marginLeft: '10px', color: '#15F5BA', fontSize: '0.85rem' }}>✓ Banner is loaded!</span>}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', background: '#15F5BA', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            <i className="fa-solid fa-save"></i> {saving ? 'Saving...' : 'Save Page Changes'}
          </button>
          {saved && <span style={{ color: '#15F5BA', fontSize: '0.9rem' }}><i className="fa-solid fa-check"></i> Successfully updated live site!</span>}
        </div>
      </div>

      {cropSrc && (
        <ImageCropModal 
          imageSrc={cropSrc}
          fileName={cropFileName}
          aspect={uploadTarget === 'banner' ? 3 / 1 : 1.5}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </div>
  );
};

export default WorkDetailEditor;
