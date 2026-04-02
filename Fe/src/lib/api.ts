import { getToken } from './auth';

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  throw new Error('Missing VITE_API_URL in FE .env file');
}

const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
}

export interface LoginPayload { email: string; password: string; }
export interface LoginResult { token: string; refreshToken: string; user: { id: number | string; email: string; fullName: string; role: string }; }
export interface RegisterPayload { fullName: string; email: string; password: string; phone?: string; }

export async function login(payload: LoginPayload): Promise<LoginResult> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function register(payload: RegisterPayload): Promise<LoginResult> {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface BookingDetailInput {
  roomTypeId: number;
  numberOfRooms: number;
  checkInDate: string;
  checkOutDate: string;
  pricePerNight?: number;
}

export interface BookingInput {
  fullName: string;
  email: string;
  phoneNumber?: string;
  notes?: string;
  voucherCode?: string;
  bookingDetails: BookingDetailInput[];
}

export async function getBookings() {
  return request('/bookings', { method: 'GET' });
}

export async function createBooking(data: BookingInput) {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function cancelBooking(id: number | string) {
  return request(`/bookings/${id}/cancel`, { method: 'PUT' });
}

export async function getAvailableRooms(checkIn: string, checkOut: string, quantity = 10) {
  return request(`/rooms/available?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&quantity=${quantity}`, { method: 'GET' });
}

export async function getRoomStatuses() {
  return request('/rooms', { method: 'GET' });
}

export async function getReceptionEta() {
  return request('/reception/eta', { method: 'GET' });
}

export async function getReceptionCheckInInfo(bookingCode: string) {
  return request(`/reception/checkin/${encodeURIComponent(bookingCode)}`, { method: 'GET' });
}

export async function checkInBooking(bookingId: number) {
  return request('/reception/checkin', {
    method: 'POST',
    body: JSON.stringify(bookingId),
  });
}

export async function checkOutBooking(bookingId: number) {
  return request(`/reception/checkout/${bookingId}`, { method: 'POST' });
}

export async function getHousekeepingTasks() {
  return request('/housekeeping/tasks', { method: 'GET' });
}

export async function completeHousekeepingTask(roomId: number) {
  return request(`/housekeeping/tasks/${roomId}/complete`, { method: 'PUT' });
}
