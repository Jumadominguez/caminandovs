# 🚀 Scripts de Automatización

## ✅ Estado Actual
- ✅ **Script funcionando correctamente**
- ✅ **Servidor funcionando en `http://localhost:3000`**
- ✅ **Puertos 3000 y 5000 limpios**
- ✅ **Navegador integrado abierto**

## Problema Recurrente
Los puertos 3000 y 5000 pueden quedar ocupados por procesos anteriores, causando que la aplicación aparezca en blanco.

## Soluciones Automatizadas

### Opción 1: Script de PowerShell (Recomendado)
```bash
# Reiniciar servidor completo (limpia puertos + inicia frontend)
npm run restart

# Solo limpiar puertos sin reiniciar
.\restart-server.ps1 -CleanOnly

# Reiniciar solo frontend
npm run restart:frontend
```

### Opción 2: Script Batch (.bat)
```bash
# Ejecutar directamente
restart-server.bat
```

### Opción 3: Manual
```bash
# Verificar procesos en puertos
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

# Detener procesos manualmente
Stop-Process -Id <PID> -Force

# Iniciar servidor
cd frontend && npm run dev
```

## ¿Qué hace el script automatizado?

1. **Detecta procesos** usando los puertos 3000 y 5000
2. **Detiene procesos** de forma segura
3. **Espera** a que se liberen los puertos
4. **Inicia** el servidor del frontend automáticamente

## Notas Importantes
- **Emojis removidos**: Se eliminaron los emojis del script para evitar problemas de parsing en PowerShell
- **Compatibilidad**: El script funciona en Windows PowerShell y PowerShell Core
- **Ejecución**: Usar `.\restart-server.ps1` para ejecutar desde el directorio del proyecto
