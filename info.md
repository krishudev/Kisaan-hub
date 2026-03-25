# 🌿 Kisaan Hub — Smart Farm Dashboard
### Project Report & Architecture Documentation
> **Generated:** March 18, 2026 | **Version:** 1.0.0 | **Status:** ✅ Live on Vercel

---

## 📋 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Architecture](#3-project-architecture)
4. [File Structure](#4-file-structure)
5. [Features Implemented](#5-features-implemented)
6. [Component Breakdown](#6-component-breakdown)
7. [Authentication System](#7-authentication-system)
8. [Theme System (Dark Mode)](#8-theme-system-dark-mode)
9. [ESP32 Integration](#9-esp32-integration)
10. [Deployment](#10-deployment)
11. [Login Credentials](#11-login-credentials)
12. [Future Roadmap](#12-future-roadmap)

---

## 1. Project Overview

**Kisaan Hub** is a real-time IoT Smart Agriculture Dashboard designed for ESP32-based sensor nodes. It allows farmers to monitor environmental conditions, control irrigation, and view farm analytics from any device, anywhere in the world.

| Property | Details |
|---|---|
| **Project Name** | Kisaan Hub — Smart Farm Dashboard |
| **Institution** | KR Mangalam University, Sohna, Haryana |
| **Device** | ESP32-WROOM-32 |
| **Framework** | React + Vite + TypeScript |
| **Styling** | Tailwind CSS + Framer Motion |
| **Hosted At** | Vercel (Global CDN) |
| **Live URL** | `https://app-hcrxrlzgx-krishudevs-projects.vercel.app` |

---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI component library |
| **TypeScript** | 5.9 | Type safety |
| **Vite** | 7.x | Build tool & dev server |
| **Tailwind CSS** | 3.4 | Utility-first CSS framework |
| **Framer Motion** | 12.x | Animations & transitions |
| **React Router DOM** | 7.x | Client-side routing |
| **Recharts** | 2.x | Sensor data charts & graphs |
| **React Leaflet** | 5.x | Interactive GPS map |
| **Leaflet.js** | 1.9 | Map engine |
| **Lucide React** | 0.56 | Icon library |
| **Radix UI** | various | Accessible UI primitives |

### Backend / Cloud
| Technology | Purpose |
|---|---|
| **Firebase Auth** | (configured, not yet activated) |
| **Firebase RTDB** | (configured, not yet activated) |
| **Local Auth** | Hardcoded credentials (current mode) |

### Hardware
| Component | Specification |
|---|---|
| **Microcontroller** | ESP32-WROOM-32 |
| **Temperature/Humidity** | DHT11 Sensor |
| **Soil Moisture** | Capacitive Sensor |
| **Light** | LDR (Light Dependent Resistor) |
| **Rain** | Rain Drop Sensor |
| **Pump** | Relay-controlled Water Pump |

---

## 3. Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                        │
│                                                          │
│  ┌─────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │  Login  │───▶│  Dashboard   │◀──▶│  Field Map   │    │
│  │  Page   │    │  (Overview)  │    │  (GPS Live)  │    │
│  └─────────┘    └──────────────┘    └──────────────┘    │
│       │                │                                 │
│  AuthContext      ThemeContext                           │
│  (login/logout)   (dark/light)                          │
└─────────────────────────────────────────────────────────┘
          │                    │
          ▼                    ▼
┌──────────────────┐  ┌────────────────────┐
│  Local Auth      │  │  Vercel CDN        │
│  (admin@farm.com)│  │  (Global Hosting)  │
└──────────────────┘  └────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   ESP32 Node (Local)  │
                    │   IP: 192.168.4.1     │
                    │   Sensor API: /api    │
                    └───────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
          DHT11          Soil Sensor      Rain + LDR
       (Temp/Humidity)   (Moisture)      (Light/Rain)
```

---

## 4. File Structure

```
app/
├── public/
├── src/
│   ├── App.tsx                    # Root app with routing
│   ├── App.css                    # Global styles
│   ├── index.css                  # Tailwind + CSS variables
│   ├── main.tsx                   # React entry point
│   │
│   ├── components/
│   │   ├── Header.tsx             # Navbar (notifications, dark mode, logout)
│   │   ├── Login.tsx              # Login page component
│   │   └── sensors/
│   │       ├── SensorCard.tsx     # Individual sensor metric card
│   │       ├── CircularGauge.tsx  # SVG circular gauge widget
│   │       ├── SensorCharts.tsx   # Historical line/area charts
│   │       ├── PumpControl.tsx    # Water pump toggle control
│   │       ├── ConnectionStatus.tsx # ESP32 connection info
│   │       ├── WeatherSummary.tsx # Local weather & farm advice
│   │       └── FarmMap.tsx        # Live GPS map (Leaflet)
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Authentication state manager
│   │   └── ThemeContext.tsx       # Dark/light mode state manager
│   │
│   ├── hooks/
│   │   ├── useSensorData.ts       # ESP32 data fetching hook
│   │   └── use-mobile.ts          # Responsive breakpoint hook
│   │
│   ├── config/
│   │   └── firebase.ts            # Firebase config (placeholder)
│   │
│   ├── types/
│   │   └── sensors.ts             # TypeScript type definitions
│   │
│   └── lib/
│       └── utils.ts               # Utility functions
│
├── .gitignore
├── info.md                        # This document
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 5. Features Implemented

### ✅ Authentication
- Login page with email/password form
- Hardcoded demo credentials (local mode)
- Protected routes — unauthenticated users redirect to `/login`
- Session persistence with `localStorage`
- Logout button in navbar

### ✅ Dashboard Overview Tab
- 5 Sensor Cards (Temperature, Humidity, Soil Moisture, Light, Rain)
- Circular SVG gauge on each card
- Live ping indicator per card
- Status badge (Optimal / Low / High)
- Trend indicator (Up / Down / Stable)

### ✅ Water Pump Control
- Start/Stop toggle button
- Running duration timer
- Auto-stop warning after 5 minutes
- Visual flow animation when active
- Last activated timestamp

### ✅ Weather Summary
- Auto weather condition detection (Sunny / Cloudy / Light Rain / Heavy Rain)
- Precipitation probability progress bar
- Quick stats grid (Rain %, Wind estimate, Light lux)
- Smart irrigation advice based on sensor readings

### ✅ Connection Status
- ESP32 device connection indicator
- Signal strength percentage + animated bars visualizer
- Last update timestamp
- Wi-Fi hotspot details display

### ✅ Analytics Tab
- Multi-metric line chart (Temperature, Humidity, Moisture)
- Individual area charts (Temperature, Moisture, Light)
- Tab switcher (All / Temperature / Moisture / Light)
- Custom tooltip on hover
- Live updates badge

### ✅ Field Map Tab
- OpenStreetMap via React Leaflet
- KR Mangalam University pin (ESP32 base location)
- **Live GPS Tracking** — browser geolocation API
- Blue marker for user's real-time location
- Smooth flyTo animation when location updates
- Error handling for denied permissions

### ✅ Dark Mode
- Sun/Moon toggle button in navbar with spin animation
- System preference auto-detection on first load
- localStorage persistence across visits
- Global smooth 0.3s CSS transition on all elements
- Full dark palette with CSS custom properties

### ✅ Notification Panel
- Bell icon with animated unread count badge
- 5 dummy farm notifications (alert, warning, success, info)
- Color-coded icons per notification type
- "Mark all as read" functionality
- Dismiss individual notifications with X button
- "All caught up!" empty state
- Click-outside to close

### ✅ Hover Effects (Sensor Cards)
- Card levitates on hover (translateY -8px)
- Dynamic radial gradient background matching sensor color
- Colored inner border glow
- Icon scales up and rotates 12 degrees
- Circular gauge brightens and scales up
- whileTap mobile squeeze animation

### ✅ Responsive Design
- Mobile-friendly layout
- Vite `--host` flag for local network access
- Touch-friendly tap animations
- Responsive grid (1 to 2 to 3 to 5 columns)

### ✅ Deployment
- Production build via `npm run build`
- Hosted on **Vercel** global CDN
- Accessible worldwide, no Wi-Fi dependency

---

## 6. Component Breakdown

### `Header.tsx`
The sticky top navigation bar.
- **Logo** — Kisaan Hub branding with animated Sprout icon
- **Live Indicator** — Green pulsing "Live System" badge
- **Notification Bell** — Dropdown panel with 5 farm alerts
- **Dark Mode Toggle** — Animated Sun/Moon icon switcher
- **Logout Button** — Red exit icon

### `SensorCard.tsx`
Reusable card for displaying each sensor metric.
- Props: `title`, `value`, `unit`, `min`, `max`, `icon`, `color`, `trend`, `description`, `delay`
- Contains: `CircularGauge`, status badge, trend icon, live ping dot
- Hover: full glassmorphism lift effect

### `CircularGauge.tsx`
SVG-based circular progress indicator.
- Animated stroke-dashoffset transition
- Colored based on sensor `color` prop
- Displays current value and unit in center

### `FarmMap.tsx`
Interactive GPS map using React Leaflet + OpenStreetMap.
- Default center: KR Mangalam University `[28.271974, 77.06784]`
- Uses `navigator.geolocation.watchPosition()` for live tracking
- `RecenterAutomatically` hook flies map to user location
- Two markers: Red (ESP32 base) + Blue (You are here)

### `SensorCharts.tsx`
Historical sensor data visualization using Recharts.
- `LineChart` for multi-sensor overview
- `AreaChart` for individual sensor detail views
- Custom `Tooltip` component
- 4 tab views: All, Temperature, Moisture, Light

### `PumpControl.tsx`
Water pump relay toggle widget.
- Large round START/STOP button
- Running timer (auto-formatted MM:SS)
- Warning alert after 5 minutes of continuous running
- Water flow animation overlay when active

### `WeatherSummary.tsx`
Derived weather info from sensor readings.
- Determines weather icon from rain + light values
- Computes rain probability percentage
- Gives smart auto-irrigation advisory

### `ConnectionStatus.tsx`
ESP32 network connection status display.
- Shows device name, signal strength
- Animated signal bars visualizer
- Last ping timestamp
- Hotspot connection details

---

## 7. Authentication System

```
User visits / → ProtectedRoute checks AuthContext
       │
       ├── User logged in? ──YES──▶ Dashboard renders
       │
       └── Not logged in? ──NO───▶ Redirect to /login
                                         │
                                   Login.tsx form
                                         │
                              Enter email + password
                                         │
                              AuthContext.login() called
                                         │
                         Credentials match? ──YES──▶ setUser()
                                                         │
                                              localStorage saved
                                                         │
                                              navigate('/') → Dashboard
```

**Current Mode:** Local hardcoded authentication
- Email: `admin@farm.com`
- Password: `admin123`

**Future Mode:** Firebase Authentication (config file exists at `src/config/firebase.ts`)

---

## 8. Theme System (Dark Mode)

```
ThemeContext.tsx
│
├── Reads localStorage ('kisaan-theme') on mount
├── Falls back to system prefers-color-scheme
├── Toggles 'dark' class on <html> element
└── Saves preference to localStorage on change

index.css
│
├── :root { } ──→ Light mode CSS variables
└── .dark { }  ──→ Dark mode CSS variables (overrides)

All components
└── Use Tailwind dark: prefix classes
    e.g., bg-white dark:bg-slate-900
```

---

## 9. ESP32 Integration

The `useSensorData.ts` hook polls the ESP32 every 2 seconds:

```
http://192.168.4.1/api/sensors
```

**Expected JSON Response from ESP32:**
```json
{
  "temperature": 28.5,
  "humidity": 65.2,
  "moisture": 42.0,
  "light": 850.0,
  "rain": 5.0,
  "pump": false
}
```

**ESP32 Arduino Setup:**
- Mode: Access Point (AP) — creates its own Wi-Fi hotspot
- SSID: `ESP32_AP` | Password: `12345678`
- Connect your computer/phone to `ESP32_AP` then open dashboard
- Pump toggle sends `POST /api/pump` with `{"state": true/false}`

> **Note:** To use the dashboard remotely via Vercel, the ESP32 code needs to be updated to push data to Firebase Realtime Database instead of serving it locally.

---

## 10. Deployment

### Local Development
```powershell
# Install dependencies
npm install

# Start dev server (accessible on local network)
npm run dev

# Access on same Wi-Fi device:
# http://10.18.11.29:5173
```

### Production Deployment (Vercel)
```powershell
# Build for production
npm run build

# Deploy to Vercel
vercel --prod --yes
```

**Live URL:** `https://app-hcrxrlzgx-krishudevs-projects.vercel.app`

| Feature | Local | Vercel |
|---|---|---|
| Same Wi-Fi required | Yes | No |
| Works 24/7 | No | Yes |
| Share with anyone | No | Yes |
| Laptop must be ON | Yes | No |
| HTTPS Secure | No | Yes |

---

## 11. Login Credentials

| Field | Value |
|---|---|
| **Email** | `admin@farm.com` |
| **Password** | `admin123` |
| **Mode** | Local (hardcoded) |

> To enable multi-user login, Firebase Authentication needs to be configured with real API keys in `src/config/firebase.ts`.

---

## 12. Future Roadmap

| Priority | Feature | Status |
|---|---|---|
| High | Connect ESP32 to Firebase for real-time cloud data | Pending |
| High | Enable Firebase Auth for multi-user login | Pending |
| Medium | Custom domain for Vercel deployment | Pending |
| Medium | Push notifications for critical sensor alerts | Pending |
| Medium | Automated irrigation rules (if moisture < X, start pump) | Pending |
| Low | Historical data storage in Firebase database | Pending |
| Low | Multi-farm / multi-device support | Pending |
| Low | Export sensor data as CSV/PDF report | Pending |
| Low | Mobile app (React Native) | Pending |

---

*Documentation generated for Kisaan Hub v1.0 — KR Mangalam University Smart Agriculture Project*
