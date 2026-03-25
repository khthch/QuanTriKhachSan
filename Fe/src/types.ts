export interface Room {
  id: string;
  number: string;
  type: string;
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'out-of-service';
  price: number;
  image: string;
  description: string;
  floor: string;
  guestName?: string;
  eta?: string;
  priority?: 'urgent' | 'high' | 'normal';
  assignedStaff?: string;
  lastUpdated?: string;
}

export interface Booking {
  id: string;
  guestName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomType: string;
  status: 'confirmed' | 'pending' | 'checked-in' | 'cancelled';
  total: number;
  avatar?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'away' | 'offline';
  avatar: string;
  department: string;
}
