import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import { useWebSocket } from './hooks/useWebSocket';
import AdminPanel from './components/AdminPanel';
import NotificationList from './components/NotificationList';

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.getUsers()
      .then(data => {
        console.log('Users fetched:', data);
        setUsers(data);
        if (data.length > 0) setCurrentUser(data[0]);
      })
      .catch(err => console.error('Failed to fetch users:', err));
  }, []);

  const fetchNotifications = useCallback(() => {
    if (currentUser) {
      api.getNotifications(currentUser.id).then(setNotifications);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useWebSocket(useCallback((msg) => {
    if (msg.type === 'NEW_NOTIFICATION') {
      // Check if current user is in target roles or if target_roles is empty (All)
      const isTarget = msg.data.target_roles.length === 0 || msg.data.target_roles.includes(currentUser?.role?.id);
      if (isTarget) {
        fetchNotifications();
      }
    }
  }, [currentUser, fetchNotifications]));

  return (
    <div className="container">
      <header className="glass" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Notifi<span style={{ color: 'var(--primary)' }}>Hub</span></h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Switch User:</span>
          <select 
            value={currentUser?.id || ''} 
            onChange={(e) => {
              const val = e.target.value;
              console.log('Switching to user ID:', val);
              const user = users.find(u => String(u.id) === String(val));
              if (user) {
                console.log('User found:', user.username);
                setCurrentUser(user);
              }
            }}
            style={{ marginBottom: 0, width: 'auto' }}
          >
            {users.length === 0 && <option value="">Loading users...</option>}
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username} ({u.role.name})</option>
            ))}
          </select>
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: currentUser?.role?.name === 'Admin' ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        {currentUser?.role?.name === 'Admin' && <AdminPanel />}
        <NotificationList 
          notifications={notifications} 
          currentUser={currentUser} 
          onRefresh={fetchNotifications} 
        />
      </main>
    </div>
  );
}

export default App;
