import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row justify-between items-end gap-4", className)}>
      <div>
        <h2 className="text-3xl font-extrabold font-headline tracking-tight text-slate-900">{title}</h2>
        {description && <p className="text-slate-500 font-medium mt-1">{description}</p>}
      </div>
      <div className="flex gap-3">
        {actions}
      </div>
      {children}
    </div>
  );
}
