import { motion } from 'framer-motion';
import { CircularGauge } from './CircularGauge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
  delay?: number;
}

export function SensorCard({
  title,
  value,
  unit,
  min,
  max,
  icon,
  color,
  trend = 'stable',
  description,
  delay = 0,
}: SensorCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-rose-500" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusText = () => {
    const percentage = ((value - min) / (max - min)) * 100;
    if (percentage < 30) return 'Low';
    if (percentage > 80) return 'High';
    return 'Optimal';
  };

  const getStatusColor = () => {
    const percentage = ((value - min) / (max - min)) * 100;
    if (percentage < 30) return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10';
    if (percentage > 80) return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10';
    return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 relative overflow-hidden group border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Subtle top indicator line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-80"
        style={{ backgroundColor: color }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl transition-colors duration-300"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            {icon}
          </div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
          {getTrendIcon()}
        </div>
      </div>

      {/* Gauge */}
      <div className="flex justify-center my-6">
        <CircularGauge
          value={value}
          min={min}
          max={max}
          unit={unit}
          label={title}
          color={color}
          icon={icon}
          size={140}
          strokeWidth={12}
        />
      </div>

      {/* Status Footer */}
      <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{description}</div>
        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>

      {/* Live indicator (ping) */}
      <span className="absolute top-4 right-4 flex h-2 w-2">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ backgroundColor: color }}
        ></span>
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: color }}
        ></span>
      </span>
    </motion.div>
  );
}
