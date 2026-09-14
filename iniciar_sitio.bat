@echo off
title Servidor Seguridad SALT
echo ==========================================
echo    INICIANDO SITIO WEB - SEGURIDAD SALT
echo ==========================================
echo.
echo Abriendo servidor local en http://localhost:8088/ ...
start http://localhost:8088/
node server.js
pause
