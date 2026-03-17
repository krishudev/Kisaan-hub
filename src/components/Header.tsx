import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, LogOut, Bell, Menu, Sun, Moon, Droplets, Thermometer, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface Notification {
  id: number;
  type: 'warning' | 'success' | 'info' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'alert',
    title: 'Low Soil Moisture',
    message: 'Soil moisture has dropped to 18%. Irrigation recommended.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    title: 'High Temperature Alert',
    message: 'Temperature reached 38°C. Check ventilation in the greenhouse.',
    time: '15 min ago',
    read: false,
  },
  {
    id: 3,
    type: 'success',
    title: 'Pump Cycle Completed',
    message: 'Scheduled irrigation finished successfully. Duration: 10 min.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 4,
    type: 'info',
    title: 'Rain Detected',
    message: 'Rain sensor is active. Auto-irrigation has been paused.',
    time: '3 hr ago',
    read: true,
  },
  {
    id: 5,
    type: 'info',
    title: 'ESP32 Reconnected',
    message: 'Device came back online after a brief disconnection.',
    time: 'Yesterday',
    read: true,
  },
];

const notificationStyles = {
  alert: {
    icon: <AlertTriangle className="w-4 h-4" />,
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    text: 'text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
  warning: {
    icon: <Thermometer className="w-4 h-4" />,
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  success: {
    icon: <Droplets className="w-4 h-4" />,
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  info: {
    icon: <Info className="w-4 h-4" />,
    bg: 'bg-sky-100 dark:bg-sky-900/30',
    text: 'text-sky-600 dark:text-sky-400',
    dot: 'bg-sky-500',
  },
};

export function Header() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between max-w-7xl mx-auto">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="p-2.5 bg-slate-900 dark:bg-emerald-500 rounded-xl transition-colors duration-300"
            >
              <Sprout className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Kisaan Hub</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Smart Farm Control</p>
            </div>
          </div>

          {/* Center - Live Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-800 transition-colors duration-300">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2.5 h-2.5 rounded-full bg-emerald-500"
            />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Live System</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">

            {/* Notification Bell with Dropdown */}
            <div className="relative" ref={notifRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotifOpen((v) => !v)}
                className="relative rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                id="notification-btn"
              >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full px-1 ring-2 ring-white dark:ring-slate-900"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              {/* Dropdown Panel */}
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-0 mt-3 w-[340px] sm:w-[380px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl dark:shadow-slate-950/50 overflow-hidden z-[200]"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-50">Notifications</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{unreadCount} unread alerts</p>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      <AnimatePresence initial={false}>
                        {notifications.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-600 gap-2">
                            <CheckCircle className="w-8 h-8" />
                            <p className="text-sm font-medium">All caught up!</p>
                          </div>
                        ) : (
                          notifications.map((notif) => {
                            const style = notificationStyles[notif.type];
                            return (
                              <motion.div
                                key={notif.id}
                                layout
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`relative flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group ${
                                  !notif.read ? 'bg-slate-50/80 dark:bg-slate-800/30' : ''
                                }`}
                              >
                                {/* Unread dot */}
                                {!notif.read && (
                                  <span className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                )}

                                {/* Icon */}
                                <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${style.bg} ${style.text}`}>
                                  {style.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-bold mb-0.5 ${!notif.read ? 'text-slate-900 dark:text-slate-50' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{notif.message}</p>
                                  <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1 font-medium">{notif.time}</p>
                                </div>

                                {/* Dismiss */}
                                <button
                                  onClick={() => dismissNotification(notif.id)}
                                  className="opacity-0 group-hover:opacity-100 shrink-0 mt-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </motion.div>
                            );
                          })
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2.5 text-center">
                      <button className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        View all notifications →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 relative overflow-hidden"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <Sun className="w-5 h-5 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

