@echo off
echo ========================================
echo   GENERADOR DE LIQUIDACIONES v2.0
echo ========================================
echo.

echo [1/2] Construyendo la aplicacion...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Fallo en el build de la aplicacion
    echo Presiona cualquier tecla para salir.
    pause >nul
    exit /b 1
)

echo.
echo [2/2] Iniciando aplicacion Electron...
echo.
echo NOTA: Si aparecen errores de Firestore en la consola,
echo       estos no afectan la funcionalidad de autenticacion.
echo.
call npx electron .

echo.
echo ========================================
echo   Aplicacion cerrada
echo ========================================
pause
