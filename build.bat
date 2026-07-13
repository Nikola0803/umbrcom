@echo off
cd /d "%~dp0"
echo Building project...
call npm run build
echo.
echo Build complete! The dist folder is ready.
echo Drag the dist folder onto your Netlify site to deploy.
pause
