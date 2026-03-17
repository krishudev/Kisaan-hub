import { motion } from 'framer-motion';
import { CloudRain, Sun, Cloud, Droplets, Wind, Umbrella, MapPin, Gauge } from 'lucide-react';
import type { SensorData } from '@/types/sensors';

interface WeatherSummaryProps {
  sensors: SensorData;
  delay?: number;
}

export function WeatherSummary({ sensors, delay = 0 }: WeatherSummaryProps) {
  const getWeatherCondition = () => {
    if (sensors.rain > 50) return { icon: <CloudRain className="w-10 h-10" />, label: 'Heavy Rain', color: 'text-blue-600', bg: 'bg-blue-500/10' };
    if (sensors.rain > 20) return { icon: <CloudRain className="w-10 h-10" />, label: 'Light Rain', color: 'text-blue-400', bg: 'bg-blue-400/10' };
    if (sensors.light < 300) return { icon: <Cloud className="w-10 h-10" />, label: 'Cloudy', color: 'text-slate-500', bg: 'bg-slate-500/10' };
    return { icon: <Sun className="w-10 h-10" />, label: 'Sunny', color: 'text-amber-500', bg: 'bg-amber-500/10' };
  };

  const getIrrigationAdvice = () => {
    if (sensors.rain > 30) return { text: 'No irrigation needed - Rain detected', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' };
    if (sensors.moisture < 30) return { text: 'Irrigation recommended - Low moisture', color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800' };
    if (sensors.moisture < 50) return { text: 'Monitor moisture levels closely', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' };
    return { text: 'Soil moisture is optimal right now', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800' };
  };

  const getRainProbability = () => {
    if (sensors.rain > 50) return 90;
    if (sensors.rain > 20) return 60;
    if (sensors.humidity > 80) return 40;
    if (sensors.humidity > 60) return 20;
    return 5;
  };

  const weather = getWeatherCondition();
  const advice = getIrrigationAdvice();
  const rainProb = getRainProbability();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-50">Local Weather</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Farm conditions</p>
          </div>
        </div>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 mb-6">
          <motion.div
            animate={{ rotate: weather.label === 'Sunny' ? [0, 4, -4, 0] : 0 }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className={`p-4 rounded-xl ${weather.bg} ${weather.color}`}
          >
            {weather.icon}
          </motion.div>
          <div>
            <div className={`text-3xl font-bold tracking-tight mb-1 ${weather.color}`}>{weather.label}</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Gauge className="w-3.5 h-3.5" />
                {sensors.temperature.toFixed(1)}°C <span className="text-slate-300 dark:text-slate-600">|</span> {sensors.humidity.toFixed(0)}% RH
            </div>
          </div>
      </div>

      {/* Rain Probability Progress */}
      <div className="mb-6 px-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
            <Umbrella className="w-4 h-4" />
            <span className="text-sm">Precipitation Chance</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-50">{rainProb}%</span>
        </div>
        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner flex border border-slate-200/50 dark:border-slate-700/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${rainProb}%` }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${
              rainProb > 70 ? 'from-blue-500 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
               : rainProb > 30 ? 'from-cyan-500 to-cyan-400' 
               : 'from-emerald-500 to-emerald-400'
            }`}
          />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1.5 opacity-80" />
          <div className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-none mb-1">{sensors.rain.toFixed(0)}%</div>
          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Rain</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Wind className="w-5 h-5 text-slate-500 dark:text-slate-400 mx-auto mb-1.5 opacity-80" />
          <div className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-none mb-1">{(sensors.humidity / 10).toFixed(1)}</div>
          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Wind (m/s)</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Sun className="w-5 h-5 text-amber-500 mx-auto mb-1.5 opacity-80" />
          <div className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-none mb-1">{sensors.light.toFixed(0)}</div>
          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Lux</div>
        </div>
      </div>

      {/* Smart Analysis Alert */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={`p-4 rounded-xl border ${advice.bg} ${advice.border}`}
      >
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${advice.color.replace('text', 'bg')}`} />
          <div className="flex-1">
             <div className={`text-xs font-bold uppercase tracking-wider mb-1 opacity-80 ${advice.color}`}>System Advice</div>
             <div className={`text-sm font-medium leading-tight ${advice.color}`}>
                {advice.text}
             </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
