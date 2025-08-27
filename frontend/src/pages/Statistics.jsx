import { useState, useEffect } from "react";
import { BarChart3, Star, Clock, Calendar } from "lucide-react";
import GenrePieChart from "../components/GenrePieChart";

const Statistics = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Import the service dynamically to avoid circular dependencies
      const { getAllMovies } = await import("../services/movieService");
      const moviesData = await getAllMovies();
      
      setMovies(moviesData);
    } catch (error) {
      console.error("Error loading movies:", error);
      setError("Failed to load movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const [stats, setStats] = useState({
    totalMovies: 0,
    averageRating: 0,
    averageRuntime: 0,
    topGenre: "N/A",
  });

  useEffect(() => {
    if (movies && movies.length > 0) {
      calculateStats(movies);
    }
  }, [movies]);

  const calculateStats = (movieList) => {
    // Calculate total movies
    const total = movieList.length;

    // Calculate average rating
    const ratings = movieList
      .map(movie => parseFloat(movie.rating))
      .filter(rating => !isNaN(rating));
    const avgRating = ratings.length > 0 
      ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
      : 0;

    // Calculate average runtime
    const runtimes = movieList
      .map(movie => {
        if (movie.runtime && movie.runtime.includes('min')) {
          return parseInt(movie.runtime.replace(' min', ''));
        }
        return null;
      })
      .filter(runtime => runtime !== null);
    const avgRuntime = runtimes.length > 0 
      ? Math.round(runtimes.reduce((sum, runtime) => sum + runtime, 0) / runtimes.length)
      : 0;

    // Calculate top genre
    const genreCounts = {};
    movieList.forEach(movie => {
      if (movie.genre && Array.isArray(movie.genre)) {
        movie.genre.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });
    
    const topGenre = Object.keys(genreCounts).length > 0
      ? Object.entries(genreCounts)
          .sort(([,a], [,b]) => b - a)[0][0]
      : "N/A";

    setStats({
      totalMovies: total,
      averageRating: avgRating,
      averageRuntime: avgRuntime,
      topGenre: topGenre,
    });
  };

  const statCards = [
    {
      title: "Total Movies",
      value: stats.totalMovies,
      icon: BarChart3,
      color: "text-blue-400",
      bgColor: "bg-blue-600",
      lightBg: "bg-blue-100",
      lightText: "text-blue-800",
      lightIconBg: "bg-blue-200",
    },
    {
      title: "Average Rating",
      value: stats.averageRating,
      icon: Star,
      color: "text-yellow-400",
      bgColor: "bg-yellow-600",
      lightBg: "bg-yellow-100",
      lightText: "text-yellow-800",
      lightIconBg: "bg-yellow-200",
    },
    {
      title: "Avg Runtime",
      value: `${stats.averageRuntime}m`,
      icon: Clock,
      color: "text-green-400",
      bgColor: "bg-green-600",
      lightBg: "bg-green-100",
      lightText: "text-green-800",
      lightIconBg: "bg-green-200",
    },
    {
      title: "Top Genre",
      value: stats.topGenre,
      icon: Calendar,
      color: "text-purple-400",
      bgColor: "bg-purple-600",
      lightBg: "bg-purple-100",
      lightText: "text-purple-800",
      lightIconBg: "bg-purple-200",
    },
  ];

  // Prepare chart data
  const prepareChartData = () => {
    if (!movies || movies.length === 0) return {};

    // Genre Distribution (Pie Chart)
    const genreCounts = {};
    movies.forEach(movie => {
      if (movie.genre && Array.isArray(movie.genre)) {
        movie.genre.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });

    // Average Ratings by Genre (Bar Chart)
    const genreRatings = {};
    movies.forEach(movie => {
      if (movie.genre && Array.isArray(movie.genre) && movie.rating !== 'N/A') {
        movie.genre.forEach(genre => {
          if (!genreRatings[genre]) {
            genreRatings[genre] = { sum: 0, count: 0 };
          }
          genreRatings[genre].sum += parseFloat(movie.rating);
          genreRatings[genre].count += 1;
        });
      }
    });

    // Average Runtime by Year (Line Chart)
    const yearRuntimes = {};
    movies.forEach(movie => {
      if (movie.year && movie.runtime && movie.runtime !== 'N/A') {
        const year = movie.year;
        const runtime = parseInt(movie.runtime.replace(' min', ''));
        if (!isNaN(runtime)) {
          if (!yearRuntimes[year]) {
            yearRuntimes[year] = { sum: 0, count: 0 };
          }
          yearRuntimes[year].sum += runtime;
          yearRuntimes[year].count += 1;
        }
      }
    });

    return {
      genreDistribution: Object.entries(genreCounts).map(([genre, count]) => ({
        genre,
        count
      })),
      genreRatings: Object.entries(genreRatings).map(([genre, data]) => ({
        genre,
        avgRating: (data.sum / data.count).toFixed(1)
      })),
      yearRuntimes: Object.entries(yearRuntimes).map(([year, data]) => ({
        year,
        avgRuntime: Math.round(data.sum / data.count)
      })).sort((a, b) => parseInt(a.year) - parseInt(b.year))
    };
  };

  const chartData = prepareChartData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={loadMovies}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Movie Statistics</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">Comprehensive analytics and insights about your movie collection</p>
      </div>

      <div className="container mx-auto px-6">
        {/* Statistics Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`${stat.lightBg} dark:${stat.bgColor} backdrop-blur-lg rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-lg transition-all duration-200 hover:shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-200 text-sm font-medium mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.lightText} dark:text-white`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.lightIconBg} dark:${stat.bgColor} p-3 rounded-lg dark:bg-opacity-80`}>
                  <stat.icon className={`h-6 w-6 ${stat.lightText} dark:text-white`} />
                </div>
              </div>
            </div>
          ))}
        </div> */}

        {/* Interactive Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Genre Distribution - Pie Chart */}
          <GenrePieChart movies={movies} />

          {/* Average Ratings by Genre - Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Average Ratings by Genre
            </h3>
            <div className="h-64 flex items-center justify-center">
              {chartData.genreRatings && chartData.genreRatings.length > 0 ? (
                <div className="w-full space-y-2">
                  {chartData.genreRatings.slice(0, 6).map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 dark:text-gray-300 w-20 truncate">
                        {item.genre}
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div 
                          className="bg-yellow-500 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${(parseFloat(item.avgRating) / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                        {item.avgRating}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No rating data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Average Runtime by Year - Line Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-green-500" />
            Average Runtime by Year
          </h3>
          <div className="h-64 flex items-center justify-center">
            {chartData.yearRuntimes && chartData.yearRuntimes.length > 0 ? (
              <div className="w-full">
                <div className="flex items-end justify-between h-48 border-b border-l border-gray-300 dark:border-gray-600 pb-2 pl-2">
                  {chartData.yearRuntimes.slice(0, 10).map((item, index) => (
                    <div key={index} className="flex flex-col items-center space-y-1">
                      <div 
                        className="w-4 bg-green-500 rounded-t transition-all duration-500"
                        style={{ height: `${(item.avgRuntime / 200) * 100}%` }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400 transform -rotate-45 origin-left">
                        {item.year}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>0m</span>
                  <span>200m</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No runtime data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
