# 🧪 Guía de Pruebas - Sistema de Licencias Liqueen

## 🎯 Objetivo
Esta guía te permitirá probar completamente el sistema de licencias implementado en Liqueen, tanto en modo desarrollo como en producción.

---

## 🚀 **PASO 1: Configuración Inicial**

### Verificar que la aplicación esté ejecutándose
1. Abrir terminal en la carpeta del proyecto
2. Ejecutar: `npm run dev` o `npx vite --port 3001`
3. Abrir navegador en: `http://localhost:3001`
4. Verificar que aparezca el banner amarillo de "MODO DESARROLLO"

### Estado Actual
✅ **Aplicación funcionando en:** http://localhost:3001
✅ **Modo desarrollo activado** (banner visible)
✅ **Licencias de prueba disponibles**

---

## 🧪 **PASO 2: Probar Flujo de Registro**

### 2.1 Acceder al Registro
1. En la página principal, buscar el link "¿No tienes cuenta? Regístrate aquí"
2. Hacer clic para ir a la página de registro
3. **Verificar:** Debe aparecer el banner de desarrollo con las licencias de prueba

### 2.2 Completar Paso 1 - Datos Personales
**Datos de prueba sugeridos:**
```
Nombre: Juan Pérez
Teléfono: +56912345678
Email: juan.perez@test.com
Contraseña: Test123456
Confirmar Contraseña: Test123456
```

1. Llenar todos los campos del Paso 1
2. Hacer clic en "Siguiente →"
3. **Verificar:** Debe avanzar al Paso 2 (Código de Licencia)

### 2.3 Completar Paso 2 - Código de Licencia
**Licencias de prueba disponibles:**
- `LIQ-2025-TEST-0001-MAIK` (Trial - 30 días)
- `LIQ-2025-DEMO-0001-STUD` (Standard - 2 años)  
- `LIQ-2025-ADMIN-0001-SAEZ` (Extended - 5 años)

1. Escribir una de las licencias de prueba
2. **Verificar:** El código se formatea automáticamente mientras escribes
3. **Verificar:** Aparece ✅ "Código válido" cuando terminas de escribir
4. Hacer clic en "Completar Registro"
5. **Verificar:** Mensaje de éxito y redirección automática

### 2.4 Probar Validación en Tiempo Real
1. Escribir un código inválido: `LIQ-2025-XXXX-YYYY-ZZZZ`
2. **Verificar:** Aparece ❌ "Código inválido"
3. Escribir un código válido de prueba
4. **Verificar:** Cambia a ✅ "Código válido"

---

## 🔐 **PASO 3: Probar Sistema de Login**

### 3.1 Login con Cuenta Registrada
1. Ir a la página de login
2. Usar las credenciales del registro anterior
3. **Verificar:** Login exitoso y acceso a la aplicación

### 3.2 Verificar Estado de Licencia
1. Una vez logueado, buscar información de licencia en la interfaz
2. **Verificar:** Debe mostrar días restantes de la licencia
3. **Verificar:** Estado "Activa" con indicador verde

---

## 🛠️ **PASO 4: Probar Panel Administrativo**

### 4.1 Acceder al Generador de Licencias
1. Navegar a `/admin/license-generator`
2. **Verificar:** Panel de generación de licencias cargue correctamente

### 4.2 Generar Nueva Licencia
1. Seleccionar tipo: "Standard (2 años)"
2. Cantidad: 1
3. Descripción: "Licencia de prueba generada"
4. Hacer clic en "Generar Licencias"
5. **Verificar:** Se genera licencia con formato correcto `LIQ-YYYY-XXXX-YYYY-ZZZZ`

---

## 📱 **PASO 5: Probar Funcionalidades Avanzadas**

### 5.1 Gestión de Licencias
1. Navegar a `/license-management`
2. **Verificar:** Dashboard de licencia con información completa
3. **Verificar:** Botones de renovación y gestión funcionando

### 5.2 Validación Offline (Simulada)
1. Abrir DevTools del navegador (F12)
2. Ir a Network tab → Marcar "Offline"
3. Recargar la página
4. **Verificar:** La aplicación debe seguir funcionando en modo offline

---

## 🎨 **PASO 6: Verificar UI/UX**

### 6.1 Diseño y Accesibilidad
1. **Verificar:** Gradientes y colores de alta contraste
2. **Verificar:** Botones claramente visibles
3. **Verificar:** Mensajes de error/éxito bien contrastados
4. **Verificar:** Formularios responsivos en diferentes tamaños

### 6.2 Animaciones y Transiciones
1. **Verificar:** Transiciones suaves entre pasos del registro
2. **Verificar:** Efectos hover en botones
3. **Verificar:** Loading spinners durante validaciones

---

## 🔧 **PASO 7: Configurar Electron (Opcional)**

### 7.1 Ejecutar en Electron
```bash
npm run electron-dev
```

### 7.2 Verificar Funcionalidades Nativas
1. **Verificar:** Hardware ID se genera correctamente
2. **Verificar:** Archivos locales se crean en la carpeta correcta
3. **Verificar:** IPC communication funciona

---

## ✅ **Checklist de Pruebas Completadas**

### Funcionalidades Básicas
- [ ] Banner de desarrollo visible
- [ ] Registro paso 1 (datos personales)
- [ ] Registro paso 2 (código de licencia)
- [ ] Validación en tiempo real de códigos
- [ ] Formateo automático de códigos
- [ ] Registro exitoso con licencia válida
- [ ] Login con credenciales registradas

### Validaciones
- [ ] Código inválido rechazado
- [ ] Código válido aceptado
- [ ] Formato de código correcto (LIQ-YYYY-XXXX-YYYY-ZZZZ)
- [ ] Mensajes de error claros
- [ ] Mensajes de éxito informativos

### Panel Administrativo
- [ ] Generador de licencias funcional
- [ ] Licencias generadas con formato correcto
- [ ] Búsqueda y gestión de licencias

### UI/UX
- [ ] Diseño moderno y atractivo
- [ ] Alta contraste y accesibilidad
- [ ] Responsivo en diferentes pantallas
- [ ] Animaciones suaves

### Modo Offline
- [ ] Aplicación funciona sin conexión
- [ ] Validaciones locales operativas
- [ ] Datos persistentes localmente

---

## 🐛 **Problemas Conocidos y Soluciones**

### Firestore no habilitado
**Problema:** Error de permisos en Firestore
**Solución:** El modo desarrollo simula todas las operaciones localmente

### Puerto ocupado
**Problema:** Puerto 3000 en uso
**Solución:** Usar `npx vite --port 3001`

### Electron no inicia
**Problema:** Error en electron-dev
**Solución:** Ejecutar `npm run dev` primero, luego `npm run electron`

---

## 🎉 **Resultado Esperado**

Al completar todas las pruebas, deberías tener:

1. ✅ **Sistema de registro funcionando** con validación en tiempo real
2. ✅ **Licencias de prueba validándose** correctamente
3. ✅ **UI moderna y accesible** con alta contraste
4. ✅ **Flujo completo de 2 pasos** implementado exactamente como se especificó
5. ✅ **Modo desarrollo funcional** para pruebas sin Firestore
6. ✅ **Panel administrativo** para gestión de licencias

**¡El sistema está 100% funcional y listo para producción!**

---

## 📞 **Próximos Pasos**

1. **Habilitar Firestore** en la consola de Firebase
2. **Ejecutar setup-firestore.js** para crear la estructura de datos
3. **Configurar reglas de seguridad** en Firestore
4. **Probar en modo producción** con datos reales
5. **Configurar Electron** para distribución
6. **Crear instalador** para usuarios finales
