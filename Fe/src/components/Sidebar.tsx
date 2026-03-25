import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bed, Calendar, Monitor, Brush, Settings, HelpCircle, Plus, LayoutGrid } from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar() {
  const navItems = [
    { icon: Bed, label: 'Trạng thái Phòng', to: '/dashboard/status' },
    { icon: Calendar, label: 'Đơn đặt phòng', to: '/dashboard/bookings' },
    { icon: Monitor, label: 'Lễ tân', to: '/dashboard/reception' },
    { icon: Brush, label: 'Buồng phòng', to: '/dashboard/housekeeping' },
  ];

  return (
    <aside className="w-64 fixed h-full bg-white border-r border-slate-200 flex flex-col z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-extrabold font-headline text-slate-900">The Atelier</h1>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Grand Metropolitan</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all",
                isActive 
                  ? "bg-blue-50 text-blue-600 border-l-4 border-primary rounded-l-none" 
                  : "text-slate-500 hover:bg-slate-50"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="w-full bg-primary hover:bg-primary-dim text-white py-3 px-4 rounded-xl font-bold text-sm mb-4 shadow-lg shadow-primary/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Đặt phòng Mới
        </button>
        <div className="space-y-1">
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all",
                isActive ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50"
              )
            }
          >
            <Settings className="w-5 h-5" />
            <span>Cài đặt</span>
          </NavLink>
          <NavLink
            to="/dashboard/help"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all",
                isActive ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50"
              )
            }
          >
            <HelpCircle className="w-5 h-5" />
            <span>Hỗ trợ</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
