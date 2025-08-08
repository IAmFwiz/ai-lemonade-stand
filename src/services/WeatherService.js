const axios = require('axios');

class WeatherService {
  constructor() {
    // Using OpenWeatherMap API (free tier available)
    this.apiKey = process.env.OPENWEATHER_API_KEY || 'demo_key';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  // Get weather data for a specific location
  async getWeatherData(location) {
    const cacheKey = `${location.city}_${location.country}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: `${location.city},${location.country}`,
          appid: this.apiKey,
          units: 'imperial' // Use Fahrenheit
        }
      });

      const weatherData = this.parseWeatherData(response.data);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now()
      });

      return weatherData;
    } catch (error) {
      // Only log the first error to avoid spam, then use demo data
      if (!this.hasLoggedError) {
        console.log('🌤️  Weather API: Using demo data (API key not configured)');
        this.hasLoggedError = true;
      }
      
      // Return default weather data if API fails
      return this.getDefaultWeatherData(location);
    }
  }

  // Parse OpenWeatherMap API response
  parseWeatherData(apiData) {
    const temperature = apiData.main.temp;
    const condition = this.mapWeatherCondition(apiData.weather[0].main);
    
    return {
      temperature: Math.round(temperature),
      condition,
      humidity: apiData.main.humidity,
      windSpeed: apiData.wind.speed,
      description: apiData.weather[0].description,
      icon: apiData.weather[0].icon,
      timestamp: new Date()
    };
  }

  // Map OpenWeatherMap conditions to our simplified conditions
  mapWeatherCondition(apiCondition) {
    const conditionMap = {
      'Clear': 'sunny',
      'Clouds': 'cloudy',
      'Rain': 'rainy',
      'Drizzle': 'rainy',
      'Thunderstorm': 'stormy',
      'Snow': 'cold',
      'Mist': 'cloudy',
      'Fog': 'cloudy',
      'Haze': 'cloudy'
    };

    return conditionMap[apiCondition] || 'cloudy';
  }

  // Get default weather data when API is unavailable
  getDefaultWeatherData(location) {
    // Generate pseudo-random weather based on location
    const seed = location.city.length + location.country.length;
    const hour = new Date().getHours();
    
    let temperature = 20 + Math.sin(hour / 24 * Math.PI) * 10;
    temperature += (seed % 10) - 5; // Add some location-based variation
    
    let condition = 'sunny';
    if (temperature < 10) condition = 'cold';
    else if (temperature > 30) condition = 'sunny';
    else if (seed % 4 === 0) condition = 'rainy';
    else if (seed % 4 === 1) condition = 'cloudy';
    else condition = 'sunny';

    return {
      temperature: Math.round(temperature),
      condition,
      humidity: 60 + (seed % 20),
      windSpeed: 5 + (seed % 10),
      description: `${condition} weather`,
      icon: '01d',
      timestamp: new Date()
    };
  }

  // Get weather for multiple locations
  async getWeatherForLocations(locations) {
    const weatherPromises = locations.map(location => 
      this.getWeatherData(location)
    );

    const weatherResults = await Promise.allSettled(weatherPromises);
    
    return weatherResults.map((result, index) => ({
      location: locations[index],
      weather: result.status === 'fulfilled' ? result.value : this.getDefaultWeatherData(locations[index]),
      success: result.status === 'fulfilled'
    }));
  }

  // Get weather-based pricing recommendations
  getPricingRecommendations(weatherData) {
    const { temperature, condition } = weatherData;
    let recommendation = 'normal';
    let multiplier = 1.0;
    let reasoning = [];

    // Temperature-based recommendations
    if (temperature > 30) {
      recommendation = 'premium';
      multiplier = 1.5;
      reasoning.push('High temperature increases demand');
    } else if (temperature > 25) {
      recommendation = 'high';
      multiplier = 1.3;
      reasoning.push('Warm weather increases demand');
    } else if (temperature < 10) {
      recommendation = 'clearance';
      multiplier = 0.5;
      reasoning.push('Cold weather reduces demand');
    } else if (temperature < 15) {
      recommendation = 'low';
      multiplier = 0.7;
      reasoning.push('Cool weather reduces demand');
    }

    // Weather condition adjustments
    switch (condition) {
      case 'sunny':
        multiplier *= 1.2;
        reasoning.push('Sunny weather increases demand');
        break;
      case 'rainy':
        multiplier *= 0.6;
        reasoning.push('Rainy weather reduces demand');
        break;
      case 'stormy':
        multiplier *= 0.3;
        reasoning.push('Stormy weather significantly reduces demand');
        break;
      case 'cloudy':
        multiplier *= 0.9;
        reasoning.push('Cloudy weather slightly reduces demand');
        break;
    }

    return {
      recommendation,
      multiplier: Math.round(multiplier * 100) / 100,
      reasoning,
      suggestedPrice: Math.round(2.50 * multiplier * 100) / 100
    };
  }

  // Get weather forecast for planning
  async getWeatherForecast(location, days = 5) {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          q: `${location.city},${location.country}`,
          appid: this.apiKey,
          units: 'metric',
          cnt: days * 8 // 8 readings per day
        }
      });

      return this.parseForecastData(response.data);
    } catch (error) {
      console.error(`Error fetching forecast for ${location.city}:`, error.message);
      return this.getDefaultForecast(location, days);
    }
  }

  // Parse forecast data
  parseForecastData(apiData) {
    const dailyForecasts = [];
    const dailyData = {};

    // Group by day
    apiData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          temperatures: [],
          conditions: []
        };
      }
      dailyData[date].temperatures.push(item.main.temp);
      dailyData[date].conditions.push(this.mapWeatherCondition(item.weather[0].main));
    });

    // Calculate daily averages
    Object.keys(dailyData).forEach(date => {
      const avgTemp = Math.round(
        dailyData[date].temperatures.reduce((sum, temp) => sum + temp, 0) / 
        dailyData[date].temperatures.length
      );
      
      // Most common condition
      const conditionCounts = {};
      dailyData[date].conditions.forEach(condition => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
      });
      
      const mostCommonCondition = Object.keys(conditionCounts).reduce((a, b) => 
        conditionCounts[a] > conditionCounts[b] ? a : b
      );

      dailyForecasts.push({
        date: new Date(date),
        temperature: avgTemp,
        condition: mostCommonCondition,
        pricingRecommendation: this.getPricingRecommendations({
          temperature: avgTemp,
          condition: mostCommonCondition
        })
      });
    });

    return dailyForecasts;
  }

  // Get default forecast when API is unavailable
  getDefaultForecast(location, days) {
    const forecasts = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const seed = location.city.length + i;
      const temperature = 20 + Math.sin(i / days * Math.PI) * 8 + (seed % 6) - 3;
      const condition = ['sunny', 'cloudy', 'rainy', 'sunny'][seed % 4];
      
      forecasts.push({
        date,
        temperature: Math.round(temperature),
        condition,
        pricingRecommendation: this.getPricingRecommendations({
          temperature: Math.round(temperature),
          condition
        })
      });
    }

    return forecasts;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

module.exports = WeatherService; 