
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SummaryFiltersProps {
  filters: {
    year?: number;
    month?: number;
  };
  onChange: (filters: { year?: number; month?: number }) => void;
}

export default function SummaryFilters({ filters, onChange }: SummaryFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const hasActiveFilters = filters.year || filters.month;

  const clearFilters = () => {
    onChange({});
  };

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-blue-50 border-blue-200' : ''}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
              {(filters.year ? 1 : 0) + (filters.month ? 1 : 0)}
            </span>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-600"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Year
              </label>
              <div className="grid grid-cols-3 gap-2">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => onChange({ ...filters, year: filters.year === year ? undefined : year })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.year === year
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Month Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Month
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {months.map((month) => (
                  <button
                    key={month.value}
                    onClick={() => onChange({ ...filters, month: filters.month === month.value ? undefined : month.value })}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      filters.month === month.value
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {month.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
