import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: 'emerald' | 'amber' | 'blue' | 'red' | 'slate';
  className?: string;
}

export function Badge({ children, icon: Icon, variant = 'slate', className }: BadgeProps) {
  const variants = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    red: 'bg-red-50 text-red-500 border-red-100',
    slate: 'bg-slate-50 text-slate-500 border-slate-100',
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
      variants[variant],
      className
    )}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}
