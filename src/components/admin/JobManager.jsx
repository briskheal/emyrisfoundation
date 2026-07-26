import React, { useState, useEffect } from 'react';
import { API_URL } from '../../api';

const JobManager = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/jobs`);
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    let updatedJobs = [...jobs];
    
    if (isEditing) {
      updatedJobs = updatedJobs.map(job => 
        job.id === formData.id ? formData : job
      );
    } else {
      const newJob = {
        ...formData,
        id: `job-${Date.now()}`
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
    setIsEditing(true);
    setEditingJob(job);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  };

  if (loading) return <div>Loading job positions...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h2>Job Vacancies & Careers</h2>
        <p>Manage open positions. Use the Active toggle to hide filled positions without deleting them.</p>
      </div>

      <div className="admin-card">
        <h3>{isEditing ? 'Edit Job Position' : 'Add New Position'}</h3>
        <form onSubmit={handleSave} className="admin-form">
          <div className="form-group">
            <label>Job Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required 
            />
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Department / Vertical</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.dept}
                onChange={e => setFormData({...formData, dept: e.target.value})}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.loc}
                onChange={e => setFormData({...formData, loc: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Job Description & Requirements</label>
            <textarea 
              className="form-control" 
              rows="4"
              value={formData.desc}
              onChange={e => setFormData({...formData, desc: e.target.value})}
              required
            ></textarea>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={formData.active} 
                onChange={e => setFormData({...formData, active: e.target.checked})}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ fontWeight: '500', color: 'var(--white)' }}>
                Active / Currently Hiring
              </span>
            </label>
            <small style={{ display: 'block', color: 'var(--text-light)', marginTop: '5px' }}>
              Uncheck this to mark the position as "Filled" and hide it from the website.
            </small>
          </div>

          <div className="form-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={saveStatus === 'saving'}>
              {saveStatus === 'saving' ? 'Saving...' : (isEditing ? 'Update Position' : 'Add Position')}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-outline" onClick={handleCancel}>
                Cancel
              </button>
            )}
            
            {saveStatus === 'success' && <span style={{ color: '#10B981', alignSelf: 'center', marginLeft: '10px' }}>Saved successfully!</span>}
            {saveStatus === 'error' && <span style={{ color: '#EF4444', alignSelf: 'center', marginLeft: '10px' }}>Error saving data.</span>}
          </div>
        </form>
      </div>

      <div className="admin-card mt-4" style={{ marginTop: '40px' }}>
        <h3>All Positions</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} style={{ opacity: job.active !== false ? 1 : 0.5 }}>
                  <td><strong>{job.title}</strong></td>
                  <td>{job.dept}</td>
                  <td>{job.loc}</td>
                  <td>
                    <button 
                      className={`btn btn-sm ${job.active !== false ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleToggleActive(job)}
                      title="Click to toggle status"
                      style={{ minWidth: '100px', fontSize: '12px', padding: '5px 10px' }}
                    >
                      {job.active !== false ? 'Active' : 'Filled'}
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-orange mr-2" onClick={() => handleEdit(job)} style={{ marginRight: '5px' }}>
                      <i className="fa-solid fa-pen"></i> Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(job.id)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              
              {jobs.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">No jobs found. Add one above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobManager;
