import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';

type SearchInputProps = React.ComponentPropsWithoutRef<'input'> & {
  containerClassName?: string;
};

export function SearchInput({ containerClassName, className, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input 
        {...props}
        className={cn(
          "pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none",
          className
        )}
      />
    </div>
  );
}
