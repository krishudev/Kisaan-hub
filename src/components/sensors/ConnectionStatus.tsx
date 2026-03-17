import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, SignalHigh, SignalLow, SignalMedium, Router } from 'lucide-react';
import type { ConnectionStatus as ConnectionStatusType } from '@/types/sensors';

interface ConnectionStatusProps {
  connection: ConnectionStatusType;
  delay?: number;
}

export function ConnectionStatus({ connection, delay = 0 }: ConnectionStatusProps) {
  const getSignalIcon = () => {
    if (!connection.isConnected) return <WifiOff className="w-5 h-5" />;
    if (connection.signalStrength >= 80) return <SignalHigh className="w-5 h-5" />;
    if (connection.signalStrength >= 50) return <SignalMedium className="w-5 h-5" />;
    return <SignalLow className="w-5 h-5" />;
  };

  const getSignalColor = () => {
    if (!connection.isConnected) return 'text-rose-500';
    if (connection.signalStrength >= 80) return 'text-emerald-500';
    if (connection.signalStrength >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getSignalBars = () => {
    const bars = 4;
    const activeBars = Math.ceil((connection.signalStrength / 100) * bars);
    
    return (
      <div className="flex items-end gap-1 h-6">
        {[...Array(bars)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: delay + i * 0.1 }}
            className={`w-1.5 rounded-t ${
              i < activeBars && connection.isConnected
                ? 'bg-emerald-500'
                : 'bg-slate-200 dark:bg-slate-700'
            }`}
            style={{ height: `${((i + 1) / bars) * 100}%` }}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-6 transition-all duration-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-xl transition-all duration-500 border ${
              connection.isConnected
                ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800'
                : 'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800'
            }`}
          >
            <Router
              className={`w-6 h-6 transition-colors duration-500 ${
                connection.isConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
              }`}
            />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-50">ESP32 Node</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{connection.deviceName}</p>
          </div>
        </div>

        {/* Connection Status Badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 border transition-colors duration-300 ${
            connection.isConnected
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
              : 'bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400'
          }`}
        >
          <motion.div
            animate={{
              scale: connection.isConnected ? [1, 1.2, 1] : 1,
              opacity: connection.isConnected ? [1, 0.5, 1] : 1,
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-2 h-2 rounded-full ${connection.isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}
          />
          {connection.isConnected ? 'CONNECTED' : 'OFFLINE'}
        </div>
      </div>

      {/* Details Container */}
      <div className="space-y-5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Signal Strength</span>
          <div className="flex items-center gap-2">
            <span className={`font-bold ${getSignalColor()}`}>
              {connection.isConnected ? `${Math.round(connection.signalStrength)}%` : 'N/A'}
            </span>
            <div className={`${getSignalColor()} opacity-80`}>
                {getSignalIcon()}
            </div>
          </div>
        </div>

        {/* Signal Bars Visualizer */}
        <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
           <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">Quality</span>
           {getSignalBars()}
        </div>

        {/* Last Ping */}
        <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
          <span className="text-slate-500 dark:text-slate-400">Last Update</span>
          <span className="text-slate-700 dark:text-slate-200 font-semibold font-mono tracking-tight text-xs">
            {connection.lastPing
              ? connection.lastPing.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              : '--:--:--'}
          </span>
        </div>
      </div>

      {/* Hotspot Info */}
      <AnimatePresence>
        {connection.isConnected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg overflow-hidden"
          >
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
              <Wifi className="w-4 h-4" />
              <span>Connected to ESP32_AP</span>
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-500 mt-1.5 ml-6 font-mono">
              IP: 192.168.4.1 | Port: 80
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
