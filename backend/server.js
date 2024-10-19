const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

const City = require('./models/City');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  'mongodb+srv://shubhamkale99:Shubham123@cluster0.h7pi6.mongodb.net/weatherDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Check if the database is connected
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Routes
app.use('/API/cities', require('./routes/cities'));

// Weather API URL
const API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Scheduled task to update weather data hourly
cron.schedule('0 * * * *', async () => {
  const cities = await City.find();
  for (let city of cities) {
    try {
      const response = await axios.get(
        `${WEATHER_API_URL}?q=${city.name}&appid=${API_KEY}&units=metric`
      );
      city.temperature = response.data.main.temp;
      city.condition = response.data.weather[0].description;
      city.icon = response.data.weather[0].icon;
      await city.save();
    } catch (error) {
      console.error(`Failed to update weather for ${city.name}:`, error);
    }
  }
  console.log('Weather data updated for all cities');
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});