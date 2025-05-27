const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb+srv://mansigupta3013:g3odVgGgGdhRjari@cluster0.xvmrcqd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err.message));

// Schema for storing weather data
const sensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  airQuality: Number,
  weatherCondition: String,
  timestamp: { type: Date, default: Date.now },
  feelsLikeTemperature: Number,
  dewPoint: Number,
  heatIndex: Number,
  windChill: Number,
  uvIndex: Number,
  precipitation: {
    type: {
      probability: {
        percent: Number,
        type: String
      },
      type: String,
      snowQpf: {
        quantity: Number,
        unit: String
      },
      qpf: {
        quantity: Number,
        unit: String
      }
    }
  },
  thunderstormProbability: Number,
  airPressure: Number,
  wind: {
    direction: String,
    speed: Number,
    gust: Number
  },
  visibility: Number,
  cloudCover: Number,
  currentConditionsHistory: {
    temperatureChange: Number,
    maxTemperature: Number,
    minTemperature: Number
  }
});

const Sensor = mongoose.model("Sensor", sensorSchema);

// In-memory cache for quick frontend access
let sensorData = {
  temperature: 0,
  humidity: 0,
  airQuality: 0,
  weatherCondition: "",
  timestamp: new Date(),
  feelsLikeTemperature: 0,
  dewPoint: 0,
  heatIndex: 0,
  windChill: 0,
  uvIndex: 0,
  precipitation: {
    probability: {
      percent: 0,
      type: ""
    },
    type: "",
    snowQpf: {
      quantity: 0,
      unit: "MILLIMETERS"
    },
    qpf: {
      quantity: 0,
      unit: "MILLIMETERS"
    }
  },
  thunderstormProbability: 0,
  airPressure: 0,
  wind: {
    direction: "",
    speed: 0,
    gust: 0
  },
  visibility: 0,
  cloudCover: 0,
  currentConditionsHistory: {
    temperatureChange: 0,
    maxTemperature: 0,
    minTemperature: 0
  }
};

// Google API Key and Location
const googleWeatherApiKey = "AIzaSyCYf9ARVXY71-rgiqL-sYOvtNwzm6nkHFM";
const LOCATION = {
  latitude: 30.33000000,
  longitude: 78.00000000
};

// Fetch function using Google Weather API
const fetchWeatherData = async () => {
  try {
    const url = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${googleWeatherApiKey}&location.latitude=${LOCATION.latitude}&location.longitude=${LOCATION.longitude}`;

    const response = await axios.get(url);
    const data = response.data;

    // Update sensorData
    sensorData.temperature = data?.temperature?.degrees || 0;
    sensorData.humidity = data?.relativeHumidity || 0;
    sensorData.airQuality = data?.airAndPollen?.airQuality?.index || 0; // Adjust if API structure differs
    sensorData.weatherCondition = data?.weatherCondition?.description?.text || "";
    sensorData.timestamp = new Date();
    sensorData.feelsLikeTemperature = data?.feelsLikeTemperature?.degrees || 0;
    sensorData.dewPoint = data?.dewPoint?.degrees || 0;
    sensorData.heatIndex = data?.heatIndex?.degrees || 0;
    sensorData.windChill = data?.windChill?.degrees || 0;
    sensorData.uvIndex = data?.uvIndex || 0;

    sensorData.precipitation = {
      probability: {
        percent: data?.precipitation?.probability?.percent || 0,
        type: data?.precipitation?.probability?.type || ""
      },
      type: data?.precipitation?.type || "",
      snowQpf: {
        quantity: data?.precipitation?.snowQpf?.quantity || 0,
        unit: data?.precipitation?.snowQpf?.unit || "MILLIMETERS"
      },
      qpf: {
        quantity: data?.precipitation?.qpf?.quantity || 0,
        unit: data?.precipitation?.qpf?.unit || "MILLIMETERS"
      }
    };

    sensorData.thunderstormProbability = data?.thunderstormProbability || 0;
    sensorData.airPressure = data?.airPressure?.meanSeaLevelMillibars || 0;

    sensorData.wind = {
      direction: data?.wind?.direction?.cardinal || "",
      speed: data?.wind?.speed?.value || 0,
      gust: data?.wind?.gust?.value || 0
    };

    sensorData.visibility = data?.visibility?.distance || 0;
    sensorData.cloudCover = data?.cloudCover || 0;

    sensorData.currentConditionsHistory = {
      temperatureChange: data?.currentConditionsHistory?.temperatureChange?.degrees || 0,
      maxTemperature: data?.currentConditionsHistory?.maxTemperature?.degrees || 0,
      minTemperature: data?.currentConditionsHistory?.minTemperature?.degrees || 0
    };

    // Save to MongoDB
    const entry = new Sensor(sensorData);
    await entry.save();

    console.log("✅ Fetched & stored weather data:", sensorData);
  } catch (error) {
    console.error("❌ Failed to fetch weather data:", error.message);
  }
};

// Fetch every 5 minutes
setInterval(fetchWeatherData, 5 * 60 * 1000);
fetchWeatherData(); // Initial fetch on start

// API endpoint: Current data
app.get("/api/env", (req, res) => {
  res.json(sensorData);
});

// API endpoint: Last 50 records
app.get("/api/env/history", async (req, res) => {
  try {
    const history = await Sensor.find().sort({ timestamp: -1 }).limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
