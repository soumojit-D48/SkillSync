
'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WeekSelectorProps {
  selectedWeek: string;
  onWeekChange: (weekStart: string) => void;
}

export default function WeekSelector({ selectedWeek, onWeekChange }: WeekSelectorProps) {
  const getWeekDates = (weekStart: string) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    return {
      start,
      end,
      label: `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    };
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedWeek);
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    
    const day = newDate.getDay();
    const diff = newDate.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(newDate.setDate(diff));
    
    onWeekChange(monday.toISOString().split('T')[0]);
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    
    onWeekChange(monday.toISOString().split('T')[0]);
  };

  const dates = getWeekDates(selectedWeek);
  const isCurrentWeek = selectedWeek === (() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    return monday.toISOString().split('T')[0];
  })();

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateWeek('prev')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex-1 flex items-center justify-center gap-3">
        <Calendar className="h-5 w-5 text-blue-500" />
        <span className="font-semibold text-gray-900">{dates.label}</span>
        {!isCurrentWeek && (
          <Button
            variant="ghost"
            size="sm"
            onClick={goToCurrentWeek}
            className="text-blue-600 hover:text-blue-700"
          >
            Today
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateWeek('next')}
        disabled={isCurrentWeek}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}