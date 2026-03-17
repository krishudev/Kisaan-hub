import { motion } from 'framer-motion';

interface CircularGaugeProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  size?: number;
  strokeWidth?: number;
}

export function CircularGauge({
  value,
  min,
  max,
  unit,
  label,
  color,
  icon,
  size = 140,
  strokeWidth = 12,
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStatusColor = () => {
    if (percentage < 30) return '#ef4444';
    if (percentage < 60) return '#f59e0b';
    return color;
  };

  const statusColor = getStatusColor();

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={statusColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="gauge-circle"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-gray-400 mb-1"
          >
            {icon}
          </motion.div>
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-800"
          >
            {value.toFixed(1)}
          </motion.div>
          <div className="text-xs text-gray-500 font-medium">{unit}</div>
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-xl"
          style={{ backgroundColor: statusColor }}
        />
      </div>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-3 text-sm font-semibold text-gray-600"
      >
        {label}
      </motion.div>
    </div>
  );
}
