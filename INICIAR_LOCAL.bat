@echo off
cd /d "%~dp0"
echo Instalando dependencias...
call npm install
echo.
echo Abrindo Sistema Integrado Sulnet em http://localhost:3000
start "" "http://localhost:3000"
call npm start
pause
