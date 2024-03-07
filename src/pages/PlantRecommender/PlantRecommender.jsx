import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { savePlantsToUserProfile } from '../../utilities/users-service';
import { useUser } from '../../contexts/UserContext';

export default function PlantRecommender() {
    const [zipCode, setZipCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [plantRecommendations, setPlantRecommendations] = useState([]);
    const [selectedPlants, setSelectedPlants] = useState([]);
    const { user } = useUser(); // Get the user from context

    useEffect(() => {
        // Load the first 50 plants as default display
        loadInitialPlants();
    }, []);
    const loadInitialPlants = async () => {
        const csvFileUrl = '/plants.csv'; // Ensure the URL is accessible from the public directory
        Papa.parse(csvFileUrl, {
            download: true,
            header: true,
            complete: function(results) {
                const initialPlants = results.data.slice(0, 50); // Take first 50 plants
                setPlantRecommendations(initialPlants);
            },
            error: (error) => {
                console.error('Error loading initial plants:', error);
                setError('Failed to load initial plant data. Please try again later.');
            },
        });
    };
    const fetchWeatherAndRecommendPlants = async (lat, lon) => {
        setIsLoading(true);
        try {
            const apiKey = process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            const response = await axios.get(url);
            // Consider a more nuanced approach based on actual precipitation data if available
            // For demonstration, simply marking precipitation as 1 for simplification
            const precipitation = 1; 

            fetchAndRecommendPlants(precipitation);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setError('Failed to fetch weather data. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

  const fetchAndRecommendPlants = async (precipitation) => {
    const csvFileUrl = '/plants.csv'; // Ensure the URL is accessible from the public directory
    Papa.parse(csvFileUrl, {
      download: true,
      header: true,
      complete: function(results) {
        const plants = results.data;
        console.log(results.data)
        const recommendedPlants = plants.filter(plant => {
          const depthRequirement = parseInt(plant.depth_water_requirement, 10);
          console.log(precipitation)
          return plant.depth_water_requirement && !isNaN(depthRequirement) && depthRequirement > precipitation;
        });
        console.log(recommendedPlants)
        setPlantRecommendations(recommendedPlants);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setError('Failed to load plant data. Please try again later.');
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPlantRecommendations([]);

    try {
      const apiKey = process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY;
      const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},us&appid=${apiKey}`;
      const response = await axios.get(url);
      const { lat, lon } = response.data;
      fetchWeatherAndRecommendPlants(lat, lon);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Example of handling plant selection - toggles plant ID in the selectedPlants array
  const togglePlantSelection = (plantId) => {
    setSelectedPlants(current => 
      current.includes(plantId) ? current.filter(id => id !== plantId) : [...current, plantId]
    );
  };

//   Assuming savePlantsToUserProfile function is defined
//   This should be triggered by a button click after selecting plants
const handleSaveSelectedPlants = async () => {
    if (!user || !user._id) {
        setError('You must be logged in to save plants.');
        return;
    }
    setIsLoading(true);
    try {
        // Assuming this function correctly communicates with your backend
        await savePlantsToUserProfile(user._id, selectedPlants);
        alert('Plants saved to your profile!');
        setSelectedPlants([]);
    } catch (error) {
        console.error('Error saving plants:', error);
        setError('Failed to save plants. Please try again.');
    } finally {
        setIsLoading(false);
    }
};
return (
    <div>
        <h1>Plant Recommender</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="zipCode">Enter your zip code:</label>
            <input
                type="text"
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
            />
            <button type="submit" disabled={isLoading}>{isLoading ? 'Loading...' : 'Get Recommendations'}</button>
        </form>
        {error && <p>Error: {error}</p>}
        <div>
            {plantRecommendations.map((plant, index) => (
                <div key={index}>
                    <h3>{plant.common_name} ({plant.scientific_name})</h3>
                    <p>{plant.description}</p>
                    <input type="checkbox" checked={selectedPlants.includes(plant.id)} onChange={() => togglePlantSelection(plant.id)} />
                    {plant.default_image && <img src={plant.default_image} alt={plant.common_name} style={{width: "100px"}} />}
                </div>
            ))}
            <button onClick={handleSaveSelectedPlants} disabled={isLoading || selectedPlants.length === 0}>Save Selected Plants</button>
        </div>
    </div>
);
}
