// Import axios for making HTTP requests
import axios from 'axios';

import { API_URL } from "../api";

// Create an Axios instance with custom configuration
const axiosInstance = axios.create({
  // Base URL for all API requests
  baseURL: `${API_URL}/api`,
  
  // Default headers for all requests
  headers: {
    'Content-Type': 'application/json'  // Sending and receiving JSON
  }
});

// Export the configured Axios instance for use in the app
export default axiosInstance;

