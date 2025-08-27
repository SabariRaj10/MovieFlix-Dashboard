@echo off
echo 🎬 Starting MovieFlix Dashboard...
echo.

echo 📱 Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ⏳ Waiting 5 seconds for frontend to start...
timeout /t 5 /nobreak >nul

echo.
echo ⚡ Starting Backend...
start "Backend" cmd /k "cd backend && npm run dev"

echo.
echo 🚀 Both services are starting...
echo 📱 Frontend: http://localhost:5173
echo ⚡ Backend: http://localhost:5000
echo.
echo Press any key to close this window...
pause >nul



