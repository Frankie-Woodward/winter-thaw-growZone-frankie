import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext'; // Make sure the path is correct

export default function UserProfile() {
    const { user } = useUser(); // Use the user from context
    const navigate = useNavigate();


    // Use an effect to handle redirection if the user is not authenticated
    useEffect(() => {
        // If there's no user, redirect to the login page
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]); // Dependencies: React re-runs the effect if `user` or `navigate` changes

    // Conditional rendering to handle the loading state
    // This can be useful if there's a slight delay in determining the user's auth status
    // or if you're fetching the user's details asynchronously
    if (!user) {
        return <div>Loading user profile...</div>;
    }

    // Main component render for when the user is present
    return (
        <div>
            <h2>User Profile</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Zipcode: {user.zipcode}</p>
            {/* Assuming `myplants` is an array of objects; adjust accordingly */}
            <p>Favorite Plants: {user.myplants?.map(plant => plant.common_name).join(", ")}</p>
            <button onClick={() => navigate('/plant-recommender')}>
                Find Plant Recommendations
            </button>
        </div>
    );
}
