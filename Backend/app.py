import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests
from datetime import datetime

# Replace with your OpenWeather API key
API_KEY = 'cf349a9188c3c88fde47cc5b9e4a079e'

app = Flask(__name__, static_folder='../Frontend/dist', static_url_path='/')
CORS(app)


@app.route('/weather', methods=['POST'])
def get_weather():
    data = request.get_json()
    city = data.get("city")
    
    # Get current weather
    current_url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric'
    current_response = requests.get(current_url).json()
    
    if current_response.get('cod') != 200:
        return jsonify({'error': 'City not found.'}), 404
    
    # Get forecast data for rain probability
    forecast_url = f'http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric'
    forecast_response = requests.get(forecast_url).json()
    
    # Get rain probability from the next forecast (next 3 hours)
    rain_probability = 0
    if forecast_response.get('cod') == '200' and forecast_response.get('list'):
        next_forecast = forecast_response['list'][0]
        # Rain probability is given as a percentage (0-100)
        rain_probability = next_forecast.get('pop', 0) * 100  # pop is probability of precipitation (0-1)
    
    weather_data = {
        'city': city,
        'temperature': current_response['main']['temp'],
        'clouds_description': f"{current_response['clouds']['all']}% cloud cover",
        'humidity': current_response['main']['humidity'],
        'wind_speed': current_response['wind']['speed'],
        'icon': current_response['weather'][0]['icon'],
        'rain_probability': round(rain_probability, 0),
        'last_updated': datetime.now().isoformat()
    }
    
    return jsonify(weather_data)

if __name__ == '__main__':
  port = int(os.environ.get("PORT", 10000)) 
  app.run(host="0.0.0.0", port=port)