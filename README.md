🌍 Real-Time Environmental Monitoring System
This project is a React.js web application that displays live environmental data such as temperature, humidity, air pressure, and air quality, pulled from a backend API. It includes visualizations, alerts, and a 7-day forecast — making it a compact dashboard for environmental monitoring.

🚀 Features
✅ Real-time data fetching every 5 minutes
✅ Live environmental metrics with animated counters
✅ Alerts for high temperature, low humidity, and poor air quality
✅ Beautiful slider display of key metrics
✅ 7-day weather forecast table
✅ Responsive charts using Recharts (line and bar charts)
✅ Fully responsive, mobile-friendly UI with Tailwind CSS and slick carousel

🏗️ Project Architecture


```
Project Architecture
├── React Frontend App
│   ├── Displays live metrics
│   ├── Shows charts & forecast
│   └── Generates alerts
├── Backend API Server (Node.js / Express / Flask)
│   ├── Provides /api/env data
│   └── Connects to IoT sensors
└── IoT Sensor Devices (ESP32, DHT11, BMP280, MQ135)
    ├── Collect real-time data
    └── Send to backend via Wi-Fi
```


🛠️ Tech Stack
Frontend: React.js, Tailwind CSS, Recharts, slick-carousel, CountUp.js

Backend (assumed): Node.js/Express or Flask API

IoT Devices: ESP32 microcontroller, environmental sensors (DHT11, BMP280, MQ135)

Data Format: REST API (JSON responses)
