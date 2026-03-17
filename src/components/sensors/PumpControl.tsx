import { motion, AnimatePresence } from 'framer-motion';
import { Power, Droplets, Clock, AlertCircle } from 'lucide-react';
import type { PumpStatus } from '@/types/sensors';
import { Button } from '@/components/ui/button';

interface PumpControlProps {
  pump: PumpStatus;
  onToggle: () => void;
  delay?: number;
}

export function PumpControl({ pump, onToggle, delay = 0 }: PumpControlProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -4 }}
      className={`bg-white dark:bg-slate-900 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-md border shadow-sm ${
        pump.isOn 
          ? 'border-blue-200 dark:border-blue-800' 
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Animated background when pump is on */}
      <AnimatePresence>
        {pump.isOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10" />
            
            {/* Very subtle flow effect */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl transition-all duration-500 ${
                pump.isOn
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-50">Water Pump</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Relay Control</p>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center w-fit gap-2 transition-colors duration-300 ${
              pump.isOn 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' 
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            <motion.div
              animate={{ scale: pump.isOn ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 1, repeat: pump.isOn ? Infinity : 0 }}
              className={`w-2 h-2 rounded-full ${pump.isOn ? 'bg-blue-500' : 'bg-slate-400'}`}
            />
            {pump.isOn ? 'RUNNING' : 'STANDBY'}
          </div>
        </div>

        {/* Main Control */}
        <div className="flex flex-col items-center py-4 mb-4">
          <Button
            onClick={onToggle}
            variant="ghost"
            className={`group relative w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 border hover:shadow-md ${
              pump.isOn
                ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 dark:hover:bg-rose-500/20'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-800'
            }`}
          >
            <Power
              className="w-10 h-10 mb-2 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-bold tracking-wider">
               {pump.isOn ? 'STOP' : 'START'}
            </span>
            
            {/* Ping effect when off to draw attention */}
            {!pump.isOn && (
              <span className="absolute inset-0 rounded-full border-2 border-slate-400/20 dark:border-slate-600/20 scale-110 opacity-0 group-hover:animate-ping" />
            )}
          </Button>

          <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            {pump.isOn ? 'Tap to stop irrigation' : 'Tap to start irrigation'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800/50 flex flex-col items-center justify-center text-center text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 text-sm mb-1 opacity-80">
              <Clock className="w-4 h-4" />
              Duration
            </div>
            <div className="text-xl font-bold font-mono tracking-tight">
              {formatDuration(pump.duration)}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800/50 flex flex-col items-center justify-center text-center text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 text-sm mb-1 opacity-80">
              <AlertCircle className="w-4 h-4" />
              Auto Stop
            </div>
            <div className="text-xl font-bold">
              10 min
            </div>
          </div>
        </div>
        
        {/* Last Used Info */}
        <div className="mt-4 text-center text-xs text-slate-400">
          Last used: {pump.lastActivated
              ? pump.lastActivated.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Never'}
        </div>

        {/* Safety Warning */}
        <AnimatePresence>
          {pump.isOn && pump.duration > 300 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3 overflow-hidden"
            >
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Pump has been running for {Math.floor(pump.duration / 60)} minutes
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
