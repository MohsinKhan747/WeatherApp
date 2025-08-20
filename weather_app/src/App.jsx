import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]); // store previous searches
  const getWeather = async () => {
    if (!city) return;
    try {
      const apiKey = import.meta.env.VITE_API_KEY; // replace with your API key
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city.trim()
        )}&appid=${apiKey}&units=metric`
      );
      setWeather(res.data);

      // Add city to history if not already there
      const exists = history.find((h) => h.name === res.data.name);
      if (!exists) setHistory([res.data, ...history]);
    } catch (error) {
      console.error(error);
      alert("City not found");
    }
  };

  // Click on history card to show its weather again
  const handleHistoryClick = (data) => {
    setWeather(data);
    setCity(data.name);
  };

  return (
    <div className="app">
      <h1>Weather App</h1>

      <div className="main-content">
        {/* Search & Current Weather */}
        <div className="weather-section">
          <div className="search">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city..."
            />
            <button onClick={getWeather}>Search</button>
          </div>

          {weather && (
            <div className="weather-card">
              <h2>
                {weather.name}, {weather.sys.country}
              </h2>
              <p className="temp">{Math.round(weather.main.temp)}°C</p>
              <p className="desc">{weather.weather[0].description}</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          )}
        </div>

        {/* History Sidebar */}
        <div className="history">
          {history.map((h, index) => (
            <div
              key={index}
              className="history-card"
              onClick={() => handleHistoryClick(h)}
            >
              <p>
                {h.name}, {h.sys.country}
              </p>
              <p>{Math.round(h.main.temp)}°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
