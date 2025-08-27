import { useState, useEffect } from "react";
import { BarChart3, Star, Clock, Calendar } from "lucide-react";

const StatsCards = ({ movies }) => {
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
      bgColor: "bg-yellow-100",
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
      bgColor: "bg-purple-900/10",
      lightBg: "bg-purple-100",
      lightText: "text-purple-800",
      lightIconBg: "bg-purple-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={` dark:bg-transparent backdrop-blur-lg rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-lg transition-all duration-200 hover:shadow-xl`}
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
    </div>
  );
};

export default StatsCards;
