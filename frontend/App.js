import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer
} from "recharts";
import CountUp from "react-countup";
import './App.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function App() {
  const [data, setData] = useState({});
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/env");
        const newData = res.data;

        setData(newData);
        setHistory(prev => [
          ...prev.slice(-19),
          {
            time: new Date().toLocaleTimeString(),
            temperature: newData.temperature,
            humidity: newData.humidity,
            airPressure: newData.airPressure
          }
        ]);

        // Check alerts
        const newAlerts = [];
        if (newData.temperature > 35) newAlerts.push("🔥 High Temperature Alert!");
        if (newData.humidity < 20) newAlerts.push("💧 Low Humidity Alert!");
        if (newData.airQuality > 100) newAlerts.push("🌫️ Poor Air Quality Alert!");
        setAlerts(newAlerts);

      } catch (err) {
        console.error("Failed to fetch current data:", err.message);
      }
    };
    fetchCurrent();
    const interval = setInterval(fetchCurrent, 300000);
    return () => clearInterval(interval);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  const metrics = [
    { label: "🌡️ Temperature", value: data.temperature, unit: "°C" },
    { label: "🌡️ Feels Like", value: data.feelsLikeTemperature, unit: "°C" },
    { label: "💧 Dew Point", value: data.dewPoint, unit: "°C" },
    { label: "🔥 Heat Index", value: data.heatIndex, unit: "°C" },
    { label: "💦 Humidity", value: data.humidity, unit: "%" },
    { label: "🌬️ Air Pressure", value: data.airPressure, unit: "hPa" },
    { label: "👀 Visibility", value: data.visibility, unit: "km" },
    { label: "☁️ Cloud Cover", value: data.cloudCover, unit: "%" },
    { label: "📈 Max Temp (Today)", value: data.currentConditionsHistory?.maxTemperature, unit: "°C" },
    { label: "📉 Min Temp (Today)", value: data.currentConditionsHistory?.minTemperature, unit: "°C" },
  ];

  // Mock 7-day forecast data
  const mockForecast = [
    { day: "Tuesday", icon: "⛈️", high: 35, low: 24, rain: 51 },
    { day: "Wednesday", icon: "🌩️", high: 33, low: 24, rain: 51 },
    { day: "Thursday", icon: "🌫️", high: 37, low: 24, rain: 4 },
    { day: "Friday", icon: "🌩️", high: 33, low: 24, rain: 51 },
    { day: "Saturday", icon: "🌤️", high: 37, low: 24, rain: 51 },
    { day: "Sunday", icon: "⛅", high: 35, low: 23, rain: 0 },
    { day: "Monday", icon: "🌥️", high: 34, low: 22, rain: 0 },
  ];

  return (
    <div 
      className="min-h-screen p-6 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('https://edgecast-img.yahoo.net/mysterio/api/4c5d5b6adec3e5e9f46ee4c60ff5941a63b5711867fff44ce79e866543e3f7f7/ymweather/resizefill_w2560_h1440;quality_80;format_webp/https://s3.us-east-2.amazonaws.com/weather-flickr-images/farm8/7336/9850084425_4e2b6f4cf2_k')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            🌍 Real-Time Environmental Monitoring
          </h1>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200 shadow-lg">
            {alerts.map((alert, idx) => (
              <p key={idx} className="font-semibold text-red-700 flex items-center gap-2">
                <span className="text-xl">⚠️</span> {alert}
              </p>
            ))}
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-blue-100 mb-8">
          <Slider {...settings}>
            {metrics.map((metric, index) => (
              <div key={index} className="p-3">
                <div className="rounded-2xl border shadow-lg p-6 text-center transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:border-blue-300">
                  <p className="text-lg font-semibold mb-2 text-gray-700">{metric.label}</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    <CountUp end={parseFloat(metric.value) || 0} duration={1.5} decimals={1} /> {metric.unit}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Forecast Table */}
        <div className="mt-10 p-6 rounded-3xl shadow-xl border border-blue-100 bg-white/80 backdrop-blur-sm max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span>🗓️</span> 7-Day Forecast
          </h2>
          <div className="overflow-x-auto">
            <table className="forecast-table min-w-full text-center border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <th className="py-3 px-4 text-gray-700 font-semibold border-2 border-gray-400">Day</th>
                  <th className="py-3 px-4 text-gray-700 font-semibold border-2 border-gray-400">Weather</th>
                  <th className="py-3 px-4 text-gray-700 font-semibold border-2 border-gray-400">High</th>
                  <th className="py-3 px-4 text-gray-700 font-semibold border-2 border-gray-400">Low</th>
                  <th className="py-3 px-4 text-gray-700 font-semibold border-2 border-gray-400">Rain</th>
                </tr>
              </thead>
              <tbody>
                {mockForecast.map((f, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-700 border-2 border-gray-400">{f.day}</td>
                    <td className="py-3 px-4 text-2xl border-2 border-gray-400">{f.icon}</td>
                    <td className="py-3 px-4 text-gray-700 border-2 border-gray-400">{f.high}°C</td>
                    <td className="py-3 px-4 text-gray-700 border-2 border-gray-400">{f.low}°C</td>
                    <td className="py-3 px-4 text-gray-700 border-2 border-gray-400">{f.rain}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {/* Temperature Line Chart */}
          <div className="p-6 rounded-3xl shadow-xl border border-blue-100 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <span>🌡️</span> Temperature Trend
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis unit="°C" stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  activeDot={{ r: 8, fill: '#f97316' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Humidity Bar Chart */}
          <div className="p-6 rounded-3xl shadow-xl border border-blue-100 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <span>💧</span> Humidity Levels
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis unit="%" stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }} 
                />
                <Legend />
                <Bar 
                  dataKey="humidity" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Air Pressure Line Chart */}
          <div className="p-6 rounded-3xl shadow-xl border border-blue-100 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <span>🌬️</span> Air Pressure Trend
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis unit="hPa" stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="airPressure" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  activeDot={{ r: 8, fill: '#10b981' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
