import React, { useState } from 'react';
import { api } from '../services/api';

function NotificationList({ notifications, currentUser, onRefresh }) {
  const [search, setSearch] = useState('');
  
  const filtered = notifications.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.message.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkRead = async (id) => {
    await api.markAsRead(id, currentUser.id);
    onRefresh();
  };

  return (
    <div className="glass">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</h2>
        <input 
          placeholder="Search..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{ width: '200px', marginBottom: 0 }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(notif => (
          <div key={notif.id} className="glass" style={{ 
            background: notif.is_read ? 'rgba(30, 41, 59, 0.4)' : 'var(--card)',
            padding: '1rem',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{notif.title}</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {new Date(notif.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{notif.message}</p>
            {!notif.is_read && (
              <button 
                onClick={() => handleMarkRead(notif.id)}
                style={{ 
                  background: 'none', border: 'none', color: 'var(--primary)', 
                  cursor: 'pointer', fontSize: '0.8rem', marginTop: '0.5rem', padding: 0 
                }}
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No notifications found.</p>}
      </div>
    </div>
  );
}

export default NotificationList;
