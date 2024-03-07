import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import PlantRecommender from "../PlantRecommender/PlantRecommender";
import LoginForm from "../../components/LoginForm/LoginForm";
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import { getUserProfile } from "../../utilities/users-service";
import UserProfile from "../../components/UserProfile/UserProfile";
import { UserProvider } from "../../contexts/UserContext";
import { useUser } from "../../contexts/UserContext";

export default function App() {
  const { user, setUser } = useUser(); // Use both user and setUser from the context

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Assuming you have a mechanism to retrieve the user ID or user object
      const userId = user ? user._id : null;
      if (!userId) {
        console.log("No user ID available, skipping profile fetch.");
        return;
      }
      try {
        // Update user profile fetch logic if necessary
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [user, setUser]); 

  return (
    <UserProvider> {/* Wrap your application within UserProvider */}
      <main className="App">
        <Routes>
          {/* Redirect root path based on user authentication status */}
          <Route path="/" element={user ? <Navigate replace to="/profile" /> : <Navigate replace to="/login" />} />

          {/* Login route */}
          <Route path="/login" element={user ? <Navigate replace to="/profile" /> : <LoginForm />} />

          {/* Signup route */}
          <Route path="/signup" element={user ? <Navigate replace to="/profile" /> : <SignUpForm setUser={setUser}/>} />

          {/* Plant Recommender route, protected */}
          <Route path="/plant-recommender" element={<PlantRecommender />} /> 

          {/* User Profile route, protected */}
          <Route path="/profile" element={ <UserProfile />} />

          {/* Add more routes as needed for other components of your app */}
        </Routes>
      </main>
    </UserProvider>
  );
}
