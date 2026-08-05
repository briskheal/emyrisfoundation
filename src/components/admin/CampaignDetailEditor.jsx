import React, { useState, useEffect, useRef } from 'react';
import { compressImage } from '../../lib/imageCompressor';
import ImageCropModal from './ImageCropModal';

export const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url;
};

const CampaignDetailEditor = ({ token }) => {
  const [activeCampaign, setActiveCampaign] = useState('blood');
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Unified Uploader State
  const [uploadTarget, setUploadTarget] = useState('banner'); // 'banner' or 'gallery'
  const [cropSrc, setCropSrc] = useState(null);
  const [cropFileName, setCropFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);
  
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');

  useEffect(() => {
    fetchDetail();
  }, [activeCampaign]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaign-details/${activeCampaign}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.whyGrid) data.whyGrid = [];
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
      const res = await fetch(`/api/campaign-details/${activeCampaign}`, {
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
        } else if (uploadTarget === 'gallery') {
          setDetail(prev => ({
            ...prev,
            galleryPhotos: [...(prev.galleryPhotos || []), { url: data.url, title: 'New Photo' }]
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

  const updatePhotoTitle = (index, newTitle) => {
    const newPhotos = [...(detail.galleryPhotos || [])];
    newPhotos[index].title = newTitle;
    setDetail({ ...detail, galleryPhotos: newPhotos });
  };

  const removePhoto = (index) => {
    const newPhotos = [...(detail.galleryPhotos || [])];
    newPhotos.splice(index, 1);
    setDetail({ ...detail, galleryPhotos: newPhotos });
  };

  const handleAddVideo = () => {
    if (!newVideoUrl) return;
    const embedUrl = getYoutubeEmbedUrl(newVideoUrl);
    setDetail({
      ...detail,
      videos: [...(detail.videos || []), { url: embedUrl, title: newVideoTitle || 'Video' }]
    });
    setNewVideoUrl('');
    setNewVideoTitle('');
  };

  const removeVideo = (index) => {
    const newVideos = [...(detail.videos || [])];
    newVideos.splice(index, 1);
    setDetail({ ...detail, videos: newVideos });
  };

  if (loading || !detail) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: 'white' }}><i className="fa-solid fa-file-lines" style={{ color: '#15F5BA' }}></i> Campaign Page Editor</h3>
      </div>
      
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '8px' }}>Select Campaign to Edit:</label>
          <select 
            value={activeCampaign} 
            onChange={e => setActiveCampaign(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#222', color: 'white' }}
          >
            <option value="blood">Blood Donation</option>
            <option value="organ">Organ Donation</option>
            <option value="shiksha">Shiksha Hi Surakhya</option>
            <option value="plantation">Plantation Awareness</option>
            <option value="welfare">Social Welfare & Mental Health</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Page Title</label>
            <input type="text" value={detail.title || ''} onChange={e => setDetail({...detail, title: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Motto</label>
            <input type="text" value={detail.motto || ''} onChange={e => setDetail({...detail, motto: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Banner Message</label>
          <textarea value={detail.bannerMsg || ''} onChange={e => setDetail({...detail, bannerMsg: e.target.value})} rows="2" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }}></textarea>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Introductory Text (Supports HTML like &lt;strong&gt; and &lt;br/&gt;)</label>
          <textarea value={detail.introText || ''} onChange={e => setDetail({...detail, introText: e.target.value})} rows="10" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', fontFamily: 'monospace', fontSize: '0.85rem' }}></textarea>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Narrative Heading</label>
            <input type="text" value={detail.narrativeHeading || ''} onChange={e => setDetail({...detail, narrativeHeading: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Narrative Quote Block</label>
            <textarea value={detail.narrativeQuote || ''} onChange={e => setDetail({...detail, narrativeQuote: e.target.value})} rows="2" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }}></textarea>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginBottom: '20px' }}>
          <h4 style={{ color: '#15F5BA', marginBottom: '15px' }}>Core Motivators (Grid Cards)</h4>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Grid Section Title</label>
            <input type="text" value={detail.whyTitle || ''} onChange={e => setDetail({...detail, whyTitle: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
          </div>
          
          {(detail.whyGrid || []).map((card, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', marginBottom: '10px', position: 'relative' }}>
              <button 
                onClick={() => removeGridItem(idx)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-times"></i>
              </button>
              <div style={{ marginBottom: '10px', paddingRight: '20px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', marginBottom: '3px' }}>Card {idx + 1} Title</label>
                <input type="text" value={card.title || ''} onChange={e => updateGridItem(idx, 'title', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', marginBottom: '3px' }}>Card Text</label>
                <textarea value={card.text || ''} onChange={e => updateGridItem(idx, 'text', e.target.value)} rows="3" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white' }}></textarea>
              </div>
            </div>
          ))}
          <button onClick={addGridItem} style={{ padding: '6px 12px', background: 'transparent', color: '#15F5BA', border: '1px dashed #15F5BA', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', marginTop: '5px' }}>
            + Add Card
          </button>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginBottom: '20px' }}>
          <h4 style={{ color: '#15F5BA', marginBottom: '15px' }}>Media Archives Titles</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Gallery Title</label>
              <input type="text" value={detail.galleryTitle || ''} onChange={e => setDetail({...detail, galleryTitle: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Gallery Subtitle</label>
              <input type="text" value={detail.gallerySubtitle || ''} onChange={e => setDetail({...detail, gallerySubtitle: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Video Title</label>
              <input type="text" value={detail.videoTitle || ''} onChange={e => setDetail({...detail, videoTitle: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '5px' }}>Video Subtitle</label>
              <input type="text" value={detail.videoSubtitle || ''} onChange={e => setDetail({...detail, videoSubtitle: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginBottom: '20px' }}>
          <h4 style={{ color: '#15F5BA', marginBottom: '15px' }}>Gallery Photos</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
            {(detail.galleryPhotos || []).map((photo, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', position: 'relative', width: '200px' }}>
                <button 
                  onClick={() => removePhoto(idx)}
                  style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.5)', color: '#ff4d4d', border: 'none', cursor: 'pointer', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Remove Photo"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
                <img src={photo.url} alt="Gallery item" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />
                <input 
                  type="text" 
                  value={photo.title || ''} 
                  onChange={e => updatePhotoTitle(idx, e.target.value)} 
                  placeholder="Photo Title"
                  style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontSize: '0.8rem' }} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Videos Section */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginBottom: '20px' }}>
          <h4 style={{ color: '#15F5BA', marginBottom: '15px' }}>Video Archives (YouTube)</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
            {(detail.videos || []).map((vid, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', position: 'relative', width: '250px' }}>
                <button 
                  onClick={() => removeVideo(idx)}
                  style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.5)', color: '#ff4d4d', border: 'none', cursor: 'pointer', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Remove Video"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
                <div style={{ color: 'white', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>{vid.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', wordBreak: 'break-all', marginBottom: '10px' }}>{vid.url}</div>
                <iframe 
                  width="100%" 
                  height="120" 
                  src={vid.url} 
                  title={vid.title} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{ borderRadius: '4px' }}
                ></iframe>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '15px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', marginBottom: '5px' }}>New Video Title</label>
              <input type="text" placeholder="e.g. Activity Coverage" value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: '#222', color: 'white', fontSize: '0.85rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', marginBottom: '5px' }}>YouTube URL</label>
              <input type="text" placeholder="https://youtu.be/..." value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: '#222', color: 'white', fontSize: '0.85rem' }} />
            </div>
            <button onClick={handleAddVideo} type="button" style={{ padding: '8px 16px', background: 'transparent', color: '#15F5BA', border: '1px dashed #15F5BA', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
              + Add Video
            </button>
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
                value="gallery" 
                checked={uploadTarget === 'gallery'} 
                onChange={() => setUploadTarget('gallery')} 
              />
              Gallery Photo (1.5:1)
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
              id="unified-uploader"
            />
            <label htmlFor="unified-uploader" style={{ padding: '8px 16px', background: 'var(--primary-orange)', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}>
              Choose File
            </label>
            
            {uploadStatus === 'compressing' && <span style={{ marginLeft: '10px', color: 'var(--primary-orange)' }}>Compressing image...</span>}
            {uploadStatus === 'uploading' && <span style={{ marginLeft: '10px', color: '#15F5BA' }}>Uploading to server...</span>}
            {uploadStatus === '' && detail.bannerImg && uploadTarget === 'banner' && <span style={{ marginLeft: '10px', color: '#15F5BA', fontSize: '0.85rem' }}>✓ Banner is loaded!</span>}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
          <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', background: '#15F5BA', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
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

export default CampaignDetailEditor;
