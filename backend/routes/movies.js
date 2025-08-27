const express = require('express');
const axios = require('axios');
const Movie = require('../models/Movie');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Search movies with filters
router.get('/', async (req, res) => {
  try {
    const { search, genre, year, rating, sort = 'rating', order = 'desc' } = req.query;
    
    let query = {};
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Genre filter
    if (genre && genre !== 'All Genres') {
      query.genre = { $in: [genre] };
    }
    
    // Year filter
    if (year && year !== 'All Years') {
      query.year = year;
    }
    
    // Rating filter
    if (rating && rating !== 'All Ratings') {
      query.rating = { $gte: parseFloat(rating) };
    }
    
    // Build sort object
    let sortObj = {};
    if (sort === 'rating' || sort === 'year') {
      sortObj[sort] = order === 'asc' ? 1 : -1;
    } else {
      sortObj[sort] = order === 'asc' ? 1 : -1;
    }
    
    const movies = await Movie.find(query)
      .sort(sortObj)
      .limit(50);
    
    res.json(movies);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

// Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findOne({ imdbID: req.params.id });
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json(movie);
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ error: 'Failed to get movie' });
  }
});

// Get movie statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Movie.aggregate([
      {
        $group: {
          _id: null,
          totalMovies: { $sum: 1 },
          avgRating: { 
            $avg: { 
              $cond: {
                if: { $ne: ['$rating', 'N/A'] },
                then: { $toDouble: '$rating' },
                else: null
              }
            } 
          },
          avgRuntime: { 
            $avg: { 
              $cond: {
                if: { 
                  $and: [
                    { $ne: ['$runtime', 'N/A'] },
                    { $ne: ['$runtime', null] },
                    { $ne: ['$runtime', ''] }
                  ]
                },
                then: { 
                  $toDouble: { 
                    $replaceAll: { 
                      input: '$runtime', 
                      find: ' min', 
                      replacement: '' 
                    }
                  } 
                },
                else: null
              }
            } 
          }
        }
      }
    ]);
    
    const genreStats = await Movie.aggregate([
      { $unwind: '$genre' },
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    const yearStats = await Movie.aggregate([
      {
        $group: {
          _id: '$year',
          avgRating: { 
            $avg: { 
              $cond: {
                if: { $ne: ['$rating', 'N/A'] },
                then: { $toDouble: '$rating' },
                else: null
              }
            } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 20 }
    ]);
    
    // Filter out null values and calculate averages
    const validStats = stats[0] || {};
    const validRatings = yearStats.filter(stat => stat.avgRating !== null);
    
    res.json({
      totalMovies: validStats.totalMovies || 0,
      avgRating: validStats.avgRating ? validStats.avgRating.toFixed(1) : '0.0',
      avgRuntime: validStats.avgRuntime ? Math.round(validStats.avgRuntime) : 0,
      genreDistribution: genreStats,
      ratingsByYear: yearStats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Search and cache movies from OMDb API
router.post('/search', auth, async (req, res) => {
  try {
    const { searchTerm } = req.body;
    
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }
    
    // Check if we have recent results in cache
    const cachedResults = await Movie.find({
      $text: { $search: searchTerm },
      lastUpdated: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).limit(10);
    
    if (cachedResults.length > 0) {
      return res.json(cachedResults);
    }
    
    // Fetch from OMDb API
    const response = await axios.get(`${process.env.OMDB_BASE_URL}/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(searchTerm)}`);
    
    if (response.data.Response === 'False') {
      return res.json([]);
    }
    
    const searchResults = response.data.Search || [];
    const movies = [];
    
    // Fetch detailed info for each movie and cache
    for (const result of searchResults.slice(0, 10)) {
      try {
        const detailResponse = await axios.get(`${process.env.OMDB_BASE_URL}/?apikey=${process.env.OMDB_API_KEY}&i=${result.imdbID}`);
        
        if (detailResponse.data.Response === 'True') {
          const movieData = detailResponse.data;
          
          // Transform data and handle edge cases
          const movie = {
            imdbID: movieData.imdbID,
            title: movieData.Title,
            year: movieData.Year,
            poster: movieData.Poster,
            rating: movieData.imdbRating || 'N/A',
            runtime: movieData.Runtime || 'N/A',
            genre: movieData.Genre ? movieData.Genre.split(', ') : [],
            director: movieData.Director || 'N/A',
            actors: movieData.Actors ? movieData.Actors.split(', ') : [],
            plot: movieData.Plot || 'N/A',
            language: movieData.Language || 'N/A',
            country: movieData.Country || 'N/A',
            awards: movieData.Awards || 'N/A',
            imdbRating: movieData.imdbRating || 'N/A',
            imdbVotes: movieData.imdbVotes || 'N/A'
          };
          
          // Upsert to database
          await Movie.findOneAndUpdate(
            { imdbID: movie.imdbID },
            movie,
            { upsert: true, new: true }
          );
          
          movies.push(movie);
        }
        
        // Rate limiting - OMDb has a limit
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Error fetching details for ${result.imdbID}:`, error.message);
      }
    }
    
    res.json(movies);
    
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

// Admin: Clear expired cache
router.delete('/cache/clear', adminAuth, async (req, res) => {
  try {
    const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await Movie.deleteMany({
      lastUpdated: { $lt: expiredDate }
    });
    
    res.json({ 
      message: `Cleared ${result.deletedCount} expired cache entries`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Cache clear error:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

module.exports = router;
