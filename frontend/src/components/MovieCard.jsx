import { Link } from 'react-router-dom';
import { Star, Calendar, Clock, Play } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const {
    imdbID,
    title,
    year,
    poster,
    rating,
    runtime,
    genre,
    plot
  } = movie;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col h-full border border-gray-700">
      {/* Poster */}
      <div className="relative h-64 bg-gray-700 flex-shrink-0">
        {poster && poster !== 'N/A' ? (
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`w-full h-full flex items-center justify-center text-gray-400 ${
            poster && poster !== 'N/A' ? 'hidden' : 'flex'
          }`}
        >
          <Play size={48} />
        </div>
        
        {/* Rating Badge */}
        {rating && rating !== 'N/A' && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
            <Star size={12} fill="currentColor" />
            <span>{rating}</span>
          </div>
        )}
      </div>

      {/* Content - Use flex-1 to push button to bottom */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {title}
        </h3>
        
        {/* Meta Info */}
        <div className="space-y-2 mb-3">
          {year && (
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Calendar size={14} />
              <span>{year}</span>
            </div>
          )}
          
          {runtime && runtime !== 'N/A' && (
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Clock size={14} />
              <span>{runtime}</span>
            </div>
          )}
        </div>

        {/* Genre Tags */}
        {genre && genre.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {genre.slice(0, 3).map((g, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded-full"
              >
                {g}
              </span>
            ))}
            {genre.length > 3 && (
              <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
                +{genre.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Plot Preview */}
        {plot && (
          <p className="text-sm text-gray-300 mb-4 line-clamp-3 flex-1">
            {plot}
          </p>
        )}

        {/* View Details Button - Always at bottom */}
        <div className="mt-auto pt-2">
          <Link
            to={`/movie/${imdbID}`}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-all duration-200 text-center block font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

