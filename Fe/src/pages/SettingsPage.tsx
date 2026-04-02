import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Shield, 
  MoreVertical, 
  Plus, 
  Filter, 
  Settings as SettingsIcon,
  Bell,
  Lock,
  Globe
} from 'lucide-react';
import { STAFF } from '../constants';
import { cn } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { SearchInput } from '../components/ui/SearchInput';

import { getUser, setToken, setUser, clearAuth } from '../lib/auth';
import { login, register } from '../lib/api';

export function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('users');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [authMode, setAuthMode] = React.useState<'login' | 'register'>('login');
  const [authError, setAuthError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(() => getUser());

  const tabs = [
    { id: 'users', label: 'Người dùng', icon: Users },
    { id: 'roles', label: 'Vai trò & Quyền', icon: Shield },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'security', label: 'Bảo mật', icon: Lock },
    { id: 'general', label: 'Chung', icon: Globe },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold font-headline tracking-tight text-slate-900">Cài đặt hệ thống</h2>
        <p className="text-slate-500 font-medium mt-1">Quản lý tài khoản, quyền truy cập và cấu hình</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        {currentUser ? (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xl font-bold">Xin chào, {currentUser.fullName}</p>
              <p className="text-sm text-slate-500">Vai trò: {currentUser.role}</p>
            </div>
            <button
              onClick={() => {
                clearAuth();
                setCurrentUser(null);
              }}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setAuthMode('login')}
                className={cn("px-4 py-1.5 rounded-lg text-sm font-bold", authMode === 'login' ? "bg-white shadow-sm text-primary" : "text-slate-500")}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={cn("px-4 py-1.5 rounded-lg text-sm font-bold", authMode === 'register' ? "bg-white shadow-sm text-primary" : "text-slate-500")}
              >
                Đăng ký khách
              </button>
            </div>

            <div className={cn("grid grid-cols-1 gap-4 items-end", authMode === 'register' ? "md:grid-cols-5" : "md:grid-cols-4")}>
            {authMode === 'register' && (
              <div className="md:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Họ tên</label>
                <input
                  onChange={(e) => setFullName(e.target.value)}
                  value={fullName}
                  type="text"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            )}
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                className="w-full mt-1 p-2 border border-slate-200 rounded-lg"
                placeholder="admin@hotel.com"
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Mật khẩu</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                className="w-full mt-1 p-2 border border-slate-200 rounded-lg"
                placeholder="Admin@123"
              />
            </div>
            {authMode === 'register' && (
              <div className="md:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">SĐT</label>
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  type="text"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg"
                  placeholder="0901234567"
                />
              </div>
            )}
            <div className={cn("flex items-center gap-3", authMode === 'register' ? "md:col-span-2" : "md:col-span-2")}>
              <button
                onClick={async () => {
                  setIsLoading(true);
                  setAuthError('');
                  try {
                    const result = authMode === 'login'
                      ? await login({ email, password })
                      : await register({ fullName, email, password, phone });
                    setToken(result.token);
                    setUser(result.user);
                    setCurrentUser(result.user);
                  } catch (error: any) {
                    setAuthError(error?.message || 'Xác thực thất bại');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-dim"
              >
                {isLoading ? 'Đang xử lý...' : authMode === 'login' ? 'Đăng nhập' : 'Đăng ký & đăng nhập'}
              </button>
              <span className="text-xs text-slate-500">Demo: admin@hotel.com / Admin@123, hoặc tự đăng ký role Guest</span>
            </div>
            </div>
            {authError && <p className="text-sm text-red-500 md:col-span-4">{authError}</p>}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-500 hover:bg-white hover:text-slate-900"
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          {activeTab === 'users' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <SearchInput 
                  placeholder="Tìm nhân viên..." 
                  containerClassName="w-full sm:w-96"
                  className="w-full"
                />
                <div className="flex gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                  <button className="flex-1 sm:flex-none bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all">
                    <Plus className="w-4 h-4" /> Thêm thành viên
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl custom-shadow border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-12 px-8 py-4 bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15rem]">
                  <div className="col-span-5">Nhân viên</div>
                  <div className="col-span-3">Vai trò</div>
                  <div className="col-span-2">Trạng thái</div>
                  <div className="col-span-2 text-right">Hành động</div>
                </div>

                <div className="divide-y divide-slate-100">
                  {STAFF.map((member) => (
                    <div key={member.id} className="grid grid-cols-12 px-8 py-5 items-center hover:bg-slate-50/50 transition-colors group">
                      <div className="col-span-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white shadow-sm">
                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{member.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{member.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">{member.role}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{member.department}</span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Badge variant={member.status === 'active' ? 'emerald' : 'amber'}>
                          {member.status}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab !== 'users' && (
            <div className="bg-white rounded-2xl custom-shadow border border-slate-100 p-12 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <SettingsIcon className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold font-headline">Tính năng đang phát triển</h3>
              <p className="text-slate-400 max-w-sm mx-auto">Chúng tôi đang hoàn thiện các phần cài đặt nâng cao. Vui lòng quay lại sau.</p>
              <button 
                onClick={() => setActiveTab('users')}
                className="text-primary font-bold text-sm hover:underline"
              >
                Quay lại Quản lý người dùng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
