'use client';

import { ChevronLeft, ChevronRight } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

interface ChatsPaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

const rowOptions = [25, 50, 100, 150];

export function ChatsPagination({
  currentPage,
  totalPages,
  rowsPerPage,
  totalItems,
  onPageChange,
  onRowsPerPageChange,
}: ChatsPaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <div {...devProps('ChatsPagination')} className="flex items-center justify-between px-4 py-3 border-t border-border-secondary bg-bg-tertiary">
      {/* Left side: Rows per page selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-fg-tertiary">Rows per page:</span>
        <div className="flex items-center gap-1">
          {rowOptions.map((option) => (
            <button
              key={option}
              onClick={() => onRowsPerPageChange(option)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-md
                transition-all duration-quick
                ${rowsPerPage === option
                  ? 'bg-brand-aperol text-white'
                  : 'bg-bg-secondary text-fg-tertiary hover:bg-bg-tertiary hover:text-fg-primary border border-border-secondary'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Center: Item count */}
      <div className="text-xs text-fg-tertiary">
        {totalItems === 0 ? (
          <span>No items</span>
        ) : (
          <span>
            {startItem}–{endItem} of {totalItems}
          </span>
        )}
      </div>

      {/* Right side: Previous and Next buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md
            transition-all duration-quick
            ${currentPage <= 1
              ? 'opacity-40 cursor-not-allowed text-fg-quaternary'
              : 'bg-bg-secondary text-fg-primary hover:bg-bg-tertiary border border-border-secondary'
            }
          `}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md
            transition-all duration-quick
            ${currentPage >= totalPages
              ? 'opacity-40 cursor-not-allowed text-fg-quaternary'
              : 'bg-bg-secondary text-fg-primary hover:bg-bg-tertiary border border-border-secondary'
            }
          `}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

