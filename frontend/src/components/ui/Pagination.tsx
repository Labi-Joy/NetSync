'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
  startIndex: number;
  endIndex: number;
}

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showItemsPerPage?: boolean;
  showTotalItems?: boolean;
  showPageSizes?: boolean;
  pageSizes?: number[];
  className?: string;
  compact?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
  showItemsPerPage = true,
  showTotalItems = true,
  showPageSizes = true,
  pageSizes = [10, 20, 50, 100],
  className = '',
  compact = false
}) => {
  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex
  } = pagination;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = compact ? 3 : 5; // Number of pages to show around current page
    const sidePages = Math.floor(showPages / 2);

    if (totalPages <= showPages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let start = Math.max(2, currentPage - sidePages);
      let end = Math.min(totalPages - 1, currentPage + sidePages);

      // Adjust range if too close to start or end
      if (currentPage <= sidePages + 1) {
        end = showPages;
      } else if (currentPage >= totalPages - sidePages) {
        start = totalPages - showPages + 1;
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push('ellipsis');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const buttonClass = `
    flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md
    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const activeButtonClass = `
    ${buttonClass} bg-blue-600 text-white hover:bg-blue-700
  `;

  const inactiveButtonClass = `
    ${buttonClass} text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800
    border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700
  `;

  const navButtonClass = `
    ${buttonClass} text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-800
    border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700
    hover:text-neutral-700 dark:hover:text-neutral-200
  `;

  if (totalPages <= 1 && !showTotalItems) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}>
      {/* Items info */}
      {showTotalItems && (
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          {totalItems > 0 ? (
            <>
              Showing <span className="font-medium">{startIndex}</span> to{' '}
              <span className="font-medium">{endIndex}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </>
          ) : (
            'No results found'
          )}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          {/* First page */}
          {!compact && currentPage > 2 && (
            <button
              onClick={() => onPageChange(1)}
              disabled={!hasPrevPage}
              className={navButtonClass}
              title="First page"
            >
              <ChevronDoubleLeftIcon className="w-4 h-4" />
            </button>
          )}

          {/* Previous page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className={navButtonClass}
            title="Previous page"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            {!compact && <span className="ml-1">Previous</span>}
          </button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {pageNumbers.map((page, index) => (
              <motion.div
                key={`${page}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
              >
                {page === 'ellipsis' ? (
                  <span className="flex items-center justify-center px-3 py-2">
                    <EllipsisHorizontalIcon className="w-4 h-4 text-neutral-400" />
                  </span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={page === currentPage ? activeButtonClass : inactiveButtonClass}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Next page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className={navButtonClass}
            title="Next page"
          >
            {!compact && <span className="mr-1">Next</span>}
            <ChevronRightIcon className="w-4 h-4" />
          </button>

          {/* Last page */}
          {!compact && currentPage < totalPages - 1 && (
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={!hasNextPage}
              className={navButtonClass}
              title="Last page"
            >
              <ChevronDoubleRightIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Items per page selector */}
      {showPageSizes && onLimitChange && (
        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage" className="text-sm text-neutral-600 dark:text-neutral-400">
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => onLimitChange(parseInt(e.target.value))}
            className="text-sm border border-neutral-300 dark:border-neutral-600 rounded-md px-2 py-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {pageSizes.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

// Compact pagination component for mobile or small spaces
export const CompactPagination: React.FC<Omit<PaginationProps, 'compact'>> = (props) => (
  <Pagination {...props} compact={true} showPageSizes={false} showTotalItems={false} />
);

// Simple pagination with just prev/next
export const SimplePagination: React.FC<{
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  className?: string;
}> = ({ pagination, onPageChange, className = '' }) => {
  const { currentPage, hasNextPage, hasPrevPage } = pagination;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className="flex items-center px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeftIcon className="w-4 h-4 mr-1" />
        Previous
      </button>

      <span className="text-sm text-neutral-600 dark:text-neutral-400">
        Page {currentPage}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="flex items-center px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRightIcon className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
};

export default Pagination;