'use client';
import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';

const InternshipModal = () => {
  const { activeModal, closeModal } = useModals();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', whatsapp: '', city: '', profile: '',
    availability: '', days: '', duration: '',
    reasons: [], activityType: '', personality: ''
  });

  if (activeModal !== 'internship') return null;

  const handleNextStep1 = (e) => { e.preventDefault(); setStep(2); };
  const handleNextStep2 = (e) => { e.preventDefault(); setStep(3); };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, reasons: [...formData.reasons, value] });
    } else {
      setFormData({ ...formData, reasons: formData.reasons.filter(r => r !== value) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (formData.reasons.length === 0) {
      setError('Please select at least one reason for interning.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        type: 'internship',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        details: `WhatsApp: ${formData.whatsapp}
City: ${formData.city}
Profile: ${formData.profile}
Availability: ${formData.availability} (${formData.days})
Duration: ${formData.duration}
Reasons: ${formData.reasons.join(', ')}
Activity Preference: ${formData.activityType}
Personality: ${formData.personality}`
      };
      
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setStep(4);
      } else {
        setError(data.error || 'Application failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const handleClose = () => {
    setStep(1);
    setError('');
    setFormData({
      name: '', email: '', phone: '', whatsapp: '', city: '', profile: '',
      availability: '', days: '', duration: '', reasons: [], activityType: '', personality: ''
    });
    closeModal();
  };

  return (
    <div className="modal-overlay open" id="internship-modal" style={{ display: 'flex' }}>
      <div className="modal-card glass-card">
        <button className="modal-close-btn" onClick={handleClose}><i className="fa-solid fa-xmark"></i></button>

        {step < 4 && (
          <div className="modal-header text-center">
            <i className="fa-solid fa-graduation-cap vol-header-icon"></i>
            <h2>Internship Application</h2>
            <p>Join the Emyris future changemakers program</p>
            <div className="step-tracker" style={{ maxWidth: '250px', margin: '10px auto' }}>
              <span className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</span>
              <span className="step-line"></span>
              <span className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</span>
              <span className="step-line"></span>
              <span className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</span>
            </div>
          </div>
        )}

        {/* Quiz Step 1: Personal Info */}
        {step === 1 && (
          <div className="intern-step-panel active">
            <form onSubmit={handleNextStep1}>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" className="form-control" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Contact Number *</label>
                  <input type="tel" className="form-control" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>WhatsApp Number *</label>
                  <input type="tel" className="form-control" required value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input type="text" className="form-control" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>I am a *</label>
                <select className="form-select" required value={formData.profile} onChange={e => setFormData({...formData, profile: e.target.value})}>
                  <option value="" disabled>Select profile...</option>
                  <option value="School Student">School Student</option>
                  <option value="College Student">College Student</option>
                  <option value="Working professional">Working professional</option>
                  <option value="Home maker">Home maker</option>
                  <option value="Retired individual">Retired individual</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="modal-action-footer">
                <div></div>
                <button type="submit" className="btn btn-primary">Next Step <i className="fa-solid fa-arrow-right"></i></button>
              </div>
            </form>
          </div>
        )}

        {/* Quiz Step 2: Availability & Duration */}
        {step === 2 && (
          <div className="intern-step-panel active">
            <form onSubmit={handleNextStep2}>
              <div className="form-group">
                <label>I am available to take on tasks that can be done *</label>
                <div className="radio-group">
                  <label className="radio-label"><input type="radio" name="i-avail" value="Virtually only" required onChange={e => setFormData({...formData, availability: e.target.value})} checked={formData.availability === 'Virtually only'} /> Virtually only</label>
                  <label className="radio-label"><input type="radio" name="i-avail" value="Offline only" onChange={e => setFormData({...formData, availability: e.target.value})} checked={formData.availability === 'Offline only'} /> Offline only</label>
                  <label className="radio-label"><input type="radio" name="i-avail" value="Both are possible" onChange={e => setFormData({...formData, availability: e.target.value})} checked={formData.availability === 'Both are possible'} /> Both are possible</label>
                </div>
              </div>
              <div className="form-group">
                <label>I can intern *</label>
                <div className="radio-group">
                  <label className="radio-label"><input type="radio" name="i-days" value="Only on weekends" required onChange={e => setFormData({...formData, days: e.target.value})} checked={formData.days === 'Only on weekends'} /> Only on weekends</label>
                  <label className="radio-label"><input type="radio" name="i-days" value="Only on weekdays" onChange={e => setFormData({...formData, days: e.target.value})} checked={formData.days === 'Only on weekdays'} /> Only on weekdays</label>
                  <label className="radio-label"><input type="radio" name="i-days" value="Flexibly" onChange={e => setFormData({...formData, days: e.target.value})} checked={formData.days === 'Flexibly'} /> Flexibly</label>
                </div>
              </div>
              <div className="form-group">
                <label>Preferred Duration *</label>
                <select className="form-select" required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})}>
                  <option value="" disabled>Select duration...</option>
                  <option value="Less than a month">Less than a month</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="More than 6 months">More than 6 months</option>
                  <option value="Depends on activity engagement">Depends on how engaging the activity is</option>
                </select>
              </div>
              <div className="modal-action-footer">
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}><i className="fa-solid fa-arrow-left"></i> Back</button>
                <button type="submit" className="btn btn-primary">Next Step <i className="fa-solid fa-arrow-right"></i></button>
              </div>
            </form>
          </div>
        )}

        {/* Quiz Step 3: Intentions & Submissions */}
        {step === 3 && (
          <div className="intern-step-panel active">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Why do you want to intern? (Select top reasons) *</label>
                <div className="checkbox-list">
                  <label className="checkbox-label"><input type="checkbox" name="i-reason" value="learn NGOs" onChange={handleCheckboxChange} checked={formData.reasons.includes('learn NGOs')} /> I want to learn something about NGOs</label>
                  <label className="checkbox-label"><input type="checkbox" name="i-reason" value="share skills" onChange={handleCheckboxChange} checked={formData.reasons.includes('share skills')} /> I have skills that I can share</label>
                  <label className="checkbox-label"><input type="checkbox" name="i-reason" value="course requirement" onChange={handleCheckboxChange} checked={formData.reasons.includes('course requirement')} /> I need to do this as part of my course requirements</label>
                  <label className="checkbox-label"><input type="checkbox" name="i-reason" value="meet people" onChange={handleCheckboxChange} checked={formData.reasons.includes('meet people')} /> I want to meet other like minded people</label>
                  <label className="checkbox-label"><input type="checkbox" name="i-reason" value="experience impact" onChange={handleCheckboxChange} checked={formData.reasons.includes('experience impact')} /> I want to experience the impact I can have</label>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>I would like an activity that *</label>
                  <select className="form-select" required value={formData.activityType} onChange={e => setFormData({...formData, activityType: e.target.value})}>
                    <option value="" disabled>Choose...</option>
                    <option value="Interact">Allows me to interact with many people</option>
                    <option value="Alone">I can do by myself</option>
                    <option value="Not sure">I am not sure</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>My friends think of me as *</label>
                  <select className="form-select" required value={formData.personality} onChange={e => setFormData({...formData, personality: e.target.value})}>
                    <option value="" disabled>Choose...</option>
                    <option value="Extrovert">An extroverted person</option>
                    <option value="Introvert">An introverted person</option>
                    <option value="Not sure">I am not sure</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Upload your CV / Resume *</label>
                <input type="file" className="form-control" accept=".pdf,.doc,.docx" />
              </div>
              
              {error && <div style={{ color: '#ef4444', marginBottom: '10px', fontSize: '0.9rem' }}>{error}</div>}
              
              <div className="modal-action-footer">
                <button type="button" className="btn btn-outline" onClick={() => setStep(2)}><i className="fa-solid fa-arrow-left"></i> Back</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : <>Submit Application <i className="fa-solid fa-circle-check"></i></>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Quiz Success Screen */}
        {step === 4 && (
          <div className="intern-step-panel active text-center">
            <i className="fa-solid fa-circle-check success-check-icon"></i>
            <h3>Application Submitted!</h3>
            <p className="lead-para">Thank you for applying to the Emyris Internship Program.</p>
            <div className="receipt-box glass-card">
              <p>Our review committee will evaluate your quiz responses and CV. We will get in touch with you shortly.</p>
            </div>
            <button className="btn btn-primary" onClick={handleClose} style={{ marginTop: '20px' }}>Close Form</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default InternshipModal;
