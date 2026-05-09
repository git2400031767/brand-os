@echo off
echo.
echo  Starting Brand OS...
echo.

echo  Installing backend dependencies...
cd backend
call npm install --silent
cd ..

echo  Installing frontend dependencies...
cd frontend
call npm install --silent
cd ..

echo.
echo  Starting backend on http://localhost:3001 ...
start "Brand OS - Backend" cmd /k "cd backend && npm start"

timeout /t 2 /nobreak > NUL

echo  Starting frontend on http://localhost:3000 ...
start "Brand OS - Frontend" cmd /k "cd frontend && npm start"

echo.
echo =========================================
echo   Brand OS is starting!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:3001
echo   Close both terminal windows to stop.
echo =========================================
echo.
pause
