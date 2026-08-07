'use client';
import React, { useState, useEffect } from 'react';
import { getAuthToken } from '../../api';

const CampaignRegistrationManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    fetch('/api/campaign', {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            alert('Your session has expired. Please log in again.');
            window.location.href = '/admin-login';
          }
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this registration?')) return;
    try {
      const res = await fetch(`/api/campaign?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (res.ok) fetchItems();
      else alert('Failed to delete');
    } catch (err) {
      alert('Error deleting');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h3>Campaign Registrations</h3>
        <button className="btn btn-outline-orange btn-sm" onClick={fetchItems}>
          <i className="fa-solid fa-arrows-rotate"></i> Refresh
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Campaign Name</th>
              <th>Participant Name</th>
              <th>Contact Info</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td><strong>{item.campaign}</strong></td>
                <td>{item.name}</td>
                <td>
                  <div><i className="fa-solid fa-envelope"></i> {item.email || '-'}</div>
                  <div><i className="fa-solid fa-phone"></i> {item.phone || '-'}</div>
                </td>
                <td style={{ whiteSpace: 'pre-wrap', maxWidth: '300px', fontSize: '0.85rem' }}>{item.details}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan="6" className="text-center">No registrations found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignRegistrationManager;
