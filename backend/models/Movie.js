const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  imdbID: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  year: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    default: 'N/A'
  },
  rating: {
    type: String,
    default: 'N/A'
  },
  runtime: {
    type: String,
    default: 'N/A'
  },
  genre: [{
    type: String
  }],
  director: {
    type: String,
    default: 'N/A'
  },
  actors: [{
    type: String
  }],
  plot: {
    type: String,
    default: 'N/A'
  },
  language: {
    type: String,
    default: 'N/A'
  },
  country: {
    type: String,
    default: 'N/A'
  },
  awards: {
    type: String,
    default: 'N/A'
  },
  imdbRating: {
    type: String,
    default: 'N/A'
  },
  imdbVotes: {
    type: String,
    default: 'N/A'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search functionality
movieSchema.index({ title: 'text', plot: 'text' });

// Method to check if cache is expired (24 hours)
movieSchema.methods.isCacheExpired = function() {
  const cacheAge = Date.now() - this.lastUpdated.getTime();
  const cacheAgeHours = cacheAge / (1000 * 60 * 60);
  return cacheAgeHours > 24;
};

module.exports = mongoose.model('Movie', movieSchema);
