const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

// Search movies with filters (public route - no auth required)
export const searchMovies = async (searchTerm, filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (searchTerm) params.append('search', searchTerm);
    if (filters.genre && filters.genre !== 'All Genres') params.append('genre', filters.genre);
    if (filters.year && filters.year !== 'All Years') params.append('year', filters.year);
    if (filters.rating && filters.rating !== 'All Ratings') params.append('rating', filters.rating);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.order) params.append('order', filters.order);

    const response = await fetch(`${API_BASE_URL}/movies?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

// Get movie details by ID (public route - no auth required)
export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting movie details:', error);
    throw error;
  }
};

// Get movie statistics (public route - no auth required)
export const getMovieStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/stats/overview`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting movie stats:', error);
    throw error;
  }
};

// Search and cache movies from OMDb API (requires authentication)
export const searchAndCacheMovies = async (searchTerm) => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/movies/search`, {
      method: 'POST',
      body: JSON.stringify({ searchTerm }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching and caching movies:', error);
    throw error;
  }
};

// Get all movies (public route - no auth required)
export const getAllMovies = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting all movies:', error);
    throw error;
  }
};
