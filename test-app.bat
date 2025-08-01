@echo off
echo ========================================
echo    PROBANDO GENERADOR DE LIQUIDACIONES
echo ========================================
echo.

echo 🔨 Construyendo aplicacion...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Error en el build
    pause
    exit /b 1
)

echo.
echo ✅ Build exitoso
echo.
echo 🚀 Iniciando Electron...
echo.
echo INSTRUCCIONES DE PRUEBA COMPLETA:
echo.
echo 📋 PESTAÑAS A PROBAR:
echo 1. 📝 FORMULARIO - Completa manualmente y genera PDF
echo 2. 📂 SUBIR JSON - Carga test-liquidacion.json y genera PDF
echo 3. ✏️ PEGAR JSON - Pega contenido JSON y genera PDF
echo 4. 📤 CARGAR Y EDITAR - Carga JSON, edita y genera PDF
echo 5. 📊 CARGA MASIVA - Carga Excel y genera multiples PDFs
echo.
echo 🖼️ LOGO:
echo - Prueba drag ^& drop de imagenes en todas las pestañas
echo - Verifica que aparezca en los PDFs generados
echo.
echo 📁 VERIFICACIONES:
echo - Todos los PDFs deben guardarse en: D:\liquidaciones_jeje\1
echo - Cada pestaña debe tener boton "Generar Liquidacion" (excepto Carga Masiva)
echo - Los logos deben aparecer en todos los PDFs
echo.

start npx electron .

echo.
echo 📁 Abriendo carpeta de destino...
start "" "D:\liquidaciones_jeje\1"

echo.
echo 📄 Abriendo archivo JSON de prueba...
start notepad "test-liquidacion.json"

echo.
echo ✅ Aplicacion iniciada. Revisa las ventanas abiertas.
echo 🔍 Sigue las instrucciones de prueba mostradas arriba.
pause
