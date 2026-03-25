import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export function GuestLayout() {
  const location = useLocation();

  const navLinks = [
    { name: 'Phòng', path: '/' },
    { name: 'Tiện ích', path: '/amenities' },
    { name: 'Giới thiệu', path: '/about' },
  ];

  return (
    <div className="min-h-screen bg-surface selection:bg-secondary-container flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(13,28,50,0.05)] flex justify-between items-center px-6 md:px-12 py-6">
        <Link to="/" className="font-serif text-2xl tracking-tighter font-bold text-primary uppercase">LUXE MONOGRAPH</Link>
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "font-serif tracking-widest uppercase text-sm transition-colors pb-1",
                location.pathname === link.path 
                  ? "text-secondary border-b border-secondary" 
                  : "text-on-surface opacity-80 hover:text-secondary"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <button className="bg-primary text-white text-sm px-6 py-2 rounded-sm font-medium tracking-widest uppercase hover:opacity-90 transition-opacity">
          Phòng của tôi
        </button>
      </nav>

      <main className="flex-1 pt-24">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
          <div className="space-y-6">
            <div className="font-serif text-lg text-primary uppercase tracking-widest">LUXE MONOGRAPH</div>
            <p className="text-xs tracking-[0.1rem] uppercase text-slate-500 leading-relaxed">
              Một bộ sưu tập những thánh đường đẳng cấp thế giới <br/> được thiết kế cho những khách du lịch sành sỏi.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="text-[10px] font-bold tracking-[0.2rem] uppercase text-slate-400 mb-6">Thư mục</div>
            <div className="grid grid-cols-2 gap-4">
              {['Liên hệ', 'Bảo mật', 'Điều khoản', 'Mạng xã hội'].map(link => (
                <a key={link} href="#" className="text-xs tracking-[0.1rem] uppercase text-slate-900 hover:underline decoration-secondary underline-offset-4 transition-opacity">{link}</a>
              ))}
            </div>
          </div>

          <div className="space-y-6 md:text-right">
            <div className="text-[10px] font-bold tracking-[0.2rem] uppercase text-slate-400">Bản tin</div>
            <div className="flex border-b border-slate-200/30 pb-2 md:justify-end">
              <input type="email" placeholder="EMAIL CỦA BẠN" className="bg-transparent border-none text-[10px] tracking-widest focus:ring-0 placeholder:text-slate-400 w-48 uppercase" />
              <button className="text-secondary"><ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs tracking-[0.1rem] uppercase text-slate-500">© 2024 CỔNG ĐẶT PHÒNG KHÁCH SẠN. BẢN QUYỀN THUỘC VỀ CHÚNG TÔI.</div>
          <div className="flex gap-8">
            <Star className="w-4 h-4 text-secondary" />
            <Star className="w-4 h-4 text-secondary" />
            <Star className="w-4 h-4 text-secondary" />
          </div>
        </div>
      </footer>
    </div>
  );
}
