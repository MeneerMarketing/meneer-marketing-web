@echo off
title LGE Dashboard
cd /d "%~dp0"
echo.
echo  Local Growth Engine
echo  Map: %CD%
echo  Dashboard: http://localhost:3000/dashboard
echo.
echo  Werkt het niet? Dubbelklik RESET-DASHBOARD.bat
echo  Sluit dit venster om te stoppen.
echo.
npm run dev
