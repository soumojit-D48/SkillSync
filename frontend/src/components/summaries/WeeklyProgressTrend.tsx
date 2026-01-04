
'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import * as Chart from 'chart.js/auto';

interface WeeklySummary {
  id: number;
  week_start: string;
  total_hours: number;
  skills_worked_on: number;
}

interface WeeklyProgressTrendProps {
  summaries: WeeklySummary[];
  title?: string;
}

export function WeeklyProgressTrend({ summaries, title = 'Progress Over Time' }: WeeklyProgressTrendProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart.Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !summaries?.length) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const sortedSummaries = [...summaries].sort((a, b) => 
      new Date(a.week_start).getTime() - new Date(b.week_start).getTime()
    );

    const labels = sortedSummaries.map(s => {
      const date = new Date(s.week_start);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const hours = sortedSummaries.map(s => parseFloat((s.total_hours / 60).toFixed(2)));
    const skills = sortedSummaries.map(s => s.skills_worked_on);

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Hours',
            data: hours,
            borderColor: 'rgba(99, 102, 241, 1)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            fill: true,
            yAxisID: 'y',
          },
          {
            label: 'Skills',
            data: skills,
            borderColor: 'rgba(34, 197, 94, 1)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: true,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              padding: 15,
              font: { size: 12 },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
          },
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Hours',
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Skills',
            },
            grid: {
              drawOnChartArea: false,
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
  }, [summaries]);

  if (!summaries || summaries.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-12 text-muted-foreground">
          Not enough data to show trend
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 rounded-xl bg-card border border-border col-span-full"
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="h-80">
        <canvas ref={canvasRef}></canvas>
      </div>
    </motion.div>
  );
}