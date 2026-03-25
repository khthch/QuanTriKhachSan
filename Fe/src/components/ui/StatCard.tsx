import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

type StatCardProps = React.ComponentPropsWithoutRef<'div'> & {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconClassName?: string;
  iconBgClassName?: string;
};

export function StatCard({ label, value, icon: Icon, iconClassName, iconBgClassName, className, ...props }: StatCardProps) {
  return (
    <div {...props} className={cn("bg-white p-6 rounded-2xl custom-shadow border border-slate-100 flex items-center gap-4", className)}>
      {Icon && (
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", iconBgClassName)}>
          <Icon className={cn("w-6 h-6", iconClassName)} />
        </div>
      )}
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-headline font-extrabold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
