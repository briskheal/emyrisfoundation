import React, { useState, useEffect } from 'react';
import { API_URL } from '../../api';

const WorkDetailEditor = ({ token }) => {
  const [activeWork, setActiveWork] = useState('work-education');
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

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

        <button className="btn btn-primary" onClick={handleSave}>
          <i className="fa-solid fa-save"></i> Save Page Changes
        </button>
        {saved && <span className="text-success ml-3" style={{marginLeft: '15px'}}><i className="fa-solid fa-check"></i> Saved successfully!</span>}
      </div>
    </div>
  );
};

export default WorkDetailEditor;
