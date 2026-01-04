
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGenerateSummaryMutation, getCurrentWeekStart } from '@/store/api/resourcesAndSummaries';

export default function GenerateSummaryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeekStart());
  const [forceRegenerate, setForceRegenerate] = useState(false);

  const [generateSummary, { isLoading, error }] = useGenerateSummaryMutation();

  const handleGenerate = async () => {
    try {
      await generateSummary({
        week_start: selectedWeek,
        force_regenerate: forceRegenerate,
      }).unwrap();
      
      setIsOpen(false);
      // Show success message
      alert('Summary generated successfully!');
    } catch (err) {
      console.error('Failed to generate summary:', err);
    }
  };

  // Get last 8 weeks for selection
  const getLastWeeks = () => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 0; i < 8; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (i * 7));
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(date.setDate(diff));
      const weekStart = monday.toISOString().split('T')[0];
      
      weeks.push({
        value: weekStart,
        label: `Week of ${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      });
    }
    
    return weeks;
  };

  const weeks = getLastWeeks();

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-2xl z-50"
      >
        <Sparkles className="h-5 w-5 mr-2" />
        Generate Summary
      </Button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-2xl bg-white shadow-2xl z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Generate Summary</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Week Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Select Week
                  </label>
                  <div className="space-y-2">
                    {weeks.map((week) => (
                      <button
                        key={week.value}
                        onClick={() => setSelectedWeek(week.value)}
                        className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all ${
                          selectedWeek === week.value
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5" />
                          {week.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Force Regenerate Option */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
                  <input
                    type="checkbox"
                    id="force-regenerate"
                    checked={forceRegenerate}
                    onChange={(e) => setForceRegenerate(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="force-regenerate" className="text-sm text-gray-700">
                    Force regenerate if summary already exists
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">
                      {error && 'data' in error ? String(error.data) : 'Failed to generate summary'}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}