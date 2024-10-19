const express = require('express');
const router = express.Router();
const City = require('../models/City');
const axios = require('axios');
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = process.env.WEATHER_API_KEY;

// Add a new city
router.post('/', async (req, res) => {
  const { city } = req.body;

  try {
    const response = await axios.get(`${WEATHER_API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    const weatherData = response.data;

    const newCity = new City({
      name: weatherData.name,
      temperature: weatherData.main.temp,
      condition: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      sunrise: new Date(weatherData.sys.sunrise * 1000),
      sunset: new Date(weatherData.sys.sunset * 1000),
    });

    await newCity.save();
    res.json(newCity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding city or fetching weather data.' });
  }
});

// Get all cities
router.get('/', async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching cities.' });
  }
});

// Delete a city by ID
router.delete('/:id', async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting city.' });
  }
});

module.exports = router;
