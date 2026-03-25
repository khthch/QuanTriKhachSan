import React from 'react';
import { motion } from 'motion/react';
import { 
  DoorOpen, 
  UserRound, 
  Sparkles, 
  Wrench, 
  HardHat, 
  Calendar, 
  AlertTriangle, 
  ChevronRight 
} from 'lucide-react';
import { Room } from '../../types';
import { cn } from '../../lib/utils';

type RoomCardProps = React.ComponentPropsWithoutRef<'div'> & {
  room: Room;
  onClick?: () => void;
};

export function RoomCard({ room, onClick, className, ...props }: RoomCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return DoorOpen;
      case 'occupied': return UserRound;
      case 'cleaning': return Sparkles;
      case 'maintenance': return Wrench;
      case 'out-of-service': return HardHat;
      default: return DoorOpen;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'occupied': return 'bg-red-50 text-red-500 border-red-200';
      case 'cleaning': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'maintenance': return 'bg-slate-100 text-slate-600 border-slate-300';
      case 'out-of-service': return 'bg-slate-100 text-slate-600 border-slate-300';
      default: return 'bg-slate-50 text-slate-400 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Phòng trống';
      case 'occupied': return 'Đang có khách';
      case 'cleaning': return 'Đang dọn dẹp';
      case 'maintenance': return 'Bảo trì';
      case 'out-of-service': return 'Ngừng phục vụ';
      default: return status;
    }
  };

  const Icon = getStatusIcon(room.status);
  const colorClass = getStatusColor(room.status);

  return (
    <motion.div 
      {...props}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={cn("group bg-white rounded-3xl p-6 custom-shadow border border-slate-100 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col", className)}
    >
      <div className="flex justify-between items-start mb-10">
        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-colors", colorClass.split(' ')[0], colorClass.split(' ')[1])}>
          <Icon className="w-7 h-7" />
        </div>
        <span className={cn("px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest", colorClass.split(' ')[0], colorClass.split(' ')[1])}>
          {getStatusLabel(room.status)}
        </span>
      </div>
      
      <h3 className="text-3xl font-extrabold font-headline text-slate-900">{room.number}</h3>
      <p className="text-slate-400 text-sm font-semibold mt-1">{room.type}</p>
      
      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          {room.guestName || room.floor || (room.eta && `ETA ${room.eta}`)}
        </span>
        {room.status === 'maintenance' ? (
          <AlertTriangle className="w-4 h-4 text-red-400" />
        ) : room.status === 'occupied' ? (
          <Calendar className="w-4 h-4 text-slate-300" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
        )}
      </div>
    </motion.div>
  );
}
