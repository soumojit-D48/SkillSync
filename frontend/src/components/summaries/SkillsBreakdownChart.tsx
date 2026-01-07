
'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';
import {
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend);

interface Skill {
  skill_name: string;
  time_spent: number;
  percentage: number;
}

interface SkillsBreakdownChartProps {
  skillsBreakdown: Skill[];
  title?: string;
}

export function SkillsBreakdownChart({
  skillsBreakdown,
  title = 'Time by Skill',
}: SkillsBreakdownChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !skillsBreakdown.length) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const isDark =
      document.documentElement.classList.contains('dark') ||
      document.body.classList.contains('dark');

    ChartJS.defaults.color = isDark ? '#e5e7eb' : '#111827';
    ChartJS.defaults.borderColor = isDark ? '#374151' : '#e5e7eb';

    const colors = [
      '#6366f1',
      '#3b82f6',
      '#22c55e',
      '#eab308',
      '#a855f7',
      '#ec4899',
      '#f97316',
    ];

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        labels: skillsBreakdown.map((s) => s.skill_name),
        datasets: [
          {
            data: skillsBreakdown.map((s) =>
              Number((s.time_spent / 60).toFixed(2))
            ),
            backgroundColor: colors.slice(0, skillsBreakdown.length),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              boxWidth: 14,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            backgroundColor: isDark
              ? 'rgba(17, 24, 39, 0.95)'
              : 'rgba(0, 0, 0, 0.85)',
            titleColor: '#f9fafb',
            bodyColor: '#e5e7eb',
            padding: 12,
            callbacks: {
              label: (ctx) => {
                const skill = skillsBreakdown[ctx.dataIndex];
                return [
                  `Time: ${ctx.parsed} hours`,
                  `Usage: ${skill.percentage.toFixed(1)}%`,
                ];
              },
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [skillsBreakdown]);

  if (!skillsBreakdown.length) {
    return (
      <div className="p-6 rounded-xl bg-card border border-border">
        <p className="text-muted-foreground text-center py-10">
          No skills data available
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-xl bg-card border border-border overflow-visible"
    >
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <div className="h-[360px]">
        <canvas ref={canvasRef} />
      </div>
    </motion.div>
  );
}
