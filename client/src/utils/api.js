// API Client utility connecting React frontend to Node backend (and Supabase)

const API_BASE = '/api';

export const fetchServices = async () => {
  try {
    const res = await fetch(`${API_BASE}/services`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.warn('API services fetch error, using local fallback:', err);
    return null;
  }
};

export const fetchBookings = async ({ status = 'all', search = '' } = {}) => {
  try {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/bookings?${params.toString()}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('API fetchBookings error:', err);
    throw err;
  }
};

export const fetchBookingStats = async () => {
  try {
    const res = await fetch(`${API_BASE}/bookings/stats`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    console.error('API fetchBookingStats error:', err);
    throw err;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit appointment request');
    }
    return data;
  } catch (err) {
    console.error('API createBooking error:', err);
    throw err;
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update status');
    }
    return data;
  } catch (err) {
    console.error('API updateBookingStatus error:', err);
    throw err;
  }
};
