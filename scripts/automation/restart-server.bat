@echo off
echo Limpiando puertos y reiniciando servidor...

REM Detener procesos que usan los puertos 3000 y 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    if not "%%a"=="0" (
        echo Deteniendo proceso %%a en puerto 3000
        taskkill /PID %%a /F >nul 2>&1
    )
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    if not "%%a"=="0" (
        echo Deteniendo proceso %%a en puerto 5000
        taskkill /PID %%a /F >nul 2>&1
    )
)

REM Esperar un momento para que los puertos se liberen
timeout /t 2 /nobreak >nul

REM Iniciar el servidor del frontend
cd frontend
echo Iniciando servidor del frontend...
npm run dev
