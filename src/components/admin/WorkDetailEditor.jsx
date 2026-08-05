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

  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  const updateArrayItem = (arrayName, index, field, value) => {
    const newArray = [...(detail[arrayName] || [])];
    newArray[index] = { ...newArray[index], [field]: value };
    setDetail({ ...detail, [arrayName]: newArray });
  };

  const removeArrayItem = (arrayName, index) => {
    const newArray = [...(detail[arrayName] || [])];
    newArray.splice(index, 1);
    setDetail({ ...detail, [arrayName]: newArray });
  };

  const addSdgItem = () => {
    setDetail({ ...detail, sdgGrid: [...(detail.sdgGrid || []), { title: 'New Item', text: 'Description' }] });
  };

  const addReachStat = () => {
    setDetail({ ...detail, reachStats: [...(detail.reachStats || []), { count: '10', label: 'New Stat', color: '#15F5BA' }] });
  };

  const addTestimonial = () => {
    setDetail({ ...detail, testimonials: [...(detail.testimonials || []), { name: 'Name', text: 'Quote' }] });
  };

  const handleAddVideo = () => {
    if (!newVideoUrl) return;
    const embedUrl = getYoutubeEmbedUrl(newVideoUrl);
    setDetail({ ...detail, videos: [...(detail.videos || []), { title: newVideoTitle || 'Video', url: embedUrl }] });
    setNewVideoTitle('');
    setNewVideoUrl('');
  };

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

        {/* SDG Grid (What We Do) */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h4 style={{ color: '#15F5BA', margin: 0 }}>What We Do (Grid Cards)</h4>
            <button onClick={addSdgItem} style={{ padding: '6px 12px', background: 'rgba(21, 245, 186, 0.2)', color: '#15F5BA', border: '1px solid #15F5BA', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>+ Add Card</button>
          </div>
          {(detail.sdgGrid || []).map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', marginBottom: '10px', position: 'relative' }}>
              <button onClick={() => removeArrayItem('sdgGrid', idx)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
              <input type="text" value={item.title} onChange={e => updateArrayItem('sdgGrid', idx, 'title', e.target.value)} placeholder="Card Title" style={{ width: '90%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: '#222', color: 'white' }} />
              <textarea rows="3" value={item.text} onChange={e => updateArrayItem('sdgGrid', idx, 'text', e.target.value)} placeholder="Card Text" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: '#222', color: 'white' }}></textarea>
            </div>
          ))}
        </div>

        {/* Reach Stats */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h4 style={{ color: '#15F5BA', margin: 0 }}>Reach & Presence (Stats)</h4>
            <button onClick={addReachStat} style={{ padding: '6px 12px', background: 'rgba(21, 245, 186, 0.2)', color: '#15F5BA', border: '1px solid #15F5BA', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>+ Add Stat</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {(detail.reachStats || []).map((stat, idx) => (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', position: 'relative' }}>
                <button onClick={() => removeArrayItem('reachStats', idx)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer' }}><i className="fa-solid fa-times"></i></button>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input type="text" value={stat.count} onChange={e => updateArrayItem('reachStats', idx, 'count', e.target.value)} placeholder="e.g. 20" style={{ width: '50%', padding: '6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: '#222', color: 'white' }} />
                  <input type="color" value={stat.color} onChange={e => updateArrayItem('reachStats', idx, 'color', e.target.value)} style={{ width: '40px', height: '35px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }} />
                </div>
                <input type="text" value={stat.label} onChange={e => updateArrayItem('reachStats', idx, 'label', e.target.value)} placeholder="e.g. villages & slums" style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: '#222', color: 'white' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h4 style={{ color: '#15F5BA', margin: 0 }}>Together We Are Growing (Testimonials)</h4>
            <button onClick={addTestimonial} style={{ padding: '6px 12px', background: 'rgba(21, 245, 186, 0.2)', color: '#15F5BA', border: '1px solid #15F5BA', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>+ Add Quote</button>
          </div>
          {(detail.testimonials || []).map((t, idx) => (
            <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', marginBottom: '10px', position: 'relative' }}>
              <button onClick={() => removeArrayItem('testimonials', idx)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
              <input type="text" value={t.name} onChange={e => updateArrayItem('testimonials', idx, 'name', e.target.value)} placeholder="Name" style={{ width: '90%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: '#222', color: 'white' }} />
              <textarea rows="2" value={t.text} onChange={e => updateArrayItem('testimonials', idx, 'text', e.target.value)} placeholder="Quote Text" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: '#222', color: 'white' }}></textarea>
            </div>
          ))}
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

        {/* Videos Section */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginBottom: '20px' }}>
          <h4 style={{ color: '#15F5BA', marginBottom: '15px' }}>Their Success, Our Happiness (Videos)</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input type="text" value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} placeholder="Video Title" style={{ flex: '1', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#222', color: 'white' }} />
            <input type="text" value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} placeholder="YouTube URL" style={{ flex: '2', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#222', color: 'white' }} />
            <button onClick={handleAddVideo} style={{ padding: '10px 20px', background: 'var(--primary-orange)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Add Video</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {(detail.videos || []).map((video, idx) => (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', position: 'relative' }}>
                <button onClick={() => removeArrayItem('videos', idx)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', color: '#ff4d4d', border: 'none', cursor: 'pointer', borderRadius: '50%', width: '24px', height: '24px', zIndex: 10 }}><i className="fa-solid fa-times"></i></button>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '6px', marginBottom: '10px' }}>
                  <iframe src={video.url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} frameBorder="0" allowFullScreen title={video.title}></iframe>
                </div>
                <div style={{ color: 'white', fontSize: '0.85rem', textAlign: 'center' }}>{video.title}</div>
              </div>
            ))}
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
