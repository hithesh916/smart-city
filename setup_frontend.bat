@echo off
REM Setup frontend dependencies
cd /d "%~dp0\frontend"

echo Installing npm packages...
npm install


necho Frontend ready. Run "npm run dev" to start the development server.