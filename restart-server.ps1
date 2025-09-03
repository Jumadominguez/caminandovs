param(
    [switch]$Force,
    [switch]$CleanOnly
)

Write-Host "Limpiando puertos y reiniciando servidor..." -ForegroundColor Cyan

# Función para limpiar un puerto específico
function Clear-Port {
    param([int]$Port)

    Write-Host "Verificando puerto $Port..." -ForegroundColor Yellow

    # Obtener procesos que usan el puerto
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    $processes = $connections | Where-Object { $_.OwningProcess -ne 0 } | Select-Object -Unique OwningProcess

    if ($processes) {
        foreach ($process in $processes) {
            $pid = $process.OwningProcess
            try {
                $processInfo = Get-Process -Id $pid -ErrorAction SilentlyContinue
                if ($processInfo) {
                    Write-Host "Deteniendo proceso $($processInfo.ProcessName) (PID: $pid) en puerto $Port" -ForegroundColor Red
                    Stop-Process -Id $pid -Force
                }
            } catch {
                Write-Host "No se pudo detener el proceso $pid" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "Puerto $Port esta libre" -ForegroundColor Green
    }
}

# Limpiar puertos
Clear-Port 3000
Clear-Port 5000

# Esperar a que se liberen los puertos
Start-Sleep -Seconds 2

if (-not $CleanOnly) {
    Write-Host "Iniciando servidor del frontend..." -ForegroundColor Green

    # Cambiar al directorio del frontend
    Set-Location "$PSScriptRoot\frontend"

    # Iniciar el servidor
    npm run dev
}

Write-Host "Proceso completado" -ForegroundColor Green
