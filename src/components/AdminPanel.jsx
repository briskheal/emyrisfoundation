'use client';
import React, { useState, useEffect } from 'react';
import { API_URL } from '../api';
import HeroManager from './admin/HeroManager';
import CampaignManager from './admin/CampaignManager';
import WorkManager from './admin/WorkManager';
import AboutManager from './admin/AboutManager';
import DirectorManager from './admin/DirectorManager';
import MentorManager from './admin/MentorManager';
import PublicationManager from './admin/PublicationManager';
import MenuManager from './admin/MenuManager';
import HeroStatManager from './admin/HeroStatManager';
import PresenceManager from './admin/PresenceManager';
import ContentManager from './admin/ContentManager';
import DonationsManager from './admin/DonationsManager';
import { compressImage } from '../lib/imageCompressor';

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('admin');
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState('superadmin');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('corporate');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Corporate form state
  const [corp, setCorp] = useState({});
  const [qrPreview, setQrPreview] = useState('');
  const [logoPreview, setLogoPreview] = useState('');

  // Fetch initial data
  useEffect(() => {
    fetch(`${API_URL}/corporate`)
      .then(res => res.json())
      .then(data => {
        setCorp(data);
        setQrPreview(data.qrCode || '');
        setLogoPreview(data.logo || '');
      })
      .catch(err => console.error('Error fetching corporate data:', err));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUserRole(data.role || 'superadmin');
        setIsLoggedIn(true);
        setLoginError('');
        // Set default tab based on role
        setActiveTab(data.role === 'junior' ? 'hero' : 'corporate');
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (error) {
      setLoginError('Server error');
    }
  };

  const handleCorpChange = (field, value) => {
    setCorp(prev => ({ ...prev, [field]: value }));
  };

  const handleQrUpload = async (e) => {
    const rawFile = e.target.files[0];
    if (!rawFile) return;
    e.target.value = ''; // Reset input so same file can be re-uploaded

    const file = await compressImage(rawFile);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setQrPreview(data.url);
        setCorp(prev => ({ ...prev, qrCode: data.url }));
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload failed due to network error.');
    }
  };

  const handleLogoUpload = async (e) => {
    const rawFile = e.target.files[0];
    if (!rawFile) return;
    e.target.value = ''; // Reset input to allow re-uploading the same file

    const file = await compressImage(rawFile);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setLogoPreview(data.url);
        setCorp(prev => {
          const updated = { ...prev, logo: data.url };
          fetch(`${API_URL}/corporate`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updated)
          }).catch(console.error);
          return updated;
        });
        alert('Logo uploaded and saved to database successfully!');
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload failed due to network error.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/corporate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(corp)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert('Failed to save changes');
      }
    } catch (error) {
      alert('Server error saving changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadCSV = () => {
    // Build CSV from corp object — key, value pairs
    const rows = Object.entries(corp)
      .filter(([key]) => key !== 'qrCode' && key !== 'logo') // skip binary fields
      .map(([key, val]) => `"${key}","${String(val || '').replace(/"/g, '""')}"`);
    const csvContent = ['Field,Value', ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emyris_corporate_profile.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px',
          backdropFilter: 'blur(20px)', textAlign: 'center'
        }}>
          <img src="/emyris_logo.webp" alt="Emyris Logo" style={{width: '70px', marginBottom: '15px'}} />
          <h2 style={{color: 'white', marginBottom: '6px', fontFamily: 'Outfit, sans-serif'}}>Admin Portal</h2>
          <p style={{color: 'rgba(255,255,255,0.5)', marginBottom: '28px', fontSize: '0.9rem'}}>Emyris Foundation — Restricted Access</p>
          <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '1rem',
                  marginBottom: '12px', boxSizing: 'border-box', outline: 'none'
                }}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '1rem',
                  marginBottom: '12px', boxSizing: 'border-box', outline: 'none'
                }}
                required
              />
            {loginError && <p style={{color: '#f87171', marginBottom: '10px', fontSize: '0.88rem'}}>{loginError}</p>}
            <button type="submit" style={{
              width: '100%', padding: '12px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700,
              fontSize: '1rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
            }}>
              Login <i className="fa-solid fa-arrow-right-to-bracket"></i>
            </button>
          </form>
          <p style={{marginTop: '20px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)'}}>
            Authorised personnel only. All actions are logged.
          </p>
        </div>
      </div>
    );
  }

  // RBAC: superadmin-only tabs
  const superAdminOnly = ['corporate', 'payment', 'donations'];

  const allTabs = [
    { id: 'corporate', label: 'Corporate Profile', icon: 'fa-building' },
    { id: 'payment', label: 'Bank & UPI', icon: 'fa-building-columns' },
    { id: 'donations', label: 'Donations & Donors', icon: 'fa-hand-holding-heart' },
    { id: 'hero', label: 'Hero Banner', icon: 'fa-images' },
    { id: 'hero-stats', label: 'Hero Stats', icon: 'fa-chart-bar' },
    { id: 'about', label: 'About Us', icon: 'fa-users' },
    { id: 'directors', label: 'Directors', icon: 'fa-user-tie' },
    { id: 'mentors', label: 'Mentors', icon: 'fa-chalkboard-user' },
    { id: 'work', label: 'Our Work', icon: 'fa-briefcase' },
    { id: 'campaigns', label: 'Campaigns', icon: 'fa-bullhorn' },
    { id: 'publications', label: 'Publications', icon: 'fa-file-pdf' },
    { id: 'presence', label: 'Presence / Locations', icon: 'fa-location-dot' },
    { id: 'content', label: 'Page Content', icon: 'fa-align-left' },
    { id: 'menus', label: 'Menu Manager', icon: 'fa-bars' },
  ];

  // Filter tabs by role
  const tabs = allTabs.filter(t => userRole === 'superadmin' || !superAdminOnly.includes(t.id));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '260px' : '0px',
        background: 'rgba(255,255,255,0.03)',
        borderRight: sidebarOpen ? '1px solid rgba(255,255,255,0.08)' : 'none',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}>
          <img src="/emyris_logo.webp" alt="Logo" style={{ width: '40px' }} />
          <div>
            <h2 style={{ color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem' }}>Emyris Admin</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '0.75rem' }}>Management System</p>
          </div>
        </div>
        
        <div style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px 10px' }}>Menu</p>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.9rem', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: '12px',
              background: activeTab === t.id ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'transparent',
              color: activeTab === t.id ? 'white' : 'rgba(255,255,255,0.6)',
              transition: 'all 0.2s', width: '100%', whiteSpace: 'nowrap'
            }}>
              <i className={`fa-solid ${t.icon}`} style={{ width: '20px', textAlign: 'center' }}></i> {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <i className="fa-solid fa-arrow-left"></i> Back to Site
          </a>
          <button onClick={() => setIsLoggedIn(false)} style={{
            width: '100%', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontSize: '0.9rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '20px 32px', display: 'flex', flexDirection: 'column', height: '100vh', boxSizing: 'border-box', overflowY: 'auto' }}>
        
        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'white',
            width: '40px', height: '40px', borderRadius: '8px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
            marginRight: '20px', transition: 'background 0.2s'
          }}>
            <i className="fa-solid fa-bars"></i>
          </button>
          <h2 style={{ color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem' }}>
            {allTabs.find(t => t.id === activeTab)?.label}
          </h2>
          {userRole === 'junior' && (
            <span style={{ marginLeft: '16px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)', fontSize: '0.75rem', fontWeight: 600 }}>
              <i className="fa-solid fa-user-shield"></i> Junior Admin
            </span>
          )}
        </div>

        {/* Panel */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', flex: 1, overflowY: 'auto' }}>
        
        {activeTab === 'hero' && <HeroManager token={token} />}
        {activeTab === 'about' && <AboutManager token={token} />}
        {activeTab === 'directors' && <DirectorManager token={token} />}
        {activeTab === 'mentors' && <MentorManager token={token} />}
        {activeTab === 'campaigns' && <CampaignManager token={token} />}
        {activeTab === 'publications' && <PublicationManager token={token} />}
        {activeTab === 'work' && <WorkManager token={token} />}
        {activeTab === 'hero-stats' && <HeroStatManager token={token} />}
        {activeTab === 'presence' && <PresenceManager token={token} />}
        {activeTab === 'content' && <ContentManager token={token} />}
        {activeTab === 'menus' && <MenuManager token={token} />}
        {activeTab === 'donations' && userRole === 'superadmin' && <DonationsManager token={token} />}
        {activeTab === 'donations' && userRole !== 'superadmin' && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>
            <i className="fa-solid fa-lock" style={{ fontSize: '3rem', marginBottom: '15px' }}></i>
            <h3>Access Denied</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>This section is restricted to Super Admins only.</p>
          </div>
        )}

        {saved && (
          <div style={{
            background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)',
            borderRadius: '10px', padding: '12px 18px', marginBottom: '20px', color: '#4ade80', fontWeight: 600
          }}>
            <i className="fa-solid fa-circle-check"></i> Changes saved successfully. Use <strong>Download CSV</strong> to export a backup.
          </div>
        )}

        {/* Corporate Profile Tab */}
        {activeTab === 'corporate' && (
          <div>
            <h3 style={{ color: 'white', marginBottom: '20px' }}><i className="fa-solid fa-building" style={{ color: '#f97316' }}></i> Foundation Corporate Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Foundation Name', field: 'name' },
                { label: 'Primary Email', field: 'email' },
                { label: 'Phone 1', field: 'phone1' },
                { label: 'Phone 2', field: 'phone2' },
                { label: 'Address', field: 'address' },
                { label: 'PAN Number', field: 'pan' },
                { label: 'TAN Number', field: 'tan' },
                { label: 'CIN No', field: 'cin' },
                { label: 'CSR Regn. No', field: 'niti' },
                { label: '80G Tax Info', field: 'tax80g' },
                { label: '12A Status', field: 'tax12a' },
                { label: 'Facebook URL', field: 'fb' },
                { label: 'Instagram URL', field: 'insta' },
                { label: 'LinkedIn URL', field: 'linkedin' },
                { label: 'X (Twitter) URL', field: 'xUrl' },
                { label: 'YouTube URL', field: 'youtubeUrl' },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px', display: 'block' }}>{label}</label>
                  <input
                    type="text"
                    value={corp[field] || ''}
                    onChange={e => handleCorpChange(field, e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
                      color: 'white', fontSize: '0.92rem', boxSizing: 'border-box', outline: 'none'
                    }}
                  />
                </div>
              ))}
              
              {/* Logo Upload */}
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px', display: 'block' }}>
                  Foundation Logo Image
                </label>
                <div style={{
                  width: '100%', padding: '6px 14px', borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
                  boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '42.5px'
                }}>
                  <label style={{ color: '#f97316', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', margin: 0, flexShrink: 0 }}>
                    <i className="fa-solid fa-upload"></i> Upload
                    <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                  </label>
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" style={{ height: '24px', objectFit: 'contain', background: 'white', padding: '2px', borderRadius: '4px' }} />
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>No file</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Bank & UPI Tab */}
        {activeTab === 'payment' && (
          <div>
            <h3 style={{ color: 'white', marginBottom: '20px' }}><i className="fa-solid fa-building-columns" style={{ color: '#f97316' }}></i> Bank Account &amp; UPI Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Account Holder Name', field: 'accountName' },
                { label: 'Account Number', field: 'accountNo' },
                { label: 'IFSC Code', field: 'ifsc' },
                { label: 'Bank Name', field: 'bankName' },
                { label: 'Branch', field: 'bankBranch' },
                { label: 'UPI ID (e.g. emyris@hdfc)', field: 'upiId' },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px', display: 'block' }}>{label}</label>
                  <input
                    type="text"
                    value={corp[field] || ''}
                    onChange={e => handleCorpChange(field, e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
                      color: 'white', fontSize: '0.92rem', boxSizing: 'border-box', outline: 'none'
                    }}
                  />
                </div>
              ))}
              {/* QR Upload */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '5px', display: 'block' }}>
                  UPI QR Code Image
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <label style={{
                    padding: '10px 18px', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)',
                    borderRadius: '8px', color: '#f97316', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem'
                  }}>
                    <i className="fa-solid fa-upload"></i> Upload QR Image
                    <input type="file" accept="image/*" onChange={handleQrUpload} style={{ display: 'none' }} />
                  </label>
                  {qrPreview ? (
                    <div style={{ background: 'white', padding: '8px', borderRadius: '8px', display: 'inline-block' }}>
                      <img src={qrPreview} alt="QR Preview" style={{ width: '100px', height: '100px', objectFit: 'contain', display: 'block' }} />
                    </div>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No QR code uploaded yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save & Download Buttons — Separate */}
        <div style={{ marginTop: '28px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={handleDownloadCSV} style={{
            padding: '12px 28px', background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px', fontWeight: 600, fontSize: '0.92rem',
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
          }}>
            <i className="fa-solid fa-file-csv"></i> Download CSV
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '12px 28px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
            color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700,
            fontSize: '0.92rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            opacity: saving ? 0.7 : 1, transition: 'all 0.3s ease'
          }}>
            {saving ? (
              <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</>
            ) : saved ? (
              <><i className="fa-solid fa-check"></i> Saved!</>
            ) : (
              <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>
            )}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminPanel;

