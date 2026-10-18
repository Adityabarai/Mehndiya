const API_BASE = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('mehndi_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }
  return data;
}

export const api = {
  // Auth
  login: (credentials) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }).then(handleResponse),

  register: (userData) =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(handleResponse),

  getMe: () =>
    fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    }).then(handleResponse),

  // Artists
  getArtists: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/artists?${q}`, { headers: getHeaders() }).then(handleResponse);
  },

  getArtist: (id) =>
    fetch(`${API_BASE}/artists/${id}`, { headers: getHeaders() }).then(handleResponse),

  updateArtist: (id, data) =>
    fetch(`${API_BASE}/artists/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  getArtistAvailability: (id) =>
    fetch(`${API_BASE}/artists/${id}/availability`, { headers: getHeaders() }).then(handleResponse),

  updateArtistAvailability: (id, data) =>
    fetch(`${API_BASE}/artists/${id}/availability`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  blockArtistDate: (id, { date, reason }) =>
    fetch(`${API_BASE}/artists/${id}/blocked-dates`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ date, reason })
    }).then(handleResponse),

  unblockArtistDate: (id, date) =>
    fetch(`${API_BASE}/artists/${id}/blocked-dates/${date}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Appointments (Customer & general)
  createAppointment: (appointmentData) =>
    fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(appointmentData)
    }).then(handleResponse),

  getMyAppointments: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/appointments/my?${q}`, { headers: getHeaders() }).then(handleResponse);
  },

  getAppointment: (id) =>
    fetch(`${API_BASE}/appointments/${id}`, { headers: getHeaders() }).then(handleResponse),

  cancelAppointment: (id, { cancellationReason }) =>
    fetch(`${API_BASE}/appointments/${id}/cancel`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ cancellationReason })
    }).then(handleResponse),

  rescheduleAppointment: (id, { newDate, newTimeSlot }) =>
    fetch(`${API_BASE}/appointments/${id}/reschedule`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ newDate, newTimeSlot })
    }).then(handleResponse),

  // Artist Appointments
  getArtistAppointments: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/artist/appointments?${q}`, { headers: getHeaders() }).then(handleResponse);
  },

  acceptAppointment: (id) =>
    fetch(`${API_BASE}/artist/appointments/${id}/accept`, {
      method: 'PUT',
      headers: getHeaders()
    }).then(handleResponse),

  rejectAppointment: (id, { rejectionReason }) =>
    fetch(`${API_BASE}/artist/appointments/${id}/reject`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ rejectionReason })
    }).then(handleResponse),

  completeAppointment: (id) =>
    fetch(`${API_BASE}/artist/appointments/${id}/complete`, {
      method: 'PUT',
      headers: getHeaders()
    }).then(handleResponse),

  // Admin
  getAdminDashboard: () =>
    fetch(`${API_BASE}/admin/dashboard`, { headers: getHeaders() }).then(handleResponse),

  getAdminUsers: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/admin/users?${q}`, { headers: getHeaders() }).then(handleResponse);
  },

  updateUserStatus: (id, status) =>
    fetch(`${API_BASE}/admin/users/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    }).then(handleResponse),

  deleteUser: (id) =>
    fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  getAdminArtists: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/admin/artists?${q}`, { headers: getHeaders() }).then(handleResponse);
  },

  approveArtist: (id) =>
    fetch(`${API_BASE}/admin/artists/${id}/approve`, {
      method: 'PUT',
      headers: getHeaders()
    }).then(handleResponse),

  rejectArtist: (id) =>
    fetch(`${API_BASE}/admin/artists/${id}/reject`, {
      method: 'PUT',
      headers: getHeaders()
    }).then(handleResponse),

  verifyArtist: (id) =>
    fetch(`${API_BASE}/admin/artists/${id}/verify`, {
      method: 'PUT',
      headers: getHeaders()
    }).then(handleResponse),

  getAdminAppointments: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/admin/appointments?${q}`, { headers: getHeaders() }).then(handleResponse);
  },

  updateAppointmentStatus: (id, status) =>
    fetch(`${API_BASE}/admin/appointments/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    }).then(handleResponse),

  reassignAppointment: (id, newArtistId) =>
    fetch(`${API_BASE}/admin/appointments/${id}/reassign`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ newArtistId })
    }).then(handleResponse),

  getAdminPayments: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/admin/payments?${q}`, { headers: getHeaders() }).then(handleResponse);
  },

  // Designs
  getDesigns: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/designs?${q}`, { headers: getHeaders() }).then(handleResponse);
  },

  likeDesign: (id) =>
    fetch(`${API_BASE}/designs/${id}/like`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  addDesign: (designData) =>
    fetch(`${API_BASE}/designs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(designData)
    }).then(handleResponse),

  deleteDesign: (id) =>
    fetch(`${API_BASE}/designs/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  getUserFavorites: (userId) =>
    fetch(`${API_BASE}/designs/favorites/${userId}`, { headers: getHeaders() }).then(handleResponse),

  toggleFavorite: (userId, designId) =>
    fetch(`${API_BASE}/designs/favorites/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId, designId })
    }).then(handleResponse),

  // Reviews
  getReviews: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/reviews?${q}`, { headers: getHeaders() }).then(handleResponse);
  },

  postReview: (reviewData) =>
    fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reviewData)
    }).then(handleResponse),

  // Notifications
  getNotifications: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/notifications?${q}`, { headers: getHeaders() }).then(handleResponse);
  },

  markNotificationRead: (id) =>
    fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders()
    }).then(handleResponse),

  markAllNotificationsRead: (data) =>
    fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  // Services
  getServices: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/services?${q}`, { headers: getHeaders() }).then(handleResponse);
  },

  createService: (data) =>
    fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  updateService: (id, data) =>
    fetch(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  deleteService: (id) =>
    fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse)
};
