const mongoose = require('mongoose');
const User = require('./models/User');
const Movie = require('./models/Movie');
require('dotenv').config();

const sampleMovies = [
  {
    imdbID: 'tt0133093',
    title: 'The Matrix',
    year: '1999',
    poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
    rating: '8.7',
    runtime: '136 min',
    genre: ['Action', 'Sci-Fi'],
    director: 'Lana Wachowski, Lilly Wachowski',
    actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    plot: 'A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.',
    language: 'English',
    country: 'United States',
    awards: 'Won 4 Oscars. 42 wins & 52 nominations total',
    imdbRating: '8.7',
    imdbVotes: '1,937,000'
  },
  {
    imdbID: 'tt0468569',
    title: 'The Dark Knight',
    year: '2008',
    poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
    rating: '9.0',
    runtime: '152 min',
    genre: ['Action', 'Crime', 'Drama'],
    director: 'Christopher Nolan',
    actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    language: 'English',
    country: 'United States',
    awards: 'Won 2 Oscars. 163 wins & 159 nominations total',
    imdbRating: '9.0',
    imdbVotes: '2,679,000'
  },
  {
    imdbID: 'tt0111161',
    title: 'The Shawshank Redemption',
    year: '1994',
    poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODhiYjYtMWYwYy00Y2Q4LTk4YjQ0YjI0YzA0NzFiNzJkXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
    rating: '9.3',
    runtime: '142 min',
    genre: ['Drama'],
    director: 'Frank Darabont',
    actors: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    language: 'English',
    country: 'United States',
    awards: 'Nominated for 7 Oscars. 21 wins & 38 nominations total',
    imdbRating: '9.3',
    imdbVotes: '2,679,000'
  },
  {
    imdbID: 'tt0109830',
    title: 'Forrest Gump',
    year: '1994',
    poster: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMyXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    rating: '8.8',
    runtime: '142 min',
    genre: ['Drama', 'Romance'],
    director: 'Robert Zemeckis',
    actors: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
    plot: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.',
    language: 'English',
    country: 'United States',
    awards: 'Won 6 Oscars. 44 wins & 52 nominations total',
    imdbRating: '8.8',
    imdbVotes: '2,123,000'
  },
  {
    imdbID: 'tt0137523',
    title: 'Fight Club',
    year: '1999',
    poster: 'https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    rating: '8.8',
    runtime: '139 min',
    genre: ['Drama'],
    director: 'David Fincher',
    actors: ['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter'],
    plot: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
    language: 'English',
    country: 'United States',
    awards: 'Nominated for 1 Oscar. 11 wins & 38 nominations total',
    imdbRating: '8.8',
    imdbVotes: '2,123,000'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    await Movie.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@movieflix.com',
      password: 'admin123',
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('👤 Created admin user (admin/admin123)');
    
    // Insert sample movies
    await Movie.insertMany(sampleMovies);
    console.log(`🎬 Inserted ${sampleMovies.length} sample movies`);
    
    // Create indexes
    await Movie.collection.createIndex({ title: 'text', plot: 'text' });
    console.log('🔍 Created text search indexes');
    
    console.log('✅ Database seeded successfully!');
    console.log('📊 Sample data ready for testing');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
