import React, { useState, useEffect } from 'react';

const CampaignDetailEditor = ({ token }) => {
  const [activeCampaign, setActiveCampaign] = useState('blood');
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [activeCampaign]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaign-details/${activeCampaign}`, {
        headers: { 'Authorization': `Bearer ${token}` }
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
    }
  };

  const updateGridItem = (index, field, value) => {
    const newGrid = [...(detail.whyGrid || [])];
    if (!newGrid[index]) newGrid[index] = { title: '', text: '' };
    newGrid[index][field] = value;
    setDetail({ ...detail, whyGrid: newGrid });
  };

  const addGridItem = () => {
    setDetail({ ...detail, whyGrid: [...(detail.whyGrid || []), { title: '', text: '' }] });
  };

  const removeGridItem = (index) => {
    const newGrid = [...(detail.whyGrid || [])];
    newGrid.splice(index, 1);
    setDetail({ ...detail, whyGrid: newGrid });
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
          <button onClick={handleSave} style={{ padding: '10px 24px', background: '#15F5BA', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            <i className="fa-solid fa-save"></i> Save Page Changes
          </button>
          {saved && <span style={{ color: '#15F5BA', fontSize: '0.9rem' }}><i className="fa-solid fa-check"></i> Successfully updated live site!</span>}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailEditor;
