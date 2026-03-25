import React from 'react';
import { motion } from 'motion/react';
import { 
  Wifi, 
  Wind, 
  Waves, 
  ConciergeBell, 
  Bath, 
  Wine, 
  BedDouble,
  Star,
  Search,
  ArrowRight
} from 'lucide-react';
import { ROOMS } from '../constants';
import { cn } from '../lib/utils';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface selection:bg-secondary-container">
      <main>
        {/* Hero Section */}
        <section className="relative h-[614px] flex items-center justify-center px-6 mb-20">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920"
              alt="Luxury hotel lobby"
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full max-w-6xl text-center"
          >
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-4 tracking-tight">Thánh Đường Tinh Tế</h1>
            <p className="font-sans text-white/80 text-lg tracking-widest uppercase mb-10">Trải nghiệm Nghệ thuật Sống</p>
            
            {/* Search Bar */}
            <div className="bg-white/95 backdrop-blur shadow-2xl p-2 md:p-4 rounded-sm flex flex-col md:flex-row items-stretch gap-2 max-w-4xl mx-auto">
              <div className="flex-1 flex flex-col px-4 py-2 border-r border-slate-200/30 text-left">
                <label className="text-[10px] font-bold tracking-[0.1rem] uppercase text-slate-400 mb-1">Ngày nhận phòng</label>
                <input type="date" className="border-none p-0 focus:ring-0 text-sm font-medium text-primary bg-transparent" />
              </div>
              <div className="flex-1 flex flex-col px-4 py-2 border-r border-slate-200/30 text-left">
                <label className="text-[10px] font-bold tracking-[0.1rem] uppercase text-slate-400 mb-1">Ngày trả phòng</label>
                <input type="date" className="border-none p-0 focus:ring-0 text-sm font-medium text-primary bg-transparent" />
              </div>
              <div className="flex-1 flex flex-col px-4 py-2 border-r border-slate-200/30 text-left">
                <label className="text-[10px] font-bold tracking-[0.1rem] uppercase text-slate-400 mb-1">Số khách</label>
                <select defaultValue="2 Người lớn" className="border-none p-0 focus:ring-0 text-sm font-medium text-primary bg-transparent">
                  <option>1 Người lớn</option>
                  <option>2 Người lớn</option>
                  <option>2 Người lớn, 1 Trẻ em</option>
                </select>
              </div>
              <button className="bg-secondary text-white px-10 py-4 font-bold tracking-widest uppercase text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                Tìm kiếm
              </button>
            </div>
          </motion.div>
        </section>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-12 mb-32">
          {/* Filters */}
          <aside className="col-span-12 lg:col-span-3 space-y-12">
            <div>
              <h3 className="font-serif text-xl mb-6 border-b border-slate-200/20 pb-2">Bộ lọc</h3>
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="block text-[11px] font-bold tracking-[0.1rem] uppercase text-slate-400">Khoảng giá mỗi đêm</span>
                  <div className="px-2">
                    <input type="range" className="w-full accent-secondary h-1 bg-slate-200 rounded-full appearance-none" />
                    <div className="flex justify-between mt-2 text-xs font-medium text-on-surface-variant">
                      <span>$200</span>
                      <span>$2,500+</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <span className="block text-[11px] font-bold tracking-[0.1rem] uppercase text-slate-400">Đặc quyền</span>
                  <div className="space-y-3">
                    {['Ban công riêng', 'Hướng biển', 'Mini Bar'].map((feature) => (
                      <label key={feature} className="flex items-center gap-3 group cursor-pointer">
                        <input type="checkbox" className="rounded-none border-slate-300 text-secondary focus:ring-secondary/20 h-4 w-4" />
                        <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="block text-[11px] font-bold tracking-[0.1rem] uppercase text-slate-400">Hạng sao</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={cn("w-4 h-4", s <= 4 ? "text-secondary fill-secondary" : "text-slate-300")} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Room Listings */}
          <div className="col-span-12 lg:col-span-6 space-y-16">
            <h3 className="font-serif text-2xl border-b border-slate-200/10 pb-4">Danh sách phòng</h3>
            
            {ROOMS.filter(r => r.status === 'available').map((room) => (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative overflow-hidden mb-6 aspect-[16/9]">
                  <img
                    src={room.image}
                    alt={room.type}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {room.price > 1000 && (
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase">Đặc trưng</div>
                  )}
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-serif text-3xl text-slate-900">{room.type}</h2>
                    <p className="text-on-surface-variant text-sm mt-1 max-w-md">{room.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-serif text-secondary">${room.price}</span>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Giá mỗi đêm</span>
                  </div>
                </div>

                <div className="flex items-center gap-8 mb-8 pb-8 border-b border-slate-200/10">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Wifi className="w-4 h-4 text-secondary" />
                    <span className="text-[10px] font-bold tracking-wider uppercase">WiFi Tốc độ cao</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Wind className="w-4 h-4 text-secondary" />
                    <span className="text-[10px] font-bold tracking-wider uppercase">Điều hòa</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Waves className="w-4 h-4 text-secondary" />
                    <span className="text-[10px] font-bold tracking-wider uppercase">Hồ bơi</span>
                  </div>
                </div>

                <button className="w-full py-4 border-b border-secondary text-secondary font-bold tracking-[0.2rem] uppercase text-xs hover:bg-secondary hover:text-white transition-all duration-300">
                  Đặt ngay
                </button>
              </motion.div>
            ))}
          </div>

          {/* Booking Summary */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-32 bg-white p-8 shadow-[0_20px_40px_rgba(13,28,50,0.05)] border border-slate-200/10">
              <h3 className="font-serif text-xl mb-8 border-b border-slate-200/20 pb-4">Tóm tắt đặt phòng</h3>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="block text-[10px] font-bold tracking-widest uppercase text-slate-400">Nhận phòng</span>
                    <span className="font-medium text-primary">12 Th12, 2024</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold tracking-widest uppercase text-slate-400">Trả phòng</span>
                    <span className="font-medium text-primary">15 Th12, 2024</span>
                  </div>
                </div>
                
                <div className="py-4 border-y border-slate-200/10">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-on-surface-variant">Deluxe Heritage (3 đêm)</span>
                    <span className="text-sm font-medium">$1,260</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-on-surface-variant">Thuế & Phí</span>
                    <span className="text-sm font-medium">$124</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-serif text-lg tracking-tighter">Tổng cộng dự kiến</span>
                  <span className="font-serif text-2xl text-secondary">$1,384</span>
                </div>
              </div>
              
              <button className="w-full bg-slate-900 text-white py-5 font-bold tracking-[0.25rem] uppercase text-xs hover:opacity-95 transition-all shadow-xl shadow-slate-900/20">
                Tiến hành thanh toán
              </button>
              <p className="text-[10px] text-center mt-6 text-slate-400 font-medium tracking-widest leading-relaxed uppercase">
                Hủy phòng miễn phí cho đến <br/>10 Th12, 2024
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
