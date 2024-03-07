import axios from 'axios';

const backendPort = 3001; // Change this to your backend port
const baseURL = `http://localhost:${backendPort}`;

const axiosInstance = axios.create({
  baseURL: baseURL,
});
// users-service.js

export const login = async (credentials) => {
    const response = await axios.post('/api/users/login', credentials);
    return response.data; // Assuming the server returns the user object
};


// In your utilities or services file
export async function savePlantsToUserProfile(userId, plants) {
    // Replace with actual API call to your backend
    const { data } = await axios.post(`/api/users/${userId}/plants`, { plants });
    return data;
}


export async function getUserProfile(userId) {
  const { data } = await axiosInstance.get(`/api/users/${userId}`);
  return data;
}

export async function getUsers() {
  const { data } = await axiosInstance.get('/api/users');
  return data;
}

export async function createUserProfile(profileData) {
  const { data } = await axiosInstance.post('/api/users/new', profileData);
  return data;
}

export async function updateUserProfile(profileData, userId) {
  const { data } = await axiosInstance.put(`/api/users/${userId}`, profileData);
  return data;
}

export async function deleteUserProfile(userId) {
  const { data } = await axiosInstance.delete(`/api/users/${userId}`);
  return data;
}
