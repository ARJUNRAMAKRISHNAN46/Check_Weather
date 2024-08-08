"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Weather = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("kolkata");
  const [searchLocation, setSearchLocation] = useState<string>("kolkota");

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const geocodeResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${location}limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );
      console.log("🚀 ~ fetchWeatherData ~ geocodeResponse:", geocodeResponse)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  const handleSearch = () => {
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
      </div>
    </div>
  );
};

export default Weather;
