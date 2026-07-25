import React, { useState, useEffect } from 'react';

const DonationsManager = ({ token }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchDonations = async () => {
    try {
      const res = await fetch('/api/donations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setDonations(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDonations(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch('/api/donations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) fetchDonations();
    } catch (err) { console.error(err); }
  };

  const handleDownloadCSV = () => {
    const headers = ['ID', 'Donor Name', 'Phone', 'Email', 'PAN', 'Amount (INR)', 'Txn ID', 'Date', 'Status'];
    const rows = filtered.map(d => {
      return [
        d.id,
        `"${String(d.donorName || '').replace(/"/g, '""')}"`,
        `"${String(d.phone || '').replace(/"/g, '""')}"`,
        `"${String(d.email || '').replace(/"/g, '""')}"`,
        `"${String(d.pan || '').replace(/"/g, '""')}"`,
        parseFloat(d.amount || 0),
        `"${String(d.txnId || '').replace(/"/g, '""')}"`,
        `"${new Date(d.date).toLocaleDateString('en-IN')}"`,
        `"${d.status}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donations_donor_report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filtered = filter === 'All' ? donations : donations.filter(d => d.status === filter);

  const statusColor = { Pending: '#f97316', Verified: '#22c55e', Failed: '#ef4444' };

  const totalAmount = donations
    .filter(d => d.status === 'Verified')
    .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  return (
    <div className="admin-panel-section" style={{ display: 'block' }}>
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>Donations & Donor List</h2>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        {[
          { label: 'Total Received', val: `₹${totalAmount.toLocaleString('en-IN')}`, col: '#15F5BA' },
          { label: 'Pending', val: donations.filter(d => d.status === 'Pending').length, col: '#f97316' },
          { label: 'Verified', val: donations.filter(d => d.status === 'Verified').length, col: '#22c55e' },
          { label: 'Failed', val: donations.filter(d => d.status === 'Failed').length, col: '#ef4444' },
        ].map(card => (
          <div key={card.label} className="glass-card" style={{ padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: card.col }}>{card.val}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: '4px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Filter and Export */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['All', 'Pending', 'Verified', 'Failed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '6px 16px', borderRadius: '20px', border: `1px solid ${filter === f ? '#15F5BA' : 'rgba(255,255,255,0.2)'}`, background: filter === f ? 'rgba(21,245,186,0.15)' : 'transparent', color: filter === f ? '#15F5BA' : '#fff', cursor: 'pointer', fontSize: '0.85rem' }}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={handleDownloadCSV} style={{ padding: '6px 16px', borderRadius: '20px', border: 'none', background: '#15F5BA', color: '#0B192C', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-file-csv"></i> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#15F5BA', padding: '30px' }}>Loading...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['#', 'Donor Name', 'Phone', 'Email', 'PAN', 'Amount (₹)', 'Txn ID', 'Date', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '10px', textAlign: 'left', color: '#15F5BA', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px' }}>{i + 1}</td>
                  <td style={{ padding: '10px', fontWeight: 600 }}>{d.donorName}</td>
                  <td style={{ padding: '10px' }}>{d.phone}</td>
                  <td style={{ padding: '10px' }}>{d.email}</td>
                  <td style={{ padding: '10px', fontFamily: 'monospace' }}>{d.pan}</td>
                  <td style={{ padding: '10px', color: '#15F5BA', fontWeight: 700 }}>₹{parseFloat(d.amount || 0).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '0.8rem' }}>{d.txnId}</td>
                  <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{new Date(d.date).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', background: `${statusColor[d.status]}22`, color: statusColor[d.status], border: `1px solid ${statusColor[d.status]}` }}>
                      {d.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap' }}>
                      {d.status !== 'Verified' && (
                        <button onClick={() => updateStatus(d.id, 'Verified')}
                          style={{ padding: '4px 10px', borderRadius: '4px', background: '#22c55e22', color: '#22c55e', border: '1px solid #22c55e', cursor: 'pointer', fontSize: '0.75rem' }}>
                          <i className="fa-solid fa-check"></i> Verify
                        </button>
                      )}
                      {d.status !== 'Failed' && (
                        <button onClick={() => updateStatus(d.id, 'Failed')}
                          style={{ padding: '4px 10px', borderRadius: '4px', background: '#ef444422', color: '#ef4444', border: '1px solid #ef4444', cursor: 'pointer', fontSize: '0.75rem' }}>
                          <i className="fa-solid fa-xmark"></i> Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="10" style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No donations found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DonationsManager;
