
'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';
import * as Chart from 'chart.js/auto';

interface Skill {
  skill_name: string;
  time_spent: number;
  percentage: number;
}

interface SkillsBreakdownChartProps {
  skillsBreakdown: Skill[];
  title?: string;
}

export function SkillsBreakdownChart({ skillsBreakdown, title = 'Skills Distribution' }: SkillsBreakdownChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart.Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !skillsBreakdown?.length) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const colors = [
      'rgba(99, 102, 241, 0.8)',
      'rgba(59, 130, 246, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(234, 179, 8, 0.8)',
      'rgba(168, 85, 247, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(249, 115, 22, 0.8)',
    ];

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: skillsBreakdown.map(skill => skill.skill_name),
        datasets: [
          {
            data: skillsBreakdown.map(skill => parseFloat((skill.time_spent / 60).toFixed(2))),
            backgroundColor: colors.slice(0, skillsBreakdown.length),
            borderColor: colors.slice(0, skillsBreakdown.length).map(c => c.replace('0.8', '1')),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: { size: 12 },
              generateLabels: (chart) => {
                const data = chart.data;
                if (!data.labels || !data.datasets[0]) return [];
                const backgroundColors = data.datasets[0].backgroundColor as string[];
                return data.labels.map((label, i) => ({
                  text: `${label} (${data.datasets[0].data[i]}h)`,
                  fillStyle: backgroundColors[i] || 'rgba(0, 0, 0, 0.1)',
                  hidden: false,
                  index: i,
                }));
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            callbacks: {
              label: (context) => {
                const skill = skillsBreakdown[context.dataIndex];
                return [
                  `${context.label}`,
                  `Time: ${context.parsed} hours`,
                  `Percentage: ${skill.percentage.toFixed(1)}%`,
                ];
              },
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
  }, [skillsBreakdown]);

  if (!skillsBreakdown || skillsBreakdown.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-12 text-muted-foreground">
          No skills data available
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="p-6 rounded-xl bg-card border border-border"
    >
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="h-80">
        <canvas ref={canvasRef}></canvas>
      </div>
    </motion.div>
  );
}
