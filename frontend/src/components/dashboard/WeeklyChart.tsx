
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DailyData {
  date: string;
  total_time: number;
  log_count: number;
}

interface WeeklyChartProps {
  data: DailyData[];
  totalTime: number;
  isLoading?: boolean;
}

export function WeeklyChart({ data, totalTime, isLoading }: WeeklyChartProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatTime = (minutes: number) => {
    const hours = minutes / 60;
    return hours.toFixed(1);
  };

  const maxTime = Math.max(...data.map((d) => d.total_time), 1);

  // Chart.js data
  const chartData = {
    labels: data.map((d) => formatDate(d.date)),
    datasets: [
      {
        label: 'Hours',
        data: data.map((d) => d.total_time / 60),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            const index = context.dataIndex;
            return [
              `Time: ${context.parsed.y.toFixed(1)}h`,
              `Logs: ${data[index].log_count}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          callback: (value: any) => `${value}h`,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
        },
      },
    },
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-2 p-6 rounded-xl bg-card border border-border"
      >
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-muted rounded mb-2" />
          <div className="h-4 w-48 bg-muted rounded mb-6" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </motion.div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-2 p-6 rounded-xl bg-card border border-border"
      >
        <h2 className="text-lg font-semibold mb-6">This Week</h2>
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <TrendingUp className="h-12 w-12 mb-3 opacity-50" />
          <p>No data for this week yet</p>
          <Link href="/progress/log" className="mt-4">
            <Button variant="outline" size="sm">
              Log Your First Session
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="lg:col-span-2 p-6 rounded-xl bg-card border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-1">This Week</h2>
          <p className="text-sm text-muted-foreground">
            Total: {formatTime(totalTime)} hours
          </p>
        </div>
        <Link href="/progress/stats">
          <Button variant="ghost" size="sm">
            View Stats
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Chart.js Line Chart */}
      <div className="h-64">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Sessions</p>
          <p className="text-xl font-bold">
            {data.reduce((acc, d) => acc + d.log_count, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Avg/Day</p>
          <p className="text-xl font-bold">
            {formatTime(totalTime / data.length)}h
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Best Day</p>
          <p className="text-xl font-bold">
            {formatTime(maxTime)}h
          </p>
        </div>
      </div>
    </motion.div>
  );
}

