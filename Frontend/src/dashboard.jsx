import { useState } from "react";

export default function Dashboard() {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    
 
    try {
        

      const response = await fetch("http://localhost:5000/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch weather");
      }

      const data = await response.json();
      console.log("Weather data:", data);
      setResult(data);

    
    } catch (err) {
        console.error("Error fetching weather:", err);
      setError("Could not get weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[url(assets/cloud.jpg)] bg-cover h-screen w-full relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-transparent to-blue-900/20"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 flex-col items-center justify-center h-full">
    
    <div className="max-w-md mx-auto pt-20 px-6 pb-10 ">
      <div className="bg-white/50 pt-8 px-6 pb-10 rounded-lg shadow-lg"> 
    
      <h1 className="text-4xl  font-semibold text-center mb-16">Weather Forecast</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          
          <input
            type="text"
            id="city"
            name="city"
            className="w-full border-1 border-gray-400 bg-white/75  rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            placeholder="Enter City"
          />
        </div>

        <button
          type="submit"
          
          className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-600 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          Get Weather
        </button>
      </form>


         

      {error && (
        <div className="mt-4 p-3 border-red-400 border-2 text-red-700 rounded">
          {error}
        </div>
      )}
       </div>
    </div>
    {loading ? (
            <div className="flex items-center justify-center mt-4 ">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          ):null }
    {result && (
      <div className="bg-black/75 py-4 w-96 mx-auto rounded-lg shadow-lg ">
        <div className="  text-white  mx-10 flex flex-col items-center gap-2">
          <div className="flex gap-1">
          <strong>City:</strong><span>{result.city}</span> 
          </div>
          <div className="flex-col gap-1">
          <strong>Temperature: </strong> {result.temperature} 
          </div>
          <div className="flex gap-1">
          <strong>Cloud : </strong>{result.clouds_description}
          </div>
          <div className="flex gap-1">
          <strong>Humidity: </strong>{result.humidity}
          </div>
          <div className="flex gap-1">
          <strong>Wind Speed: </strong>{result.wind_speed} 
          </div>
          <div className="flex gap-1">
          <strong>Last Updated: </strong>{new Date(result.last_updated).toLocaleString()}
          </div>
          <div className="flex gap-1">
          <strong>Rain Probability: </strong>{result.rain_probability}%
          </div>
        </div>
        </div>
      )}
      </div>
    </div>
  );
}
