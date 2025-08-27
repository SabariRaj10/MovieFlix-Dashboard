# 🎬 MovieFlix Dashboard

A full-stack web application for discovering, searching, and exploring movies with comprehensive statistics and data visualization.

## Features

- **Movie Discovery**: Browse and search through an extensive movie database
- **Advanced Search**: Search by title, genre, year, and rating with real-time filtering
- **Interactive Statistics**: Visualize movie data with charts and analytics
- **Dark/Light Mode**: Toggle between themes for better user experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Authentication**: Secure login system with JWT tokens
- **Data Caching**: Local database caching with OMDb API integration
- **CSV Export**: Download movie data for offline analysis
- **Modern UI**: Beautiful interface built with Tailwind CSS

## Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Vite.js** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icons
- **Chart.js** - Interactive data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Axios** - HTTP client for API calls

### External APIs
- **OMDb API** - Open Movie Database for movie information
- **TMDB API** - The Movie Database (alternative data source)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/MovieFlix-Dashboard.git
   cd MovieFlix-Dashboard
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both backend and frontend directories:

   **Backend (.env)**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/movieflix
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movieflix
   JWT_SECRET=your-super-secret-jwt-key-here
   OMDB_API_KEY=your-omdb-api-key-here
   TMDB_API_KEY=your-tmdb-api-key-here
   NODE_ENV=development
   ```

   **Frontend (.env)**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_OMDB_API_KEY=your-omdb-api-key-here
   ```

4. **Get API Keys**
   
   - **OMDb API**: Visit [OMDb API](http://www.omdbapi.com/apikey.aspx) to get a free API key
   - **TMDB API**: Visit [TMDB API](https://www.themoviedb.org/settings/api) to get a free API key

5. **Start the application**
   ```bash
   # Start backend (in backend directory)
   npm run dev
   
   # Start frontend (in frontend directory, new terminal)
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔐 Demo Credentials

For testing purposes, use these demo credentials:
- **Username**: `admin`
- **Password**: `admin123`

## 📁 Project Structure

```
MovieFlix-Dashboard/
├── backend/                 # Backend server
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   ├── .env              # Environment variables
│   └── server.js         # Server entry point
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── services/     # API services
│   │   ├── utils/        # Utility functions
│   │   └── App.jsx       # Main app component
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── README.md             # Project documentation
└── .gitignore           # Git ignore file
```



## 🔧 Available Scripts

### Backend
```bash
npm run dev          # Start development server
npm start           # Start production server
npm run test        # Run tests
```

### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/search` - Search movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies/cache` - Cache movie from OMDb API

### Statistics
- `GET /api/stats` - Get movie statistics
- `GET /api/stats/genres` - Get genre distribution
- `GET /api/stats/ratings` - Get rating statistics

## 🎯 Features in Detail

### Dashboard
- Movie grid with search and filtering
- Statistics cards showing key metrics
- Responsive design for all devices
- Dark/light mode toggle

### Statistics Page
- Interactive pie chart for genre distribution
- Bar chart for rating analysis
- Line chart for runtime trends
- Export functionality for data analysis

### Search & Filtering
- Real-time search with OMDb API integration
- Filter by genre, year, rating
- Sort by various criteria
- Pagination for large result sets



## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


