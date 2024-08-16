"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface WeatherData {
  hour: string;
  temp: number;
  wind_speed: number;
  rh: number;
}

const Weather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("Kolkata");
  const [searchLocation, setSearchLocation] = useState<string>("Kolkata");
  const [highestTemp, setHighestTemp] = useState<number | null>(null);
  const [lowestTemp, setLowestTemp] = useState<number | null>(null);
  const [avgHumidity, setAvgHumidity] = useState<string | null>(null);
  const [avgWindSpeed, setAvgWindSpeed] = useState<string | null>(null);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const geocodeResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );
      const { lat, lon } = geocodeResponse.data[0];
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
      );
      const data = response.data;
      const maxHours = 24;
      const formattedDate: WeatherData[] = data.hourly.time
        .slice(0, maxHours)
        .map((time: string, index: number) => ({
          hour: new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temp: data.hourly.temperature_2m[index],
          wind_speed: data.hourly.wind_speed_10m[index],
          rh: data.hourly.relative_humidity_2m[index],
        }));

      setWeatherData(formattedDate);

      const temps = formattedDate.map((item) => item.temp);
      const windSpeed = formattedDate.map((item) => item.wind_speed);
      const humidity = formattedDate.map((item) => item.rh);
      setHighestTemp(Math.max(...temps));
      setLowestTemp(Math.min(...temps));
      setAvgWindSpeed(
        (windSpeed.reduce((a, b) => a + b, 0) / windSpeed.length).toFixed(2)
      );
      setAvgHumidity(
        (humidity.reduce((a, b) => a + b, 0) / humidity.length).toFixed(2)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLocation(searchLocation);
  };

  return (
    <div
      className="w-full"
      style={{
        backgroundImage: `url('https://miro.medium.com/v2/resize:fit:5120/1*GsImz-edoeuqCMfKxDus0w.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="overlay bg-black bg-opacity-60 min-h-screen p-5 max-w-5xl mx-auto grid place-items-center">
        <div className="flex justify-evenly w-full items-center">
          <h1 className="text-3xl font-bold text-center mb-4 text-white">
            Weather Forecast
          </h1>
          <form onSubmit={handleSearch} className="flex justify-center mb-4">
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="shadow rounded-md outline-none px-5 py-3 focus:ring-1 focus:ring-purple-300"
              placeholder="Enter location"
            />
            <button type="submit" className="btn btn-primary ml-2">
              Search
            </button>
          </form>
        </div>
        {loading ? (
          <div>
            <h1>loading...</h1>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-start max-w-5xl mx-auto w-full gap-10">
            <div className="text-white overlay p-5 bg-black bg-opacity-50 flex justify-around max-w-2xl mx-auto items-start w-full gap-10 leading-normal tracking-wider text-base">
              <div className="space-y-3">
                <p>Date: {moment().format("LL")}</p>
                <p>Location: {location}</p>
                <p>Relative Humidity: {avgHumidity} %</p>
              </div>
              <div className="space-y-3">
                <p>Highest Temperature: {highestTemp}°C</p>
                <p>Lowest Temperature: {lowestTemp}°C</p>
                <p>Average Wind Speed: {avgWindSpeed} m/s</p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2 text-white">Temperature</h2>
              <div className="max-w-4xl w-full overflow-x-auto">
                <LineChart
                  width={weatherData.length * 60}
                  height={400}
                  data={weatherData}
                >
                  <XAxis dataKey="hour" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="wind_speed" stroke="#8884d8" />
                  <Line type="monotone" dataKey="temp" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="rh" stroke="#dc34ac" />
                </LineChart>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
