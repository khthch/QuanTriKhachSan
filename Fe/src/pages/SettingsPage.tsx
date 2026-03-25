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

export function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('users');

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
