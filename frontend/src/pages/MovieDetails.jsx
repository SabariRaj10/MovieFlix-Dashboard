import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock, Globe, Award, ExternalLink } from 'lucide-react';
import { getMovieDetails } from '../services/movieService';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const movieData = await getMovieDetails(id);
        setMovie(movieData);
      } catch (err) {
        setError('Failed to load movie details');
        console.error('Error fetching movie:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error || 'Movie not found'}</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:underline"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:underline mb-6"
      >
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>

      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg overflow-hidden">
        {/* Hero Section */}
        <div className="relative h-96 md:h-[500px] bg-gradient-to-r from-gray-900 to-gray-700">
          {movie.poster && movie.poster !== 'N/A' ? (
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover opacity-40"
            />
          ) : null}
          
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                {movie.year && (
                  <div className="flex items-center space-x-2">
                    <Calendar size={20} />
                    <span>{movie.year}</span>
                  </div>
                )}
                
                {movie.runtime && movie.runtime !== 'N/A' && (
                  <div className="flex items-center space-x-2">
                    <Clock size={20} />
                    <span>{movie.runtime}</span>
                  </div>
                )}
                
                {movie.rating && movie.rating !== 'N/A' && (
                  <div className="flex items-center space-x-2">
                    <Star size={20} fill="currentColor" />
                    <span>{movie.rating}/10</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Plot */}
              {movie.plot && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Plot</h2>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {movie.plot}
                  </p>
                </div>
              )}

              {/* Cast */}
              {movie.actors && movie.actors.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Cast</h2>
                  <div className="flex flex-wrap gap-2">
                    {movie.actors.map((actor, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Awards */}
              {movie.awards && movie.awards !== 'N/A' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Awards</h2>
                  <div className="flex items-start space-x-3">
                    <Award className="w-6 h-6 text-yellow-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 dark:text-gray-300">{movie.awards}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Poster */}
              {movie.poster && movie.poster !== 'N/A' && (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              )}

              {/* Quick Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Info</h3>
                
                {movie.director && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Director</span>
                    <p className="text-gray-900 dark:text-white">{movie.director}</p>
                  </div>
                )}
                
                {movie.language && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Language</span>
                    <p className="text-gray-900 dark:text-white">{movie.language}</p>
                  </div>
                )}
                
                {movie.country && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Country</span>
                    <p className="text-gray-900 dark:text-white">{movie.country}</p>
                  </div>
                )}
                
                {movie.imdbVotes && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">IMDb Votes</span>
                    <p className="text-gray-900 dark:text-white">{movie.imdbVotes}</p>
                  </div>
                )}
              </div>

              {/* External Links */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">External Links</h3>
                <div className="space-y-3">
                  <a
                    href={`https://www.imdb.com/title/${movie.imdbID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <Globe size={16} />
                    <span>View on IMDb</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;



