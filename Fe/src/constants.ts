import { Room, Booking, Staff } from './types';

export const ROOMS: Room[] = [
  {
    id: '1',
    number: '101',
    type: 'Deluxe Heritage Suite',
    status: 'available',
    price: 420,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800',
    description: 'Được bài trí tinh tế với nội thất cao cấp và cửa sổ kịch trần nhìn ra vườn thượng uyển.',
    floor: 'Tầng 1',
    priority: 'urgent',
    assignedStaff: 'Sarah C.',
    lastUpdated: '12 phút trước'
  },
  {
    id: '2',
    number: '102',
    type: 'Executive Suite',
    status: 'occupied',
    price: 650,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    description: 'Không gian sang trọng dành cho doanh nhân với đầy đủ tiện nghi làm việc.',
    floor: 'Tầng 1',
    guestName: 'M. Thompson'
  },
  {
    id: '3',
    number: '103',
    type: 'Standard Double',
    status: 'cleaning',
    price: 250,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
    description: 'Phòng đôi tiêu chuẩn với thiết kế hiện đại và ấm cúng.',
    floor: 'Tầng 1',
    eta: '14:00'
  },
  {
    id: '4',
    number: '104',
    type: 'Grand Suite',
    status: 'maintenance',
    price: 850,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    description: 'Sự kết hợp hoàn hảo giữa nghệ thuật và tiện nghi đẳng cấp.',
    floor: 'Tầng 1'
  },
  {
    id: '5',
    number: '105',
    type: 'Standard Double',
    status: 'occupied',
    price: 250,
    image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80&w=800',
    description: 'Phòng đôi tiêu chuẩn, trả phòng hôm nay.',
    floor: 'Tầng 1'
  },
  {
    id: '6',
    number: '201',
    type: 'Presidential Suite',
    status: 'available',
    price: 1280,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
    description: 'Thánh đường xa hoa nhất của chúng tôi với sân hiên riêng, quản gia riêng.',
    floor: 'Tầng 2'
  },
  {
    id: '7',
    number: '202',
    type: 'Deluxe Single',
    status: 'cleaning',
    price: 320,
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800',
    description: 'Phòng đơn cao cấp, đang tổng vệ sinh.',
    floor: 'Tầng 2'
  },
  {
    id: '8',
    number: '203',
    type: 'Standard Single',
    status: 'available',
    price: 180,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    description: 'Phòng đơn tiêu chuẩn, gọn gàng và tiện lợi.',
    floor: 'Tầng 2'
  },
  {
    id: '9',
    number: '204',
    type: 'Deluxe Twin',
    status: 'out-of-service',
    price: 380,
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
    description: 'Phòng hai giường đơn cao cấp, đang sơn sửa.',
    floor: 'Tầng 2'
  },
  {
    id: '10',
    number: '205',
    type: 'Executive Suite',
    status: 'available',
    price: 650,
    image: 'https://images.unsplash.com/photo-1591088398332-8a77d399e80c?auto=format&fit=crop&q=80&w=800',
    description: 'Phòng Executive Suite sang trọng.',
    floor: 'Tầng 2'
  }
];

export const BOOKINGS: Booking[] = [
  {
    id: '1',
    guestName: 'Julianna Smith',
    email: 'julianna.s@example.com',
    checkIn: 'Oct 12',
    checkOut: 'Oct 15',
    nights: 3,
    roomType: 'Phòng King',
    status: 'confirmed',
    total: 1260,
    avatar: 'JS'
  },
  {
    id: '2',
    guestName: 'Marcus Richardson',
    email: 'm.richardson@business.com',
    checkIn: 'Oct 14',
    checkOut: 'Oct 16',
    nights: 2,
    roomType: 'Phòng Deluxe Đôi',
    status: 'pending',
    total: 840,
    avatar: 'MR'
  },
  {
    id: '3',
    guestName: 'Elena Lavoie',
    email: 'e.lavoie@voyage.net',
    checkIn: 'Oct 18',
    checkOut: 'Oct 25',
    nights: 7,
    roomType: 'Phòng Penthouse',
    status: 'confirmed',
    total: 8960,
    avatar: 'EL'
  },
  {
    id: '4',
    guestName: 'David Wright',
    email: 'dwright@provider.com',
    checkIn: 'Oct 10',
    checkOut: 'Oct 12',
    nights: 2,
    roomType: 'Phòng Đơn Tiêu chuẩn',
    status: 'cancelled',
    total: 360,
    avatar: 'DW'
  }
];

export const STAFF: Staff[] = [
  {
    id: '1',
    name: 'Julian Montgomery',
    email: 'julian.m@azuremeridian.com',
    role: 'Quản trị viên',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?u=julian',
    department: 'Quản lý'
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    email: 's.jenkins@azuremeridian.com',
    role: 'Lễ tân',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    department: 'Vận hành'
  },
  {
    id: '3',
    name: 'Marcus Thorne',
    email: 'm.thorne@azuremeridian.com',
    role: 'Quản lý',
    status: 'away',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    department: 'Kinh doanh'
  }
];
