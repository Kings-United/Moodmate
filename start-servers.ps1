Write-Host "Starting MoodMate Application..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Set-Location Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal
Set-Location ..

Write-Host ""
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Set-Location Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -WindowStyle Normal
Set-Location ..

Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check the console windows for any errors." -ForegroundColor Yellow
Read-Host "Press Enter to continue..."
