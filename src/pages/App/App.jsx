import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import './App.css';
import PlantRecommender from "../PlantRecommender/PlantRecommender";
import { getUserProfile } from "../../utilities/users-service";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const userProfile = await getUserProfile(); // Assuming this function is properly implemented to get the user's profile
        setUser(userProfile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
      }
    }

    fetchUserProfile();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <main className="App">
      {user ? (
        <>
          <Routes>
            <Route path="/plant-recommender" element={<PlantRecommender />} />
            {/* Add more authenticated routes here */}
          </Routes>
        </>
      ) : (
        // Optionally, render something else when there is no user logged in
        <p>Please log in to access the Plant Recommender.</p>
      )}
    </main>
  );
}
