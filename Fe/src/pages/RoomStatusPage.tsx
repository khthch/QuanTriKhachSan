import React, { useEffect, useState } from 'react';
import { 
  SlidersHorizontal
} from 'lucide-react';
import { ROOMS } from '../constants';
import { getAvailableRooms } from '../lib/api';
import { cn } from '../lib/utils';
import { StatCard } from '../components/ui/StatCard';
import { PageHeader } from '../components/dashboard/PageHeader';
import { RoomCard } from '../components/dashboard/RoomCard';

export function RoomStatusPage() {
  const [rooms, setRooms] = React.useState(ROOMS);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function loadRooms() {
      setIsLoading(true);
      setError('');
      try {
        const today = new Date();
        const nextDay = new Date(today.getTime() + 86400000);
        const isoToday = today.toISOString().split('T')[0];
        const isoNextDay = nextDay.toISOString().split('T')[0];

        const data = await getAvailableRooms(isoToday, isoNextDay, 25);
        if (Array.isArray(data) && data.length > 0) {
          setRooms(data.map((r: any, index: number) => ({
            id: r.id || String(index),
            number: r.roomNumber || r.number || `#${index + 1}`,
            type: r.roomType?.name || 'Phòng',
            status: r.status?.toLowerCase() || 'available',
            price: r.roomType?.basePrice || r.price || 0,
            image: r.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
            description: r.description || 'Mô tả phòng',
            floor: r.floorNumber ?? 'Tầng ?',
          })));
        }
      } catch (err: any) {
        setError(err?.message || 'Lỗi tải phòng, giữ dữ liệu mẫu');
      } finally {
        setIsLoading(false);
      }
    }

    loadRooms();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Trạng thái Phòng"
        description="Tổng quan thực tế về tình trạng phòng và bảo trì"
        actions={
          <>
            <StatCard label="Phòng trống" value={rooms.filter((it) => it.status === 'available').length} className="min-w-[160px] py-4" />
            <StatCard label="Đang có khách" value={rooms.filter((it) => it.status === 'occupied').length} className="min-w-[160px] py-4" />
          </>
        }
      />

      {error && <div className="text-red-500 font-semibold">{error}</div>}

      <div className="bg-slate-100 p-2 rounded-2xl flex flex-wrap items-center gap-2 mb-8 border border-slate-200/50">
        <button className="bg-white text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 border border-slate-100">
          <SlidersHorizontal className="w-4 h-4" /> Tất cả phòng
        </button>
        {['Tầng 1', 'Tầng 2', 'Phòng Suite'].map(filter => (
          <button key={filter} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-white transition-all">{filter}</button>
        ))}
        
        <div className="ml-auto hidden lg:flex items-center gap-6 px-4">
          {[
            { color: 'bg-emerald-500', label: 'Trống' },
            { color: 'bg-red-500', label: 'Có khách' },
            { color: 'bg-amber-400', label: 'Dọn dẹp' },
            { color: 'bg-slate-400', label: 'Bảo trì' },
          ].map(status => (
            <div key={status.label} className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", status.color)}></span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{status.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
