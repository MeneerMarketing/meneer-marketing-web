@echo off
title LGE Dashboard — reset
cd /d "%~dp0"
echo.
echo  Cache legen + dashboard opnieuw starten...
echo.
call npm run clean
echo.
echo  Dashboard: http://localhost:3000/dashboard
echo  Sluit dit venster om te stoppen.
echo.
npm run dev
