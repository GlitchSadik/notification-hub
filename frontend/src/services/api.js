const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = {
  getUsers: () => fetch(`${API_URL}/users`)
    .then(res => { if (!res.ok) throw new Error('Network response was not ok'); return res.json(); }),
  getRoles: () => fetch(`${API_URL}/roles`)
    .then(res => { if (!res.ok) throw new Error('Network response was not ok'); return res.json(); }),
  getNotifications: (userId) => fetch(`${API_URL}/notifications/${userId}`)
    .then(res => { if (!res.ok) throw new Error('Network response was not ok'); return res.json(); }),
  createNotification: (data) => fetch(`${API_URL}/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => { if (!res.ok) throw new Error('Network response was not ok'); return res.json(); }),
  markAsRead: (notifId, userId) => fetch(`${API_URL}/notifications/${notifId}/read/${userId}`, {
    method: 'PATCH'
  }).then(res => { if (!res.ok) throw new Error('Network response was not ok'); return res.json(); }),
};
