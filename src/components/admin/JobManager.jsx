import React, { useState, useEffect } from 'react';
import { API_URL } from '../../api';

const JobManager = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [operationalCenters, setOperationalCenters] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    dept: '',
    loc: '',
    desc: '',
    active: true
  });
  
  const [selectedLocations, setSelectedLocations] = useState([]);

  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchCorporate();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/jobs?t=${Date.now()}`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error loading jobs.');
      setLoading(false);
    }
  };
  
  const fetchCorporate = async () => {
    try {
      const res = await fetch(`${API_URL}/corporate?t=${Date.now()}`);
      const data = await res.json();
      if (data.operationalCenters) {
        const centers = data.operationalCenters.split(',').map(s => s.trim()).filter(Boolean);
        setOperationalCenters(centers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLocationToggle = (city) => {
    if (selectedLocations.includes(city)) {
      setSelectedLocations(selectedLocations.filter(c => c !== city));
    } else {
      setSelectedLocations([...selectedLocations, city]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    // Convert selected locations to comma separated string
    const finalFormData = {
      ...formData,
      loc: selectedLocations.join(', ')
    };
    
    let updatedJobs = [...jobs];
    
    if (isEditing) {
      updatedJobs = updatedJobs.map(job => 
        job.id === formData.id ? finalFormData : job
      );
    } else {
      const newJob = { 
        ...finalFormData, 
        id: Date.now().toString() 
      };
      updatedJobs.push(newJob);
    }

    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJobs)
      });
      
      if (!res.ok) throw new Error('Failed to save');
      
      setJobs(updatedJobs);
      setSaveStatus('success');
      
      setTimeout(() => {
        setSaveStatus('');
        handleCancel();
      }, 1500);
      
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  };

  const handleEdit = (job) => {
    setFormData({ ...job, active: job.active !== false });
    const locs = job.loc ? job.loc.split(',').map(s => s.trim()).filter(Boolean) : [];
    setSelectedLocations(locs);
    setIsEditing(true);
    setEditingJob(job);
    document.getElementById('job-form-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job position permanently? Consider toggling it to "Filled" instead so you can reopen it later.')) return;
    
    const updatedJobs = jobs.filter(job => job.id !== id);
    setSaveStatus('saving');
    
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJobs)
      });
      
      if (!res.ok) throw new Error('Failed to delete');
      
      setJobs(updatedJobs);
      setSaveStatus('');
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  };

  const handleToggleActive = async (job) => {
    const updatedJob = { ...job, active: !job.active };
    const updatedJobs = jobs.map(j => j.id === job.id ? updatedJob : j);
    
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJobs)
      });
      
      if (res.ok) {
        setJobs(updatedJobs);
      }
    } catch (err) {
      console.error('Failed to toggle active status', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingJob(null);
    setFormData({
      id: '',
      title: '',
      dept: '',
      loc: '',
      desc: '',
      active: true
    });
    setSelectedLocations([]);
  };

  if (loading) return <div style={{ color: 'white' }}>Loading job positions...</div>;
  if (error) return <div style={{ color: '#EF4444' }}>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: 'white', margin: 0 }}>
          <i className="fa-solid fa-briefcase" style={{ color: '#f97316' }}></i> Manage Job Vacancies
        </h3>
        <button 
          onClick={() => {
            handleCancel();
            document.getElementById('job-form-container')?.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{ background: '#10b981', border: 'none', padding: '10px 20px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}
        >
          <i className="fa-solid fa-plus"></i> Add New Position
        </button>
      </div>
      
      <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '30px' }}>
        Manage open positions. Use the Active toggle to hide filled positions without deleting them.
      </p>

      <div style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
        {jobs.map(job => (
          <div key={job.id} style={{ 
            background: 'rgba(255,255,255,0.04)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '12px', 
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: job.active !== false ? 1 : 0.5
          }}>
            <div>
              <h4 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '1.1rem' }}>{job.title}</h4>
              <div style={{ display: 'flex', gap: '15px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                <span><i className="fa-solid fa-building" style={{ color: '#f97316' }}></i> {job.dept}</span>
                <span><i className="fa-solid fa-location-dot" style={{ color: '#f97316' }}></i> {job.loc}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button 
                onClick={() => handleToggleActive(job)}
                style={{ 
                  background: job.active !== false ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)', 
                  color: job.active !== false ? '#10b981' : 'white', 
                  border: job.active !== false ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.2)',
                  padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                }}
              >
                {job.active !== false ? 'Active' : 'Filled'}
              </button>
              
              <button onClick={() => handleEdit(job)} style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', border: '1px solid #f97316', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                <i className="fa-solid fa-pen"></i> Edit
              </button>
              
              <button onClick={() => handleDelete(job.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
        
        {jobs.length === 0 && (
          <div style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px' }}>
            No jobs found. Add one above.
          </div>
        )}
      </div>

      <div id="job-form-container" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', padding: '24px' }}>
        <h4 style={{ color: 'white', marginTop: 0 }}>{isEditing ? 'Edit Job Position' : 'Add New Position'}</h4>
        
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px', display: 'block' }}>Job Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required 
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
                color: 'white', fontSize: '0.92rem', outline: 'none'
              }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '15px' }}>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px', display: 'block' }}>Department / Vertical</label>
              <input 
                type="text" 
                value={formData.dept}
                onChange={e => setFormData({...formData, dept: e.target.value})}
                required 
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
                  color: 'white', fontSize: '0.92rem', outline: 'none'
                }}
              />
            </div>
            
            <div>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px', display: 'block' }}>Locations</label>
              <div style={{ 
                border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', 
                borderRadius: '8px', padding: '10px', maxHeight: '150px', overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: '8px'
              }}>
                {operationalCenters.length > 0 ? (
                  operationalCenters.map(city => (
                    <label key={city} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedLocations.includes(city)}
                        onChange={() => handleLocationToggle(city)}
                      />
                      {city}
                    </label>
                  ))
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                    No Operational Centers found. Please add them in Corporate Profile.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px', display: 'block' }}>Job Description & Requirements</label>
            <textarea 
              rows="4"
              value={formData.desc}
              onChange={e => setFormData({...formData, desc: e.target.value})}
              required
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
                color: 'white', fontSize: '0.92rem', outline: 'none', minHeight: '100px'
              }}
            ></textarea>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={formData.active} 
                onChange={e => setFormData({...formData, active: e.target.checked})}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: '500', color: 'white' }}>
                Active / Currently Hiring
              </span>
            </label>
            <small style={{ display: 'block', color: 'rgba(255,255,255,0.5)', marginTop: '5px', marginLeft: '28px' }}>
              Uncheck this to mark the position as "Filled" and hide it from the website.
            </small>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button type="submit" disabled={saveStatus === 'saving'} style={{
              padding: '12px 28px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700,
              cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer'
            }}>
              <i className="fa-solid fa-floppy-disk"></i> {saveStatus === 'saving' ? 'Saving...' : 'Save Position'}
            </button>
            
            {isEditing && (
              <button type="button" onClick={handleCancel} style={{
                padding: '12px 28px', background: 'rgba(255,255,255,0.1)',
                color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontWeight: 600,
                cursor: 'pointer'
              }}>
                Cancel
              </button>
            )}
            
            {saveStatus === 'success' && <span style={{ color: '#10b981', fontWeight: 600 }}><i className="fa-solid fa-check"></i> Saved successfully!</span>}
            {saveStatus === 'error' && <span style={{ color: '#ef4444', fontWeight: 600 }}><i className="fa-solid fa-xmark"></i> Error saving.</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobManager;
