import React from 'react';
import { 
  UserPlus, 
  Key, 
  CreditCard, 
  Search, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Smartphone
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PageHeader } from '../components/dashboard/PageHeader';
import { checkInBooking, checkOutBooking, getReceptionCheckInInfo, getReceptionEta } from '../lib/api';

export function ReceptionPage() {
  const [mode, setMode] = React.useState<'checkin' | 'checkout'>('checkin');
  const [bookingCode, setBookingCode] = React.useState('');
  const [selectedBooking, setSelectedBooking] = React.useState<any>(null);
  const [etaList, setEtaList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const loadEta = React.useCallback(async () => {
    try {
      const data = await getReceptionEta();
      setEtaList(Array.isArray(data) ? data : []);
    } catch {
      setEtaList([]);
    }
  }, []);

  React.useEffect(() => {
    loadEta();
  }, [loadEta]);

  async function handleSearch() {
    if (!bookingCode.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await getReceptionCheckInInfo(bookingCode.trim());
      setSelectedBooking(data);
    } catch (e) {
      setSelectedBooking(null);
      setError(e instanceof Error ? e.message : 'Không tìm thấy đặt phòng');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitFlow() {
    if (!selectedBooking?.id) return;
    setLoading(true);
    setError('');
    try {
      if (mode === 'checkin') {
        await checkInBooking(Number(selectedBooking.id));
      } else {
        await checkOutBooking(Number(selectedBooking.id));
      }
      const refreshed = await getReceptionCheckInInfo(String(selectedBooking.bookingCode));
      setSelectedBooking(refreshed);
      loadEta();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Lễ tân & Check-in" 
        description="Chào đón khách hàng và quản lý chìa khóa"
        actions={
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button onClick={() => setMode('checkin')} className={cn("px-6 py-2 rounded-xl text-sm font-bold", mode === 'checkin' ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-slate-600 transition-colors")}>Check-in</button>
            <button onClick={() => setMode('checkout')} className={cn("px-6 py-2 rounded-xl text-sm font-bold", mode === 'checkout' ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-slate-600 transition-colors")}>Check-out</button>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-8">
        {/* Main Check-in Flow */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl custom-shadow border border-slate-100 p-10">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-headline">Tìm kiếm đặt phòng</h3>
                <p className="text-slate-400 font-medium">Nhập mã đặt phòng hoặc tên khách hàng</p>
              </div>
            </div>

            <div className="relative mb-12">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
              <input 
                type="text" 
                placeholder="Ví dụ: BK-9283 hoặc Julianna Smith" 
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="w-full pl-16 pr-6 py-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl font-bold focus:border-primary focus:ring-0 transition-all placeholder:text-slate-200"
              />
            </div>

            <div className="flex items-center gap-3 mb-8">
              <button onClick={handleSearch} disabled={loading} className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dim disabled:opacity-60">
                {loading ? 'Đang tìm...' : 'Tìm đặt phòng'}
              </button>
              {selectedBooking && (
                <button onClick={handleSubmitFlow} disabled={loading} className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold disabled:opacity-60">
                  {mode === 'checkin' ? 'Xác nhận Check-in' : 'Xác nhận Check-out'}
                </button>
              )}
            </div>

            {error && <p className="text-sm font-semibold text-red-500 mb-6">{error}</p>}

            {selectedBooking && (
              <div className="mb-8 p-6 rounded-2xl border border-slate-100 bg-slate-50/60">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400 font-medium">Mã đặt phòng</p>
                    <p className="font-bold text-slate-900">{selectedBooking.bookingCode}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Trạng thái</p>
                    <p className="font-bold text-slate-900">{selectedBooking.status}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Khách</p>
                    <p className="font-bold text-slate-900">{selectedBooking.guestName || selectedBooking.guestEmail || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Liên hệ</p>
                    <p className="font-bold text-slate-900">{selectedBooking.guestPhone || selectedBooking.guestEmail || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Key, label: 'Cấp thẻ từ', desc: 'Mã hóa 2 thẻ' },
                { icon: CreditCard, label: 'Thanh toán', desc: 'Xác nhận cọc' },
                { icon: ShieldCheck, label: 'Định danh', desc: 'Scan Passport' },
              ].map((step, i) => (
                <div key={i} className="p-6 rounded-2xl border-2 border-slate-50 bg-slate-50/30 hover:border-primary/20 hover:bg-white transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <step.icon className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                  </div>
                  <p className="font-bold text-slate-900">{step.label}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary-container">
                  <Smartphone className="w-3 h-3" /> Digital Key Ready
                </div>
                <h3 className="text-3xl font-bold font-headline">Gửi chìa khóa số?</h3>
                <p className="text-white/60 text-sm max-w-sm">Khách hàng có thể mở phòng trực tiếp bằng điện thoại thông qua ứng dụng The Atelier.</p>
              </div>
              <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-primary-container transition-all whitespace-nowrap">
                Gửi tới điện thoại <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-white rounded-3xl custom-shadow border border-slate-100 p-8">
            <h3 className="text-lg font-bold font-headline mb-6">Khách sắp đến (ETA)</h3>
            <div className="space-y-6">
              {etaList.slice(0, 5).map((guest, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {(guest.guestName || 'G').split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{guest.guestName || guest.guestEmail || 'Guest'}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <Clock className="w-3 h-3" /> {guest.bookingDetails?.[0]?.checkInDate ? new Date(guest.bookingDetails[0].checkInDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--'} • {guest.bookingCode}
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    guest.status === 'Confirmed' ? "bg-emerald-500" : "bg-amber-400"
                  )}></div>
                </div>
              ))}
              {etaList.length === 0 && <p className="text-sm text-slate-400">Chưa có khách sắp đến trong 24h tới.</p>}
            </div>
            <button className="w-full mt-8 py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors flex items-center justify-center gap-2">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-surface-container rounded-3xl p-8 border border-slate-200/50">
            <h3 className="text-lg font-bold font-headline mb-6">Thông tin nhanh</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-semibold">Thứ 7, 21 Tháng 3</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-semibold">Thời tiết: 24°C, Nắng nhẹ</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-semibold">Hệ thống: Hoạt động tốt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
