@echo off
title AURA - Shutdown
color 0C

echo.
echo  Stopping all AURA servers...
echo.

taskkill /FI "WINDOWTITLE eq AURA API Server*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq AURA Customer Store*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq AURA Admin Portal*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Tunnel - Store*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Tunnel - Admin*" /T /F >nul 2>&1

echo.
echo  All AURA servers stopped.
echo.
pause
