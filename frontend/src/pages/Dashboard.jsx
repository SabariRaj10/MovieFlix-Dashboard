import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Download, AlertCircle } from "lucide-react";
import MovieCard from "../components/MovieCard";
import SearchFilters from "../components/SearchFilters";
import StatsCards from "../components/StatsCards";

import { searchMovies, getAllMovies, getMovieStats, searchAndCacheMovies } from "../services/movieService";

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchingAPI, setSearchingAPI] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    genre: "All Genres",
    year: "All Years",
    rating: "All Ratings",
    sort: "rating",
    order: "desc",
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("🔄 Loading initial data...");
      
      // Load movies and stats in parallel
      const [moviesData, statsData] = await Promise.all([
        getAllMovies(),
        getMovieStats()
      ]);
      
      console.log("📊 Movies data received:", moviesData);
      console.log("📈 Stats data received:", statsData);
      
      setMovies(moviesData);
      // Note: Stats are now handled by StatsOverview component
    } catch (error) {
      console.error("❌ Error loading initial data:", error);
      setError("Failed to load movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // If no search term, load all movies
      await loadInitialData();
      return;
    }

    try {
      setSearchLoading(true);
      setError("");
      
      // First, try to search cached movies
      let searchResults = await searchMovies(searchTerm, filters);
      
      // If no cached results, search OMDb API and cache
      if (searchResults.length === 0) {
        console.log("🔍 No cached results, searching OMDb API...");
        setSearchingAPI(true);
        try {
          searchResults = await searchAndCacheMovies(searchTerm);
          console.log("📡 OMDb API results:", searchResults);
        } catch (apiError) {
          console.error("OMDb API search failed:", apiError);
          // Continue with empty results rather than showing error
        } finally {
          setSearchingAPI(false);
        }
      } else {
        console.log("📚 Found cached results, no need to call API");
      }
      
      setMovies(searchResults);
      
      if (searchResults.length === 0) {
        setError(`No movies found for "${searchTerm}". Try a different search term.`);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Auto-search when filters change
    if (searchTerm.trim()) {
      handleSearch();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const downloadCSV = () => {
    if (movies.length === 0) return;

    const headers = ["Title", "Year", "Rating", "Runtime", "Genre", "Director"];
    const csvContent = [
      headers.join(","),
      ...movies.map(movie => [
        `"${movie.title}"`,
        movie.year,
        movie.rating,
        movie.runtime,
        `"${movie.genre.join(", ")}"`,
        `"${movie.director}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `movies-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="\">
      {/* Header */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-4">MovieFlix Dashboard</h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg">Discover, search, and explore your favorite movies</p>
      </div>

      {/* Statistics Cards */}
      <div className="px-6 mb-8">
        <StatsCards movies={movies} />
      </div>

      {/* Search and Filters */}
      <div className="px-6 mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/20">
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3  border border-gray-600 rounded-lg text-black "
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed"
            >
              {searchLoading ? (searchingAPI ? "🔍 Searching API..." : "Searching...") : "Search"}
            </button>
          </div>

          {/* Filters */}
          <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 mb-6">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Movies Grid */}
      <div className="px-6 mb-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-gray-300 mt-4">Loading movies...</p>
          </div>
        ) : movies.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-black dark:text-white">
                  {searchTerm ? `Search Results for "${searchTerm}"` : "All Movies"}
                </h2>
                {searchTerm && movies.length > 0 && (
                  <p className="text-gray-300 text-sm mt-1">
                    Found {movies.length} movies
                    {searchingAPI ? " (searching OMDb API...)" : 
                     movies.some(m => m.lastUpdated && new Date(m.lastUpdated) > new Date(Date.now() - 60000)) ? 
                     " (freshly cached from OMDb API)" : 
                     " (from cache)"}
                  </p>
                )}
              </div>
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                Download CSV
              </button>
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              {searchTerm ? `No movies found for "${searchTerm}"` : "No movies available"}
            </div>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  loadInitialData();
                }}
                className="text-purple-400 hover:text-purple-300 underline"
              >
                View all movies
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

