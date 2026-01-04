
'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import * as Chart from 'chart.js/auto';

interface DailyActivity {
  date: string;
  time_spent: number;
}

interface DailyActivityChartProps {
  dailyBreakdown: DailyActivity[];
  title?: string;
}

export function DailyActivityChart({ dailyBreakdown, title = 'Daily Activity' }: DailyActivityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart.Chart<'bar'> | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !dailyBreakdown?.length) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const getDayName = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const labels = dailyBreakdown.map(item => getDayName(item.date));
    const data = dailyBreakdown.map(item => parseFloat((item.time_spent / 60).toFixed(2))); // parseFloat imp

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart.Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Hours',
            data,
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: { size: 14 },
            bodyFont: { size: 13 },
            callbacks: {
              label: (context) => `${context.parsed.y} hours`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              callback: (value) => `${value}h`,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [dailyBreakdown]);

  if (!dailyBreakdown || dailyBreakdown.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-12 text-muted-foreground">
          No activity data available
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-xl bg-card border border-border"
    >
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="h-64">
        <canvas ref={canvasRef}></canvas>
      </div>
    </motion.div>
  );
}