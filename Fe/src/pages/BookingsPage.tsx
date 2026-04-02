import React, { useEffect, useMemo, useState } from 'react';
import {
  Download,
  MoreHorizontal,
  Calendar,
  Clock,
  User,
  CreditCard,
  CheckCircle2,
  Clock3,
  XCircle,
  Plus,
  X,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { SearchInput } from '../components/ui/SearchInput';
import { Pagination } from '../components/ui/Pagination';
import { PageHeader } from '../components/dashboard/PageHeader';
import { getAvailableRooms, getBookings, createBooking, cancelBooking } from '../lib/api';

interface BookingDetailInput {
  roomTypeId: number;
  numberOfRooms: number;
  checkInDate: string;
  checkOutDate: string;
  pricePerNight: number;
}

interface GuestBooking {
  id: number;
  fullName?: string;
  guestName?: string;
  email?: string;
  guestEmail?: string;
  status: string;
  totalEstimatedAmount: number;
  bookingDetails: Array<{
    roomType?: { name: string };
    checkInDate: string;
    checkOutDate: string;
    numberOfRooms: number;
  }>;
}

export function BookingsPage() {
  const [bookings, setBookings] = useState<GuestBooking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState('');

  const [isCreating, setIsCreating] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [roomTypeId, setRoomTypeId] = useState<number>(0);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setHasError('');
      try {
        const [b, rooms] = await Promise.all([
          getBookings(),
          getAvailableRooms(checkIn, checkOut, 20),
        ]);
        setBookings(b);
        setAvailableRooms(rooms);
        if (rooms[0]?.roomTypeId) {
          setRoomTypeId(Number(rooms[0].roomTypeId));
        }
      } catch (err: any) {
        setHasError(err?.message || 'Không thể tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [checkIn, checkOut]);

  const filteredBookings = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return bookings;
    return bookings.filter((b) =>
      b.fullName.toLowerCase().includes(term) ||
      b.email.toLowerCase().includes(term) ||
      b.bookingDetails.some((d) => d.roomType?.name?.toLowerCase().includes(term)),
    );
  }, [bookings, searchTerm]);

  const statusVariant = (status: string): 'emerald' | 'amber' | 'blue' | 'red' | 'slate' => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'emerald';
      case 'pending':
        return 'amber';
      case 'checkedin':
      case 'checked-in':
        return 'blue';
      case 'cancelled':
        return 'red';
      default:
        return 'slate';
    }
  };

  const statusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return CheckCircle2;
      case 'pending':
        return Clock3;
      case 'checkedin':
      case 'checked-in':
        return User;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  async function handleCreateBooking() {
    if (!fullName || !email || !checkIn || !checkOut || !roomTypeId) {
      return setHasError('Vui lòng điền đủ thông tin');
    }

    const payload = {
      fullName,
      email,
      bookingDetails: [
        {
            roomTypeId: Number(roomTypeId),
          numberOfRooms: 1,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          pricePerNight: 0,
        },
      ],
    };

    setIsLoading(true);
    setHasError('');
    try {
      await createBooking(payload);
      const newBookings = await getBookings();
      setBookings(newBookings);
      setIsCreating(false);
      setFullName('');
      setEmail('');
    } catch (err: any) {
      setHasError(err?.message || 'Tạo booking thất bại');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancel(id: string) {
    setIsLoading(true);
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.map((b) => (String(b.id) === id ? { ...b, status: 'cancelled' } : b)));
    } catch (err: any) {
      setHasError(err?.message || 'Không thể huỷ booking');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Đơn đặt phòng"
        description="Quản lý và theo dõi tất cả các lượt lưu trú"
        actions={
          <>
            <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" /> Xuất báo cáo
            </button>
            <button onClick={() => setIsCreating(true)} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all">
              <Plus className="w-4 h-4" /> Tạo đơn mới
            </button>
          </>
        }
      />

      {hasError && <div className="text-red-500 font-semibold">{hasError}</div>}

      {isCreating && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4 gap-2">
            <h3 className="font-bold text-lg">Tạo đơn đặt phòng mới</h3>
            <button onClick={() => setIsCreating(false)} className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300"> <X className="w-4 h-4" /> </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Tên khách" className="border p-2 rounded-lg" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded-lg" />
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="border p-2 rounded-lg" />
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="border p-2 rounded-lg" />
            <select value={roomTypeId || ''} onChange={(e) => setRoomTypeId(Number(e.target.value || 0))} className="col-span-1 border p-2 rounded-lg">
              <option value="">Chọn loại phòng</option>
              {availableRooms.map((room) => (
                <option key={room.id} value={room.roomTypeId || room.id}>{room.roomType?.name ?? room.roomTypeName ?? `${room.roomNumber ?? room.id}`}</option>
              ))}
            </select>
          </div>
          <button onClick={handleCreateBooking} className="mt-4 bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary-dim">Xác nhận tạo</button>
        </div>
      )}

      <div className="bg-white rounded-2xl custom-shadow border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
            <button className="px-4 py-1.5 text-xs font-bold bg-white shadow-sm rounded-lg text-primary uppercase tracking-wider">Tất cả</button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider">Sắp đến</button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider">Đang ở</button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider">Đã trả</button>
          </div>

          <SearchInput placeholder="Tìm tên khách..." containerClassName="w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15rem]">
                <th className="px-8 py-4">Khách hàng</th>
                <th className="px-8 py-4">Thời gian lưu trú</th>
                <th className="px-8 py-4">Loại phòng</th>
                <th className="px-8 py-4">Trạng thái</th>
                <th className="px-8 py-4">Tổng cộng</th>
                <th className="px-8 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="text-center p-6">Đang tải...</td>
                </tr>
              )}
              {!isLoading && filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-6">Không có đơn đặt phòng</td>
                </tr>
              )}
              {!isLoading && filteredBookings.map((booking) => {
                const detail = booking.bookingDetails[0];
                const displayName = booking.fullName ?? booking.guestName ?? 'Khách';
                const displayEmail = booking.email ?? booking.guestEmail ?? '';
                return (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-sm">
                          {displayName.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{displayName}</p>
                          <p className="text-xs text-slate-400 font-medium">{displayEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Calendar className="w-4 h-4 text-slate-300" />
                        <span>{new Date(detail.checkInDate).toLocaleDateString()} - {new Date(detail.checkOutDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-semibold text-slate-600">{detail.roomType?.name ?? 'Không rõ'}</span>
                    </td>
                    <td className="px-8 py-5">
                      <Badge variant={statusVariant(booking.status)} icon={statusIcon(booking.status)}>{booking.status}</Badge>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-slate-300" />
                        <span className="text-sm font-bold text-slate-900">{booking.totalEstimatedAmount?.toLocaleString?.() ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      {booking.status.toLowerCase() !== 'cancelled' && (
                        <button onClick={() => handleCancel(String(booking.id))} className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Huỷ</button>
                      )}
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={1} totalPages={1} totalItems={filteredBookings.length} itemsPerPage={10} />
      </div>
    </div>
  );
}
