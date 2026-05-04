const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = {
  getUsers: () => fetch(`${API_URL}/users`).then(res => res.json()),
  getRoles: () => fetch(`${API_URL}/roles`).then(res => res.json()),
  getNotifications: (userId) => fetch(`${API_URL}/notifications/${userId}`).then(res => res.json()),
  createNotification: (data) => fetch(`${API_URL}/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  markAsRead: (notifId, userId) => fetch(`${API_URL}/notifications/${notifId}/read/${userId}`, {
    method: 'PATCH'
  }).then(res => res.json()),
};
