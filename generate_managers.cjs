const fs = require('fs');

const createCrud = (name, endpoint, fields, cols) => `import React, { useState, useEffect } from 'react';

const ${name}Manager = ({ token }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ ${fields} });

  const fetchItems = async () => {
    try {
      const res = await fetch('${endpoint}');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch('${endpoint}', {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ ${fields} });
        setEditing(null);
        fetchItems();
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const res = await fetch(\`${endpoint}?id=\${id}\`, {
        method: 'DELETE',
        headers: { 'Authorization': \`Bearer \${token}\` }
      });
      if (res.ok) fetchItems();
    } catch (err) { console.error(err); }
  };

  const editItem = (item) => {
    setEditing(item.id);
    setFormData(item);
  };

  return (
    <div className="admin-panel-section" style={{ display: 'block' }}>
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>Manage ${name}s</h2>
      
      <div className="glass-card" style={{ padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ color: '#15F5BA', marginBottom: '15px' }}>{editing ? 'Edit' : 'Add New'} ${name}</h3>
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '15px' }}>
          ${cols.map(c => `<div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#fff', fontSize: '0.9rem' }}>${c.label}</label>
            <input type="text" className="form-input" required value={formData.${c.key} || ''} onChange={e => setFormData({...formData, ${c.key}: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }} />
          </div>`).join('\n          ')}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Save'}</button>
            {editing && <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setFormData({ ${fields} }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              ${cols.map(c => `<th style={{ padding: '12px', textAlign: 'left', color: '#15F5BA' }}>${c.label}</th>`).join('')}
              <th style={{ padding: '12px', textAlign: 'right', color: '#15F5BA' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                ${cols.map(c => `<td style={{ padding: '12px' }}>{item.${c.key}}</td>`).join('')}
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button onClick={() => editItem(item)} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', marginRight: '15px' }}><i className="fa-solid fa-pen"></i></button>
                  <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr><td colSpan="${cols.length + 1}" style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ${name}Manager;
`;

fs.writeFileSync('src/components/admin/MenuManager.jsx', createCrud('MenuLink', '/api/menus', 
  "id: '', label: '', url: '', parentMenu: ''", 
  [{key: 'id', label: 'ID'}, {key: 'label', label: 'Label'}, {key: 'url', label: 'URL'}, {key: 'parentMenu', label: 'Parent Menu'}]
));

fs.writeFileSync('src/components/admin/HeroStatManager.jsx', createCrud('HeroStat', '/api/hero-stats', 
  "id: '', value: '', label: ''", 
  [{key: 'id', label: 'ID'}, {key: 'value', label: 'Value'}, {key: 'label', label: 'Label'}]
));

fs.writeFileSync('src/components/admin/PresenceManager.jsx', createCrud('PresenceLocation', '/api/presence', 
  "id: '', name: '', hq: '', volunteers: '', coordinator: '', phone: ''", 
  [{key: 'id', label: 'ID'}, {key: 'name', label: 'State Name'}, {key: 'hq', label: 'Headquarters'}, {key: 'volunteers', label: 'Volunteers'}, {key: 'coordinator', label: 'Coordinator'}, {key: 'phone', label: 'Phone'}]
));

fs.writeFileSync('src/components/admin/ContentManager.jsx', createCrud('SectionContent', '/api/content', 
  "id: '', title: '', subtitle: '', content: ''", 
  [{key: 'id', label: 'Section ID'}, {key: 'title', label: 'Title'}, {key: 'subtitle', label: 'Subtitle'}, {key: 'content', label: 'Content'}]
));
