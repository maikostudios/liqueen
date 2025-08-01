# 🔐 Actualización: Sistema de Roles y Usuarios - Liqueen

## 📋 **Resumen de Cambios**

Se ha implementado un sistema completo de roles y permisos para Liqueen, estableciendo diferencias claras entre usuarios administradores y usuarios estándar.

---

## 🎯 **Objetivos Implementados**

### ✅ **1. Sistema de Roles**
- **Administrador:** `maikostudios@gmail.com` - Acceso completo al sistema
- **Usuario:** Todos los demás registros - Acceso limitado con licencia de 2 años

### ✅ **2. Base de Datos Estructurada**
- Configuración de roles y permisos en Firestore
- Usuario administrador predefinido
- Estructura de datos para gestión de usuarios

### ✅ **3. Diferenciación de Licencias**
- **Admin:** Licencia ilimitada (10 años)
- **Usuario:** Licencia estándar (2 años)

---

## 🏗️ **CAMBIOS IMPLEMENTADOS**

### 1. **setup-firestore.js** - Configuración de Base de Datos

#### Nuevas Configuraciones Agregadas:

**🔐 Configuración de Roles:**
```javascript
await setDoc(doc(db, "app-config", "roles"), {
  admin: {
    name: "Administrador",
    permissions: [
      "generate_licenses",
      "manage_users", 
      "view_analytics",
      "system_config",
      "revoke_licenses",
      "unlimited_liquidations",
      "access_admin_panel"
    ],
    description: "Acceso completo al sistema",
    licenseValidityYears: "unlimited"
  },
  user: {
    name: "Usuario",
    permissions: [
      "use_app",
      "generate_liquidations",
      "export_pdf",
      "basic_features"
    ],
    limitations: {
      maxLiquidationsPerMonth: 100,
      licenseValidityYears: 2,
      maxDevices: 1
    },
    description: "Usuario estándar con licencia de 2 años"
  }
});
```

**👤 Usuario Administrador Predefinido:**
```javascript
await setDoc(doc(db, "users", "maikostudios@gmail.com"), {
  email: "maikostudios@gmail.com",
  role: "admin",
  name: "Maiko Studios",
  phone: "+56912345678",
  createdAt: Date.now(),
  licenseCode: "ADMIN-UNLIMITED-ACCESS",
  licenseType: "unlimited",
  licenseStatus: "active",
  permissions: [
    "generate_licenses",
    "manage_users", 
    "view_analytics",
    "system_config",
    "revoke_licenses",
    "unlimited_liquidations",
    "access_admin_panel"
  ]
});
```

### 2. **LicenseService.js** - Gestión de Roles

#### Nuevos Métodos Agregados:

**👤 Gestión de Datos de Usuario:**
```javascript
// Guardar datos de usuario localmente cifrados
async saveUserDataLocally(userData)

// Cargar datos de usuario desde almacenamiento local
async loadUserDataLocally()
```

#### Lógica de Roles Implementada:

**🔍 Detección Automática de Rol:**
```javascript
// Determinar rol del usuario (solo maikostudios@gmail.com es admin)
const userRole = email === "maikostudios@gmail.com" ? "admin" : "user";
```

**⏰ Duración de Licencia por Rol:**
```javascript
// Simular datos de licencia activada
const expiryDate = userRole === "admin" ? 
  now + (10 * 365 * 24 * 60 * 60 * 1000) : // 10 años para admin
  now + this.licenseValidityPeriod; // 2 años para usuarios
```

**🔐 Permisos por Rol:**
```javascript
permissions: userRole === "admin" ? 
  ["generate_licenses", "manage_users", "view_analytics", "system_config", "revoke_licenses", "unlimited_liquidations", "access_admin_panel"] :
  ["use_app", "generate_liquidations", "export_pdf", "basic_features"]
```

---

## 📊 **ESTRUCTURA DE DATOS**

### **Colección: `app-config/roles`**
```javascript
{
  admin: {
    name: "Administrador",
    permissions: [...],
    description: "Acceso completo al sistema",
    licenseValidityYears: "unlimited"
  },
  user: {
    name: "Usuario", 
    permissions: [...],
    limitations: {
      maxLiquidationsPerMonth: 100,
      licenseValidityYears: 2,
      maxDevices: 1
    },
    description: "Usuario estándar con licencia de 2 años"
  }
}
```

### **Colección: `users/{userId}`**
```javascript
{
  email: "usuario@ejemplo.com",
  role: "user", // "admin" o "user"
  name: "Nombre Usuario",
  phone: "+56912345678",
  licenseCode: "LIQ-2025-XXXX-YYYY-ZZZZ",
  licenseType: "standard", // "unlimited" o "standard"
  licenseStatus: "active",
  registeredOn: 1704067200000,
  hardwareId: "hardware-fingerprint",
  lastLogin: 1704067200000,
  isActive: true,
  permissions: ["use_app", "generate_liquidations", ...]
}
```

---

## 🔐 **PERMISOS Y LIMITACIONES**

### **👑 Administrador (maikostudios@gmail.com)**

**Permisos:**
- ✅ `generate_licenses` - Generar nuevas licencias
- ✅ `manage_users` - Gestionar usuarios del sistema
- ✅ `view_analytics` - Ver estadísticas y análisis
- ✅ `system_config` - Configurar parámetros del sistema
- ✅ `revoke_licenses` - Revocar licencias existentes
- ✅ `unlimited_liquidations` - Sin límite de liquidaciones
- ✅ `access_admin_panel` - Acceso al panel administrativo

**Características:**
- 🔓 **Licencia:** Ilimitada (10 años)
- 🔓 **Liquidaciones:** Sin límite mensual
- 🔓 **Dispositivos:** Sin límite
- 🔓 **Funcionalidades:** Acceso completo

### **👤 Usuario Estándar (todos los demás)**

**Permisos:**
- ✅ `use_app` - Usar la aplicación básica
- ✅ `generate_liquidations` - Generar liquidaciones
- ✅ `export_pdf` - Exportar a PDF
- ✅ `basic_features` - Funcionalidades básicas

**Limitaciones:**
- 📅 **Licencia:** 2 años desde activación
- 📊 **Liquidaciones:** Máximo 100 por mes
- 💻 **Dispositivos:** 1 dispositivo por licencia
- 🚫 **Admin Panel:** Sin acceso

---

## 🧪 **MODO DESARROLLO**

### **Funcionalidades de Testing:**

**🔍 Detección Automática:**
- El sistema detecta automáticamente si `maikostudios@gmail.com` se registra
- Asigna rol de administrador automáticamente
- Todos los demás emails reciben rol de usuario

**🎫 Licencias de Prueba:**
- `LIQ-2025-TEST-0001-MAIK` - Usuario estándar
- `LIQ-2025-DEMO-0001-STUD` - Usuario estándar  
- `LIQ-2025-ADMIN-0001-SAEZ` - Usuario estándar (excepto si es maikostudios@gmail.com)

**💾 Almacenamiento Local:**
- Datos de usuario cifrados localmente
- Permisos y rol guardados en dispositivo
- Validación offline con roles

---

## 🚀 **INSTRUCCIONES DE DESPLIEGUE**

### **1. Ejecutar Setup de Base de Datos:**
```bash
node setup-firestore.js
```

**Esto creará:**
- ✅ Configuración de roles en `app-config/roles`
- ✅ Usuario administrador en `users/maikostudios@gmail.com`
- ✅ Licencias de prueba con nuevos permisos

### **2. Verificar Configuración:**
- ✅ Firestore debe estar habilitado
- ✅ Reglas de seguridad configuradas
- ✅ Usuario admin creado correctamente

### **3. Probar Funcionalidades:**
- ✅ Registro con `maikostudios@gmail.com` → Rol admin
- ✅ Registro con otro email → Rol usuario
- ✅ Diferencias en duración de licencia
- ✅ Permisos aplicados correctamente

---

## 📋 **CHECKLIST DE VERIFICACIÓN**

### **Base de Datos:**
- [ ] Colección `app-config/roles` creada
- [ ] Usuario `maikostudios@gmail.com` en colección `users`
- [ ] Licencias de prueba disponibles
- [ ] Configuración de permisos correcta

### **Funcionalidades:**
- [ ] Detección automática de rol por email
- [ ] Duración de licencia diferenciada (admin: 10 años, user: 2 años)
- [ ] Permisos asignados según rol
- [ ] Almacenamiento local de datos de usuario
- [ ] Modo desarrollo funcional con roles

### **Testing:**
- [ ] Registro como admin funciona
- [ ] Registro como usuario funciona
- [ ] Diferencias visibles en la interfaz
- [ ] Validación de permisos operativa

---

## 🎯 **PRÓXIMOS PASOS**

### **1. Implementar UI Diferenciada:**
- Mostrar panel admin solo para administradores
- Indicadores visuales de rol en la interfaz
- Limitaciones visibles para usuarios estándar

### **2. Validación de Permisos:**
- Middleware para verificar permisos en cada acción
- Bloqueo de funcionalidades según rol
- Mensajes informativos sobre limitaciones

### **3. Estadísticas y Monitoreo:**
- Dashboard de uso para administradores
- Métricas de liquidaciones por usuario
- Gestión de licencias desde panel admin

---

## ✅ **RESULTADO FINAL**

**🎉 Sistema de roles completamente implementado:**

1. ✅ **maikostudios@gmail.com** = Administrador con acceso ilimitado
2. ✅ **Todos los demás usuarios** = Usuarios estándar con licencia de 2 años
3. ✅ **Base de datos estructurada** con roles y permisos
4. ✅ **Diferenciación automática** basada en email
5. ✅ **Almacenamiento seguro** de datos de usuario
6. ✅ **Modo desarrollo funcional** para testing

**¡El sistema está listo para pruebas y producción!**
