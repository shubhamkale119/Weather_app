const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: String,
  temperature: Number,
  condition: String,
  icon: String,
  humidity: Number,
  windSpeed: Number,
  sunrise: Date,
  sunset: Date,
});

module.exports = mongoose.model('City', citySchema);
