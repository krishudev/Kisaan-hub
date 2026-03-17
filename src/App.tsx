import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { SensorCard } from '@/components/sensors/SensorCard';
import { PumpControl } from '@/components/sensors/PumpControl';
import { ConnectionStatus } from '@/components/sensors/ConnectionStatus';
import { SensorCharts } from '@/components/sensors/SensorCharts';
import { WeatherSummary } from '@/components/sensors/WeatherSummary';
import { FarmMap } from '@/components/sensors/FarmMap';
import { Login } from '@/components/Login';
import { useSensorData } from '@/hooks/useSensorData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Thermometer,
  Droplets,
  Sun,
  CloudRain,
  Waves,
  LayoutDashboard,
  Activity,
  Map as MapIcon,
} from 'lucide-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function Dashboard() {
  const { sensors, pump, connection, history, togglePump } = useSensorData();

  const sensorCards = [
    {
      title: 'Temperature',
      value: sensors.temperature,
      unit: '°C',
      min: 0,
      max: 50,
      icon: <Thermometer className="w-5 h-5" />,
      color: '#f59e0b',
      description: 'DHT11 Sensor',
      trend: 'stable' as const,
    },
    {
      title: 'Humidity',
      value: sensors.humidity,
      unit: '%',
      min: 0,
      max: 100,
      icon: <Droplets className="w-5 h-5" />,
      color: '#0ea5e9',
      description: 'DHT11 Sensor',
      trend: 'up' as const,
    },
    {
      title: 'Soil Moisture',
      value: sensors.moisture,
      unit: '%',
      min: 0,
      max: 100,
      icon: <Waves className="w-5 h-5" />,
      color: '#22c55e',
      description: 'Capacitive Sensor',
      trend: 'down' as const,
    },
    {
      title: 'Light Intensity',
      value: sensors.light,
      unit: 'lux',
      min: 0,
      max: 1500,
      icon: <Sun className="w-5 h-5" />,
      color: '#eab308',
      description: 'LDR Sensor',
      trend: 'up' as const,
    },
    {
      title: 'Rain Level',
      value: sensors.rain,
      unit: '%',
      min: 0,
      max: 100,
      icon: <CloudRain className="w-5 h-5" />,
      color: '#6366f1',
      description: 'Rain Drop Sensor',
      trend: 'stable' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-1">
                Farmer Dashboard
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Monitor and manage your smart farm sensors in real-time.
              </p>
            </motion.div>
            <div className="text-sm font-medium px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">
              ID: ESP32-WROOM-32
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-slate-100/50 dark:bg-slate-800/50 p-1 flex w-full md:w-fit rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
              <TabsTrigger
                value="overview"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm px-6 py-2.5 flex items-center gap-2 font-medium"
              >
                <LayoutDashboard className="w-4 h-4" /> Overview
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm px-6 py-2.5 flex items-center gap-2 font-medium"
              >
                <Activity className="w-4 h-4" /> Analytics & History
              </TabsTrigger>
              <TabsTrigger
                value="map"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm px-6 py-2.5 flex items-center gap-2 font-medium"
              >
                <MapIcon className="w-4 h-4" /> Field Map
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 outline-none focus:ring-0">
              {/* Sensor Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {sensorCards.map((card, index) => (
                  <SensorCard
                    key={card.title}
                    {...card}
                    delay={0.05 * index}
                  />
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <PumpControl
                    pump={pump}
                    onToggle={togglePump}
                    delay={0.1}
                  />
                </div>

                <div className="lg:col-span-1">
                  <WeatherSummary
                    sensors={sensors}
                    delay={0.2}
                  />
                </div>

                <div className="lg:col-span-1">
                  <ConnectionStatus
                    connection={connection}
                    delay={0.3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="outline-none focus:ring-0">
              <div className="glass-card rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 mb-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Sensor Analytics</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Trend data over the last recorded period.</p>
                </div>
                <SensorCharts
                  history={history}
                  delay={0.1}
                />
              </div>
            </TabsContent>

            <TabsContent value="map" className="outline-none focus:ring-0">
              <div className="h-[600px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <FarmMap delay={0.1} />
              </div>
            </TabsContent>
          </Tabs>

        </div>
      </main>

      {/* Simplified Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950"></div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl flex flex-col items-center gap-4">
           <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
           <p className="text-slate-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
