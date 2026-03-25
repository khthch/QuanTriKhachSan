import React from 'react';
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
  Plus
} from 'lucide-react';
import { BOOKINGS } from '../constants';
import { Badge } from '../components/ui/Badge';
import { SearchInput } from '../components/ui/SearchInput';
import { Pagination } from '../components/ui/Pagination';
import { PageHeader } from '../components/dashboard/PageHeader';

export function BookingsPage() {
  const getStatusVariant = (status: string): 'emerald' | 'amber' | 'blue' | 'red' | 'slate' => {
    switch (status) {
      case 'confirmed': return 'emerald';
      case 'pending': return 'amber';
      case 'checked-in': return 'blue';
      case 'cancelled': return 'red';
      default: return 'slate';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle2;
      case 'pending': return Clock3;
      case 'checked-in': return User;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

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
            <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all">
              <Plus className="w-4 h-4" /> Tạo đơn mới
            </button>
          </>
        }
      />

      <div className="bg-white rounded-2xl custom-shadow border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
            <button className="px-4 py-1.5 text-xs font-bold bg-white shadow-sm rounded-lg text-primary uppercase tracking-wider">Tất cả</button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider">Sắp đến</button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider">Đang ở</button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider">Đã trả</button>
          </div>
          
          <SearchInput 
            placeholder="Tìm tên khách..." 
            containerClassName="w-64"
          />
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
              {BOOKINGS.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-sm">
                        {booking.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{booking.guestName}</p>
                        <p className="text-xs text-slate-400 font-medium">{booking.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Calendar className="w-4 h-4 text-slate-300" />
                      <span>{booking.checkIn} - {booking.checkOut}</span>
                      <span className="text-xs text-slate-400 font-medium ml-1">({booking.nights} đêm)</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-semibold text-slate-600">{booking.roomType}</span>
                  </td>
                  <td className="px-8 py-5">
                    <Badge 
                      variant={getStatusVariant(booking.status)} 
                      icon={getStatusIcon(booking.status)}
                    >
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-slate-300" />
                      <span className="text-sm font-bold text-slate-900">${booking.total.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination 
          currentPage={1} 
          totalPages={12} 
          totalItems={128} 
          itemsPerPage={4} 
        />
      </div>
    </div>
  );
}
