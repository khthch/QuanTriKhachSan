import React from 'react';
import { 
  WashingMachine, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Zap,
  LogOut,
  UserCheck,
  Info,
  Plus
} from 'lucide-react';
import { ROOMS } from '../constants';
import { cn } from '../lib/utils';
import { PageHeader } from '../components/dashboard/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { Pagination } from '../components/ui/Pagination';

export function HousekeepingPage() {
  const stats = [
    { label: 'To Clean', value: 24, icon: WashingMachine, color: 'text-primary', bg: 'bg-primary-container' },
    { label: 'In Progress', value: 8, icon: RefreshCw, color: 'text-secondary', bg: 'bg-secondary-container' },
    { label: 'Completed', value: 42, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Urgent', value: 3, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Danh sách dọn phòng" 
        description="24 phòng cần ưu tiên dọn hôm nay"
        actions={
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button className="px-4 py-1.5 text-sm font-semibold bg-white shadow-sm rounded-lg text-primary">Tất cả</button>
            <button className="px-4 py-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Chỉ VIP</button>
            <button className="px-4 py-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Trả phòng muộn</button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard 
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconClassName={stat.color}
            iconBgClassName={stat.bg}
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl custom-shadow overflow-hidden">
        <div className="grid grid-cols-12 px-8 py-5 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <div className="col-span-1 flex items-center">
            <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" />
          </div>
          <div className="col-span-2">Thông tin phòng</div>
          <div className="col-span-3">Trạng thái / Loại</div>
          <div className="col-span-2">Nhân viên</div>
          <div className="col-span-2">Cập nhật cuối</div>
          <div className="col-span-2 text-right">Hành động</div>
        </div>

        <div className="divide-y divide-slate-100">
          {ROOMS.slice(0, 4).map((room) => (
            <div key={room.id} className="grid grid-cols-12 px-8 py-6 items-center hover:bg-slate-50 transition-colors group">
              <div className="col-span-1">
                <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary h-5 w-5 cursor-pointer" />
              </div>
              <div className="col-span-2">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-900 font-headline leading-none">{room.number}</span>
                  <span className="text-xs text-slate-400 mt-1 font-medium">{room.type}</span>
                </div>
              </div>
              <div className="col-span-3">
                <div className="flex items-center gap-3">
                  {room.priority && (
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight flex items-center gap-1",
                      room.priority === 'urgent' ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"
                    )}>
                      <Zap className="w-3 h-3" /> Priority: {room.priority}
                    </span>
                  )}
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    {room.status === 'occupied' ? <UserCheck className="w-3.5 h-3.5" /> : <LogOut className="w-3.5 h-3.5" />}
                    {room.status === 'occupied' ? 'Khách ở tiếp' : 'Trả phòng'}
                  </span>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${room.assignedStaff || 'staff'}`} alt="Staff" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{room.assignedStaff || 'Chưa gán'}</span>
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-slate-400 font-medium">{room.lastUpdated || 'Chưa bắt đầu'}</span>
              </div>
              <div className="col-span-2 text-right">
                <button className="bg-primary hover:bg-primary-dim text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                  Hoàn tất
                </button>
              </div>
            </div>
          ))}
        </div>

        <Pagination 
          currentPage={1} 
          totalPages={6} 
          totalItems={24} 
          itemsPerPage={4} 
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-slate-50 rounded-2xl p-8 border border-transparent">
          <h3 className="text-xl font-bold font-headline mb-6">Hiệu suất nhân viên</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Thời gian dọn TB</span>
                <span className="text-primary font-bold">-4m</span>
              </div>
              <div className="text-3xl font-bold font-headline">28m 42s</div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Chỉ số hiệu quả</span>
                <span className="text-emerald-600 font-bold">+12%</span>
              </div>
              <div className="text-3xl font-bold font-headline">94.8%</div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-primary text-white rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold font-headline">Trọng tâm ca làm</h3>
              <Info className="w-5 h-5 opacity-50" />
            </div>
            <p className="text-primary-container opacity-90 text-sm mb-6 leading-relaxed">
              Ưu tiên dọn tầng 4. Dự kiến có 3 khách VIP nhận phòng từ 2:00 PM đến 3:30 PM.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-container" />
                <span className="text-sm font-medium">Tầng 1 đã xong</span>
              </li>
              <li className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-primary-container" />
                <span className="text-sm font-medium">Tầng 2 (Còn 3 phòng)</span>
              </li>
            </ul>
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      <button className="fixed bottom-8 right-8 bg-primary text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 group">
        <Plus className="w-6 h-6" />
        <span className="absolute right-full mr-4 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">Công việc mới</span>
      </button>
    </div>
  );
}
