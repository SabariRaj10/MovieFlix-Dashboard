# 🖥️ Backend Deployment Guide - MovieFlix Dashboard

This guide will walk you through deploying your backend to production platforms.

## 🚀 **Option 1: Render (Recommended - Free & Easy)**

Render is a modern alternative to Heroku that's completely free and very easy to use.

### **Step 1: Prepare Your Backend**

1. **Ensure your backend structure is correct:**
   ```
   backend/
   ├── package.json          # Dependencies and scripts
   ├── server.js            # Main server file
   ├── routes/              # API route handlers
   ├── models/              # Database models
   ├── middleware/          # Custom middleware
   └── env.example          # Environment template
   ```

2. **Install dependencies locally first:**
   ```bash
   cd backend
   npm install
   ```

3. **Test locally:**
   ```bash
   npm run dev
   # Should start on http://localhost:5000
   ```

### **Step 2: Deploy to Render**

1. **Go to [render.com](https://render.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Configure the service:**
   - **Name**: `movieflix-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

6. **Add Environment Variables:**
   - Click "Environment" tab
   - Add these variables:
     ```
     NODE_ENV=production
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movieflix
     JWT_SECRET=your-super-secret-jwt-key-here
     OMDB_API_KEY=your-actual-omdb-api-key
     ```

7. **Click "Create Web Service"**
8. **Wait for deployment** (usually 2-5 minutes)

### **Step 3: Get Your Backend URL**

- Your backend will be available at: `https://your-service-name.onrender.com`
- Update your frontend environment variables with this URL

## 🎯 **Option 2: Heroku (Alternative)**

### **Step 1: Install Heroku CLI**

```bash
# Windows
winget install --id=Heroku.HerokuCLI

# macOS
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### **Step 2: Deploy to Heroku**

```bash
# Login to Heroku
heroku login

# Create Heroku app
cd backend
heroku create your-movieflix-backend

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key
heroku config:set OMDB_API_KEY=your-omdb-api-key

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Open your app
heroku open
```

## 🌐 **Option 3: Railway (Modern Alternative)**

1. **Go to [railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your repository**
5. **Set Root Directory**: `backend`
6. **Add environment variables**
7. **Deploy automatically**

## 🔧 **Environment Variables Setup**

### **Required Variables:**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movieflix
JWT_SECRET=your-super-secret-jwt-key-here
OMDB_API_KEY=your-actual-omdb-api-key
```

### **Optional Variables:**
```env
TMDB_API_KEY=your-tmdb-api-key
FRONTEND_URL=https://your-frontend-domain.vercel.app
PORT=5000
```

## 🗄️ **MongoDB Atlas Setup (Cloud Database)**

1. **Go to [MongoDB Atlas](https://cloud.mongodb.com)**
2. **Create a free account**
3. **Create a new cluster** (free tier)
4. **Set up database access:**
   - Create a database user with password
   - Remember username and password
5. **Set up network access:**
   - Allow access from anywhere (0.0.0.0/0)
6. **Get connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your values

## 🔐 **API Keys Setup**

### **OMDb API Key:**
1. Visit [OMDb API](http://www.omdbapi.com/apikey.aspx)
2. Request a free API key
3. Add to environment variables

### **TMDB API Key (Optional):**
1. Visit [TMDB](https://www.themoviedb.org/settings/api)
2. Create account and request API key
3. Add to environment variables

## 📱 **Post-Deployment Checklist**

- [ ] Backend is accessible at your URL
- [ ] Health check endpoint works (`/health`)
- [ ] API endpoints are responding
- [ ] Database connection is established
- [ ] Environment variables are properly set
- [ ] CORS is configured for your frontend domain
- [ ] Rate limiting is working
- [ ] Error handling is functional

## 🐛 **Common Issues & Solutions**

### **1. Build Failures**
- **Issue**: Dependencies not installing
- **Solution**: Check `package.json` and ensure all dependencies are listed

### **2. Database Connection Errors**
- **Issue**: MongoDB connection failing
- **Solution**: 
  - Verify MongoDB URI is correct
  - Check network access settings in Atlas
  - Ensure username/password are correct

### **3. CORS Errors**
- **Issue**: Frontend can't access backend
- **Solution**: Update CORS origins in `server.js` with your frontend URL

### **4. Environment Variables Not Working**
- **Issue**: Variables not being read
- **Solution**: 
  - Ensure variables are set in your hosting platform
  - Check variable names match exactly
  - Restart the service after adding variables

## 🔄 **Update Frontend After Backend Deployment**

1. **Get your backend URL** (e.g., `https://your-backend.onrender.com`)
2. **Update frontend environment variables:**
   ```env
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```
3. **Redeploy frontend** or update environment variables in Vercel/Netlify

## 📊 **Monitoring Your Backend**

### **Render:**
- Built-in logs and metrics
- Automatic restarts on crashes
- Performance monitoring

### **Heroku:**
- Heroku logs: `heroku logs --tail`
- Heroku metrics dashboard
- Add-ons for monitoring

### **Railway:**
- Built-in logging
- Performance metrics
- Automatic scaling

## 🎉 **Congratulations!**

Your backend is now deployed and accessible worldwide!

### **Next Steps:**
1. **Test all API endpoints**
2. **Update frontend with new backend URL**
3. **Test full application functionality**
4. **Monitor performance and logs**
5. **Set up alerts for any issues**

---

**Need help?** Check the troubleshooting section or create an issue in your repository!
