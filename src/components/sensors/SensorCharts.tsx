import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp } from 'lucide-react';
import type { SensorHistory } from '@/types/sensors';

interface SensorChartsProps {
  history: SensorHistory;
  delay?: number;
}

export function SensorCharts({ history, delay = 0 }: SensorChartsProps) {
  const formatData = () => {
    return history.data.map((item, index) => ({
      time: item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      temperature: Math.round(item.temperature * 10) / 10,
      humidity: Math.round(item.humidity * 10) / 10,
      moisture: Math.round(item.moisture * 10) / 10,
      light: Math.round(item.light),
      index,
    }));
  };

  const data = formatData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs font-medium" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name === 'Temperature' && '°C'}
              {entry.name === 'Humidity' && '%'}
              {entry.name === 'Moisture' && '%'}
              {entry.name === 'Light' && ' lux'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -4 }}
      className="w-full bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 flex w-fit rounded-lg border border-slate-200 dark:border-slate-700">
              <TabsTrigger value="all" className="text-xs font-medium rounded-md px-4 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">All Metrics</TabsTrigger>
              <TabsTrigger value="temp" className="text-xs font-medium rounded-md px-4 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">Temperature</TabsTrigger>
              <TabsTrigger value="moisture" className="text-xs font-medium rounded-md px-4 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">Moisture</TabsTrigger>
              <TabsTrigger value="light" className="text-xs font-medium rounded-md px-4 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">Light</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 dark:bg-slate-800 dark:text-slate-400 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Updates
            </div>
        </div>

        <TabsContent value="all" className="h-[400px] outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10, fill: '#64748b' }}
                interval="preserveStartEnd"
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis 
                 tick={{ fontSize: 10, fill: '#64748b' }} 
                 axisLine={false} 
                 tickLine={false} 
                 dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                 wrapperStyle={{ fontSize: 11, paddingTop: '20px' }} 
                 iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={500}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={500}
              />
              <Line
                type="monotone"
                dataKey="moisture"
                name="Moisture"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="temp" className="h-[400px] outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={['auto', 'auto']} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#tempGradient)"
                strokeWidth={2}
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="moisture" className="h-[400px] outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="moisture"
                name="Moisture"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#moistureGradient)"
                strokeWidth={2}
                animationDuration={500}
              />
              <Area
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="#0ea5e9"
                fillOpacity={0}
                strokeWidth={2}
                strokeDasharray="5 5"
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="light" className="h-[400px] outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="lightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="light"
                name="Light"
                stroke="#eab308"
                fillOpacity={1}
                fill="url(#lightGradient)"
                strokeWidth={2}
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
