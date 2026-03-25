import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  className 
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cn("px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between", className)}>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Hiển thị {startItem}-{endItem} trong số {totalItems}
      </p>
      <div className="flex items-center gap-1">
        <button 
          className="p-2 text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-30"
          disabled={currentPage === 1}
          onClick={() => onPageChange?.(currentPage - 1)}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {/* Simplified page numbers for now */}
        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
          const page = i + 1;
          return (
            <button 
              key={page} 
              onClick={() => onPageChange?.(page)}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                page === currentPage ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-400 hover:bg-slate-200"
              )}
            >
              {page}
            </button>
          );
        })}
        
        <button 
          className="p-2 text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-30"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
