import axios from 'axios';

const backendPort = 3001; // Change this to your backend port
const baseURL = `http://localhost:${backendPort}`;

const axiosInstance = axios.create({
  baseURL: baseURL,
});

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
