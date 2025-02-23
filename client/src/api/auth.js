import axios from "axios";

const API_URL = "/api/auth"; // Base API URL for authentication requests

// Register a new user with a username, email, and password
export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, { username, email, password });
    return response.data; // Return response data on successful registration
  } catch (error) {
    // Throw an error message from the response, or a default message if unavailable
    throw error.response?.data?.message || "Error registering user";
  }
};

// Log in an existing user using their username and password
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });

    if (response.data?.token && response.data?.userId) {
      // Store authentication token and user ID in localStorage for session persistence
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
    }

    return response.data; // Return token and user details upon successful login
  } catch (error) {
    // Throw an error message from the response, or a default message if unavailable
    throw error.response?.data?.message || "Error logging in";
  }
};

// Log out the currently authenticated user by clearing stored credentials
export const logoutUser = () => {
  localStorage.removeItem("token"); // Remove authentication token
  localStorage.removeItem("userId"); // Remove user ID
};
