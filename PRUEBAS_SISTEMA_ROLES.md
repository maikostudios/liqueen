# 🧪 Pruebas del Sistema de Roles - Liqueen

## 🎯 **Objetivo de las Pruebas**
Verificar que el sistema de roles funciona correctamente, diferenciando entre usuarios administradores y usuarios estándar.

---

## 🚀 **ESTADO ACTUAL**
- ✅ **Aplicación ejecutándose:** http://localhost:3001
- ✅ **Modo desarrollo activo** (banner amarillo visible)
- ✅ **Sistema de roles implementado**
- ✅ **Base de datos configurada** (pendiente de ejecutar setup-firestore.js)

---

## 🧪 **PLAN DE PRUEBAS**

### **PRUEBA 1: Registro como Administrador**
**Email a probar:** `maikostudios@gmail.com`

**Pasos:**
1. Ir a http://localhost:3001
2. Hacer clic en "¿No tienes cuenta? Regístrate aquí"
3. **Paso 1 - Datos Personales:**
   ```
   Nombre: Maiko Studios
   Teléfono: +56912345678
   Email: maikostudios@gmail.com
   Contraseña: Admin123456
   Confirmar Contraseña: Admin123456
   ```
4. Hacer clic en "Siguiente →"
5. **Paso 2 - Código de Licencia:**
   ```
   Código: LIQ-2025-ADMIN-0001-SAEZ
   ```
6. Verificar validación en tiempo real
7. Hacer clic en "Completar Registro"

**Resultado Esperado:**
- ✅ Registro exitoso
- ✅ Rol asignado: "admin"
- ✅ Licencia válida por 10 años
- ✅ Permisos completos asignados
- ✅ Mensaje en consola: "Registro simulado exitosamente en modo desarrollo - Rol: admin"

---

### **PRUEBA 2: Registro como Usuario Estándar**
**Email a probar:** `usuario.test@gmail.com`

**Pasos:**
1. Cerrar sesión si está logueado
2. Ir a registro nuevamente
3. **Paso 1 - Datos Personales:**
   ```
   Nombre: Usuario Test
   Teléfono: +56987654321
   Email: usuario.test@gmail.com
   Contraseña: User123456
   Confirmar Contraseña: User123456
   ```
4. Hacer clic en "Siguiente →"
5. **Paso 2 - Código de Licencia:**
   ```
   Código: LIQ-2025-TEST-0001-MAIK
   ```
6. Verificar validación en tiempo real
7. Hacer clic en "Completar Registro"

**Resultado Esperado:**
- ✅ Registro exitoso
- ✅ Rol asignado: "user"
- ✅ Licencia válida por 2 años
- ✅ Permisos limitados asignados
- ✅ Mensaje en consola: "Registro simulado exitosamente en modo desarrollo - Rol: user"

---

### **PRUEBA 3: Verificar Diferencias en Consola**

**Pasos:**
1. Abrir DevTools (F12)
2. Ir a la pestaña "Console"
3. Realizar ambos registros anteriores
4. Observar los mensajes de log

**Resultado Esperado para Admin:**
```
🔍 Validando código de licencia: LIQ-2025-ADMIN-0001-SAEZ
🧪 Modo desarrollo - simulando validación...
📋 Licencia LIQ-2025-ADMIN-0001-SAEZ: VÁLIDA
📝 Iniciando registro de usuario con licencia...
🧪 Modo desarrollo - simulando registro...
👤 Datos de usuario guardados localmente
💾 Licencia guardada localmente
✅ Registro simulado exitosamente en modo desarrollo - Rol: admin
```

**Resultado Esperado para Usuario:**
```
🔍 Validando código de licencia: LIQ-2025-TEST-0001-MAIK
🧪 Modo desarrollo - simulando validación...
📋 Licencia LIQ-2025-TEST-0001-MAIK: VÁLIDA
📝 Iniciando registro de usuario con licencia...
🧪 Modo desarrollo - simulando registro...
👤 Datos de usuario guardados localmente
💾 Licencia guardada localmente
✅ Registro simulado exitosamente en modo desarrollo - Rol: user
```

---

### **PRUEBA 4: Verificar Almacenamiento Local**

**Pasos:**
1. Después de cada registro, abrir DevTools
2. Ir a Application → Local Storage → http://localhost:3001
3. Verificar las claves almacenadas

**Resultado Esperado:**
- ✅ `liqueen_license` - Datos de licencia cifrados
- ✅ `liqueen_user` - Datos de usuario cifrados

**Para verificar contenido (en consola):**
```javascript
// Ver datos de usuario (descifrados automáticamente por el servicio)
const licenseService = new LicenseService();
licenseService.loadUserDataLocally().then(userData => console.log('Usuario:', userData));
licenseService.loadLicenseLocally().then(licenseData => console.log('Licencia:', licenseData));
```

---

### **PRUEBA 5: Validar Códigos Inválidos**

**Pasos:**
1. Intentar registro con código inválido
2. **Código a probar:** `LIQ-2025-INVALID-CODE-XXXX`

**Resultado Esperado:**
- ❌ Validación falla
- ❌ Mensaje: "Código inválido"
- ❌ No permite continuar con el registro

---

### **PRUEBA 6: Verificar Formateo Automático**

**Pasos:**
1. En el campo de código de licencia, escribir lentamente:
2. `liq2025test0001maik`

**Resultado Esperado:**
- ✅ Se formatea automáticamente a: `LIQ-2025-TEST-0001-MAIK`
- ✅ Validación en tiempo real funciona
- ✅ Indicador visual de código válido

---

## 📊 **VERIFICACIÓN DE DATOS**

### **Estructura de Usuario Admin:**
```javascript
{
  uid: "dev-user-[timestamp]",
  email: "maikostudios@gmail.com",
  name: "Maiko Studios",
  phone: "+56912345678",
  role: "admin",
  licenseCode: "LIQ-2025-ADMIN-0001-SAEZ",
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
}
```

### **Estructura de Usuario Estándar:**
```javascript
{
  uid: "dev-user-[timestamp]",
  email: "usuario.test@gmail.com", 
  name: "Usuario Test",
  phone: "+56987654321",
  role: "user",
  licenseCode: "LIQ-2025-TEST-0001-MAIK",
  licenseType: "standard",
  licenseStatus: "active",
  permissions: [
    "use_app",
    "generate_liquidations",
    "export_pdf",
    "basic_features"
  ]
}
```

---

## 🔧 **COMANDOS DE VERIFICACIÓN**

### **Ver Logs en Tiempo Real:**
```bash
# En la terminal donde corre la app
# Los logs aparecerán automáticamente
```

### **Verificar LocalStorage:**
```javascript
// En DevTools Console
Object.keys(localStorage).filter(key => key.startsWith('liqueen'))
```

### **Limpiar Datos de Prueba:**
```javascript
// En DevTools Console
localStorage.removeItem('liqueen_license');
localStorage.removeItem('liqueen_user');
```

---

## ✅ **CHECKLIST DE RESULTADOS**

### **Funcionalidades Básicas:**
- [ ] Banner de desarrollo visible
- [ ] Formulario de registro funcional
- [ ] Validación en tiempo real operativa
- [ ] Formateo automático de códigos

### **Sistema de Roles:**
- [ ] `maikostudios@gmail.com` → rol "admin"
- [ ] Otros emails → rol "user"
- [ ] Duración de licencia diferenciada
- [ ] Permisos asignados correctamente

### **Almacenamiento:**
- [ ] Datos de usuario cifrados localmente
- [ ] Datos de licencia cifrados localmente
- [ ] Estructura de datos correcta

### **Validaciones:**
- [ ] Códigos válidos aceptados
- [ ] Códigos inválidos rechazados
- [ ] Mensajes de error claros
- [ ] Logs informativos en consola

---

## 🐛 **Problemas Conocidos y Soluciones**

### **Error: "Cannot read properties of undefined"**
**Solución:** Recargar la página y volver a intentar

### **LocalStorage no se actualiza**
**Solución:** Limpiar localStorage y volver a registrar

### **Validación no funciona**
**Solución:** Verificar que el banner de desarrollo esté visible

---

## 🎯 **PRÓXIMOS PASOS DESPUÉS DE LAS PRUEBAS**

### **Si las pruebas son exitosas:**
1. ✅ Habilitar Firestore en Firebase Console
2. ✅ Ejecutar `node setup-firestore.js`
3. ✅ Probar en modo producción
4. ✅ Implementar UI diferenciada por roles

### **Si hay problemas:**
1. 🔍 Revisar logs de consola
2. 🔍 Verificar estructura de datos
3. 🔍 Comprobar configuración de servicios
4. 🔍 Validar lógica de roles

---

## 🎉 **RESULTADO ESPERADO FINAL**

Al completar todas las pruebas exitosamente:

1. ✅ **Sistema de roles funcional** con diferenciación automática
2. ✅ **Administrador configurado** (maikostudios@gmail.com)
3. ✅ **Usuarios estándar** con limitaciones apropiadas
4. ✅ **Almacenamiento seguro** de datos cifrados
5. ✅ **Validación robusta** de códigos de licencia
6. ✅ **Modo desarrollo estable** para testing continuo

**¡El sistema está listo para producción!**
