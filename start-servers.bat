@echo off
echo Starting MoodMate Application...
echo.

echo Starting Backend Server...
cd Backend
start "Backend Server" cmd /k "npm run dev"
cd ..

echo.
echo Starting Frontend Server...
cd Frontend
start "Frontend Server" cmd /k "npm start"
cd ..

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Check the console windows for any errors.
pause
