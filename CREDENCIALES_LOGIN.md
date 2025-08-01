# 🔐 Credenciales de Login - Generador de Liquidaciones

## 🔥 **Firebase Authentication**

El sistema ahora utiliza **Firebase Authentication** para la gestión de usuarios. Las credenciales están configuradas en el proyecto Firebase "Liqueen".

### **👤 Usuario Principal**

- **Email**: `maikostudios@gmail.com`
- **Contraseña**: `123456$`
- **Rol**: Usuario principal del sistema
- **Estado**: Activo en Firebase

---

## 🚀 **Cómo Iniciar Sesión**

### **Paso 1: Abrir la Aplicación**

1. Ejecuta la aplicación con `npm run electron-dev`
2. Se abrirá la ventana de login automáticamente

### **Paso 2: Ingresar Credenciales Firebase**

1. Ingresa el email: `maikostudios@gmail.com`
2. Ingresa la contraseña: `123456$`
3. Opcionalmente marca "Recordarme" para mantener la sesión

### **Paso 3: Acceder al Sistema**

1. Haz clic en "Iniciar Sesión"
2. Firebase autenticará las credenciales
3. El sistema te redirigirá automáticamente a la aplicación principal
4. Verás tu información de usuario en la esquina superior derecha

---

## ⚙️ **Configuración del Sistema de Autenticación**

### **Firebase Configuration**

- **Proyecto**: `liqueen`
- **Auth Domain**: `liqueen.firebaseapp.com`
- **Región**: Global
- **Persistencia**: Habilitada con `browserLocalPersistence`

### **Funcionalidades de Firebase**

- ✅ **Autenticación por email/contraseña**
- ✅ **Persistencia de sesión automática**
- ✅ **Sincronización de datos de usuario**
- ✅ **Gestión de perfiles de usuario**
- ✅ **Firestore para almacenamiento de datos**

---

## 🛠️ **Configuración Automática**

Al iniciar sesión con credenciales de desarrollo, se configuran automáticamente:

### **👤 Perfil de Usuario**

- **Nombre**: Basado en el email (ej: "Admin" para admin@liquidaciones.com)
- **Empresa**: "Empresa Demo"
- **Plan**: Trial
- **Estado de Licencia**: Activa

### **⚙️ Configuraciones**

- **Modo Oscuro**: Desactivado
- **Notificaciones**: Activadas
- **Guardado Automático**: Activado
- **Idioma**: Español

### **📊 Licencia**

- **Tipo**: Trial
- **Estado**: Activa
- **Días Restantes**: 30
- **Uso Offline**: 0 días usados

---

## 🔄 **Persistencia de Sesión**

### **Recordar Sesión (Checkbox Marcado)**

- La sesión se guarda en localStorage
- No necesitas volver a iniciar sesión al cerrar/abrir la app
- Los datos se mantienen entre sesiones

### **Sesión Temporal (Checkbox Desmarcado)**

- La sesión se mantiene solo mientras la app esté abierta
- Al cerrar la app, deberás volver a iniciar sesión

---

## 🚪 **Cerrar Sesión**

Para cerrar sesión:

1. **Haz clic en tu nombre** en el header superior derecho
2. **Selecciona "Cerrar Sesión"**
3. **Serás redirigido** de vuelta al login

---

## 🔧 **Para Desarrolladores**

### **Agregar Nuevas Credenciales**

Las credenciales están definidas en `src/stores/authStore.js` en el método `login()`:

```javascript
const devCredentials = [
  { email: "admin@liquidaciones.com", password: "admin123" },
  { email: "demo@liquidaciones.com", password: "demo123" },
  { email: "test@liquidaciones.com", password: "test123" },
  { email: "usuario@liquidaciones.com", password: "usuario123" },
];
```

### **Configurar Firebase Real**

Para usar Firebase en producción:

1. Actualiza las credenciales en `src/services/firebase.js`
2. Reemplaza las claves de ejemplo con las reales de tu proyecto Firebase
3. Las credenciales de desarrollo seguirán funcionando como fallback

---

## 🎊 **¡Listo para Usar!**

**La aplicación está completamente funcional con el sistema de autenticación implementado.**

### **Próximos Pasos Recomendados:**

1. **Inicia sesión** con cualquier credencial de arriba
2. **Explora las funcionalidades** de la aplicación
3. **Prueba la generación de PDFs** en las diferentes pestañas
4. **Configura las opciones** usando el botón ⚙️ en el header
5. **Experimenta con los datos** de ejemplo incluidos

---

**¡Disfruta usando el Generador de Liquidaciones! 🚀**
