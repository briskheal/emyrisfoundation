import React, { useState, useEffect } from 'react';
import WysiwygEditor from './WysiwygEditor';

const NewsDetailEditor = ({ news, token, onBack }) => {
  const [formData, setFormData] = useState({
    title: news?.title || '',
    content: news?.content || '',
    activityDate: news?.activityDate ? new Date(news.activityDate).toISOString().slice(0,10) : ''
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || '',
        content: news.content || '',
        activityDate: news.activityDate ? new Date(news.activityDate).toISOString().slice(0,10) : ''
      });
    }
  }, [news]);

  const handleSave = async () => {
    if (!news) return;
    setSaving(true);
    setSaved(false);
    
    let month = '';
    let year = '';
    if (formData.activityDate) {
      const dateObj = new Date(formData.activityDate);
      month = dateObj.toLocaleString('default', { month: 'long' });
      year = dateObj.getFullYear().toString();
    }

    const payload = {
      ...formData,
      month,
      year
    };

    try {
      const res = await fetch(`/api/news/${news.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert('Save failed');
      }
    } catch (err) {
      alert('Network error while saving');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={onBack} style={{ padding: '8px 16px', background: 'var(--text-muted)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              <i className="fa-solid fa-arrow-left"></i> Back
            </button>
            <h2 style={{ margin: 0, color: 'white' }}>Edit News Activity</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {saved && <span style={{ color: '#15F5BA' }}><i className="fa-solid fa-check"></i> Saved successfully</span>}
            <button onClick={handleSave} style={{ padding: '10px 20px', background: 'var(--primary-orange)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Main Info */}
          <div className="admin-card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: 'white' }}>Activity Information</h3>
            
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Activity Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', background: 'transparent', color: 'white', fontSize: '1rem' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Activity Date</label>
                <input 
                  type="date" 
                  value={formData.activityDate} 
                  onChange={e => setFormData({...formData, activityDate: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', background: 'transparent', color: 'white', fontSize: '1rem' }}
                />
              <small style={{ color: '#aaa', display: 'block', marginTop: '5px' }}>The month and year dropdown filters on the public site will be automatically calculated from this date.</small>
            </div>
          </div>

          {/* Content Editor */}
          <div className="admin-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: 'white' }}>Activity Report / Content</h3>
            </div>
            
            <div style={{ background: 'transparent', borderRadius: '4px' }}>
              <WysiwygEditor 
                value={formData.content} 
                onChange={(content) => setFormData({...formData, content})} 
              />
            </div>
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '10px' }}>
              Write your activity report here. If the content is long, a "Read More" button will automatically appear on the public site.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default NewsDetailEditor;
