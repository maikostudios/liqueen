# 💼 Liqueen - Generador Profesional de Liquidaciones

<div align="center">

![Liqueen Logo](src/img/logos/liqueen_logo_sin_fondo.png)

**Sistema de escritorio para la generación automatizada de liquidaciones de sueldo chilenas**

[![Version](https://img.shields.io/badge/version-2.2.0-blue.svg)](https://github.com/maikostudios/liqueen)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-green.svg)](https://vuejs.org/)
[![Electron](https://img.shields.io/badge/Electron-25.x-blue.svg)](https://electronjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.x-orange.svg)](https://firebase.google.com/)

</div>

## 🚀 Características Principales

### ✨ **Sistema de Licencias Robusto**
- 🔐 **Validación híbrida online/offline** con Firebase + validación local
- 🔑 **Credenciales maestras** para acceso de emergencia
- 🛡️ **Cifrado AES-256** de licencias con hardware binding
- 📊 **Logging avanzado** categorizado con rotación automática

### 🎨 **UI/UX Moderna**
- 🌙 **Modo día/noche** completo con persistencia local
- 🎯 **Branding profesional** Liqueen con logos oficiales
- 📱 **Diseño responsive** optimizado sin scroll
- ♿ **Alto contraste WCAG AA** para accesibilidad

### 🔧 **Funcionalidades Avanzadas**
- 📄 **Múltiples flujos de entrada**: Formulario, JSON, carga masiva
- 🖨️ **Generación PDF** profesional con logos personalizados
- 💾 **Persistencia local** con cifrado de datos sensibles
- 🔄 **Sincronización automática** con validación de integridad

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Vue.js** | 3.x | Framework frontend reactivo |
| **Electron** | 25.x | Wrapper de aplicación desktop |
| **Firebase** | 10.x | Autenticación y base de datos |
| **Vite** | 4.x | Build system y desarrollo |
| **crypto-js** | 4.x | Cifrado AES-256 y hashing |
| **node-machine-id** | 1.x | Hardware fingerprinting |

## 📦 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git

### Configuración del Proyecto

```bash
# Clonar el repositorio
git clone https://github.com/maikostudios/liqueen.git
cd liqueen

# Instalar dependencias
npm install

# Configurar Firebase (crear archivo de configuración)
cp src/services/firebase.example.js src/services/firebase.js
# Editar firebase.js con tus credenciales

# Desarrollo
npm run dev          # Servidor de desarrollo web
npm run electron-dev # Aplicación Electron en desarrollo

# Producción
npm run build        # Build para web
npm run electron     # Ejecutar Electron
npm run dist         # Crear instalador
```

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

## 🔒 Sistema de Seguridad

### Autenticación
- **Firebase Authentication** para usuarios online
- **Validación local** con hash de contraseñas
- **Credenciales maestras** hardcodeadas para emergencias
- **Tokens de sesión** con expiración automática

### Cifrado de Datos
- **AES-256** para archivos de licencia locales
- **Hardware binding** único por dispositivo
- **MD5 hashing** para credenciales maestras
- **Ofuscación** de datos sensibles en logs

### Licencias
- **Formato**: `LIQ-YYYY-XXXX-YYYY-ZZZZ`
- **Validez**: 2 años para usuarios, ilimitado para admins
- **Binding**: Una licencia por hardware ID
- **Validación**: Online cada 30 días, grace period de 15 días

## 📱 Uso de la Aplicación

### Credenciales Maestras
```
Email: maikostudios@gmail.com
Contraseña: 123456
Permisos: Acceso completo + reset de configuración
```

### Flujos de Trabajo

1. **📝 Formulario Manual**
   - Completar campos de empleador y trabajador
   - Cálculos automáticos de imposiciones
   - Generación PDF instantánea

2. **📂 Carga de JSON**
   - Subir archivo JSON con datos estructurados
   - Validación automática de formato
   - Previsualización antes de generar

3. **📊 Carga Masiva**
   - Procesamiento de múltiples liquidaciones
   - Generación en lote con nombres únicos
   - Progreso en tiempo real

## 🎨 Temas y Personalización

### Sistema de Temas
- **Modo Claro**: Fondo blanco, texto oscuro, gradientes azules
- **Modo Oscuro**: Fondo slate, texto claro, gradientes adaptados
- **Toggle flotante**: Iconos ☀️/🌙 con animaciones
- **Persistencia**: Recuerda preferencias del usuario
- **Detección automática**: Respeta `prefers-color-scheme`

### Personalización
- **Logos**: Configurables en `/src/img/logos/`
- **Colores**: Variables CSS en `/src/assets/styles/main.css`
- **Temas**: Modificables en `ThemeService.js`

## 📊 Logging y Diagnóstico

### Categorías de Logs
- **DEBUG**: Información detallada de desarrollo
- **INFO**: Eventos normales del sistema
- **WARN**: Advertencias que no afectan funcionamiento
- **ERROR**: Errores que requieren atención

### Logs Especializados
- **authLog**: Eventos de autenticación
- **licenseLog**: Gestión de licencias
- **Ofuscación**: Emails parcialmente ocultos por privacidad

## 🤝 Contribución

Este es un proyecto propietario de **Maiko Studios SPA**. Para contribuciones o reportes de bugs, contactar:

- **Email**: contact@maikostudios.com
- **Website**: https://maikostudios.com
- **Soporte**: maikostudios@gmail.com

## 📄 Licencia

© 2025 Maiko Studios SPA. Todos los derechos reservados.

Este software es propietario y está protegido por derechos de autor. El uso, distribución o modificación sin autorización expresa está prohibido.

## 🔄 Changelog

### v2.2.0 - Agosto 2025
- ✅ Sistema de licencias robusto implementado
- ✅ Modo día/noche con persistencia
- ✅ Branding profesional Liqueen
- ✅ Credenciales maestras de emergencia
- ✅ Logging avanzado categorizado
- ✅ UI/UX optimizada sin scroll

### v2.1.0 - Agosto 2025
- ✅ UX/UI rediseñada con alto contraste
- ✅ Sistema de notificaciones mejorado
- ✅ Flujos simplificados
- ✅ Verificación completa de funcionalidades

---

<div align="center">

**Desarrollado con ❤️ por [Maiko Studios](https://maikostudios.com)**

</div>
