@echo off
title AURA ERP + D2C System
color 0A

echo.
echo  ==============================================
echo          AURA PLATFORM - LOCAL LAUNCHER        
echo  ==============================================
echo.
echo  Starting API, Store, and Admin Portal...
echo.

cd /d "%~dp0"

:: Start all servers in one process using concurrently
call npx -y concurrently "npm run dev --prefix api" "npm run dev --prefix store" "npm run dev --prefix admin"

pause
