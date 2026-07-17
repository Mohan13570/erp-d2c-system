@echo off
title LIZOME - Shutdown
color 0C

echo.
echo  Stopping all LIZOME servers...
echo.

taskkill /FI "WINDOWTITLE eq LIZOME API Server*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq LIZOME Customer Store*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq LIZOME Admin Portal*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Tunnel - Store*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Tunnel - Admin*" /T /F >nul 2>&1

echo.
echo  All LIZOME servers stopped.
echo.
pause
