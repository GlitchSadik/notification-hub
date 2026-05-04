import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function AdminPanel() {
  const [roles, setRoles] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    api.getRoles().then(setRoles);
  }, []);

  const handleSend = async () => {
    if (!title || !message) return alert('Title and message required');
    await api.createNotification({ title, message, role_ids: selectedRoles });
    setTitle('');
    setMessage('');
    setSelectedRoles([]);
    alert('Notification sent!');
  };

  const toggleRole = (id) => {
    setSelectedRoles(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="glass">
      <h2>Create Notification</h2>
      <input 
        placeholder="Title" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
      />
      <textarea 
        placeholder="Message..." 
        rows="4"
        value={message} 
        onChange={e => setMessage(e.target.value)} 
      />
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Target Audience (None = All):</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {roles.map(role => (
            <button 
              key={role.id}
              className="btn"
              style={{ 
                background: selectedRoles.includes(role.id) ? 'var(--primary)' : 'transparent',
                border: '1px solid var(--border)',
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem'
              }}
              onClick={() => toggleRole(role.id)}
            >
              {role.name}
            </button>
          ))}
        </div>
      </div>
      <button className="btn" style={{ width: '100%' }} onClick={handleSend}>Send Notification</button>
    </div>
  );
}

export default AdminPanel;
