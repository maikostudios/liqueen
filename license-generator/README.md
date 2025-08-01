# 🎫 Generador de Licencias - Liqueen

## Descripción

Herramienta independiente para generar códigos de licencia aleatorios para la aplicación Liqueen. Esta herramienta permite crear licencias con diferentes tipos y duraciones, y agregarlas directamente a la base de datos Firestore.

## Características

- ✅ **Generación de códigos aleatorios** con formato `LIQ-YYYY-XXXX-YYYY-ZZZZ`
- ✅ **Caracteres no consecutivos** usando palabras específicas: "MAIKO", "STUDIOS", "SAEZ", "CONTRERAS"
- ✅ **Múltiples tipos de licencia**: Trial, Standard, Extended, Unlimited
- ✅ **Conexión directa a Firestore** para agregar licencias automáticamente
- ✅ **Interfaz web moderna** y fácil de usar
- ✅ **Validación en tiempo real** del estado de Firebase
- ✅ **Generación en lotes** (1-50 licencias por vez)

## Tipos de Licencia

| Tipo | Duración | Descripción |
|------|----------|-------------|
| **Trial** | 30 días | Licencia de prueba |
| **Standard** | 2 años | Licencia estándar para usuarios |
| **Extended** | 5 años | Licencia extendida |
| **Unlimited** | Sin límite | Licencia sin expiración (admin) |

## Formato de Código

```
LIQ-2025-A1B2-C3D4-MAIK
│   │    │    │    │
│   │    │    │    └── 4 caracteres aleatorios de palabras específicas
│   │    │    └────── 4 caracteres alfanuméricos aleatorios
│   │    └─────────── 4 caracteres alfanuméricos aleatorios
│   └──────────────── Año actual
└──────────────────── Prefijo fijo "LIQ"
```

### Palabras para Sufijo
- **MAIKO** - Caracteres: M, A, I, K, O
- **STUDIOS** - Caracteres: S, T, U, D, I, O
- **SAEZ** - Caracteres: S, A, E, Z
- **CONTRERAS** - Caracteres: C, O, N, T, R, E, A, S

## Uso

### 1. Abrir la Herramienta
```bash
# Navegar a la carpeta del generador
cd license-generator

# Abrir index.html en un navegador web
# O usar un servidor local como Live Server
```

### 2. Configurar Generación
1. **Seleccionar tipo de licencia** (Trial, Standard, Extended, Unlimited)
2. **Especificar cantidad** (1-50 licencias)
3. **Agregar descripción** (opcional)

### 3. Generar Licencias
1. Hacer clic en **"🚀 Generar Licencias"**
2. Revisar las licencias generadas
3. Hacer clic en **"☁️ Agregar a Firestore"** para guardarlas

### 4. Verificación
- El estado de conexión a Firebase se muestra en tiempo real
- Las licencias se agregan a la colección `licenses` en Firestore
- Cada licencia tiene estado `available` hasta ser activada

## Estructura de Datos en Firestore

```javascript
// Colección: licenses
// Documento ID: código de licencia (ej: "LIQ-2025-A1B2-C3D4-MAIK")
{
  type: "standard",           // Tipo de licencia
  status: "available",        // Estado: available, used, revoked
  description: "Licencia...", // Descripción personalizada
  expiryDays: 730,           // Días de validez (null para unlimited)
  createdAt: timestamp,       // Fecha de creación
  createdBy: "license-generator", // Origen de creación
  activatedOn: null,          // Fecha de activación (null hasta uso)
  userId: null,               // ID del usuario (null hasta activación)
  hardwareId: null            // ID del hardware (null hasta activación)
}
```

## Configuración de Firebase

La herramienta se conecta automáticamente a Firebase usando la configuración:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBqgFkuQzU8TLgBbXCKcKenwQKDke4VYeA",
  authDomain: "liqueen.firebaseapp.com",
  projectId: "liqueen",
  storageBucket: "liqueen.firebasestorage.app",
  messagingSenderId: "369721543995",
  appId: "1:369721543995:web:faa51f6bfaab56cdbf3b1e"
};
```

## Seguridad

- ⚠️ **Esta herramienta debe usarse solo por administradores**
- ⚠️ **No compartir el acceso a esta herramienta**
- ⚠️ **Las licencias generadas son inmediatamente válidas**
- ⚠️ **Mantener registro de las licencias generadas**

## Integración con Liqueen

Las licencias generadas por esta herramienta son automáticamente reconocidas por la aplicación Liqueen durante el proceso de registro:

1. **Usuario ingresa código** en la pantalla de registro
2. **Liqueen valida** el código contra la colección `licenses`
3. **Si es válido y disponible**, se activa la licencia
4. **Se asocia** al usuario y hardware específico
5. **Estado cambia** de `available` a `used`

## Troubleshooting

### Error de Conexión a Firebase
- Verificar conexión a internet
- Comprobar configuración de Firebase
- Revisar permisos de Firestore

### Licencias No Aparecen en Liqueen
- Verificar que se agregaron a Firestore correctamente
- Comprobar formato del código de licencia
- Revisar estado de la licencia (debe ser `available`)

### Códigos Duplicados
- Los códigos son generados aleatoriamente
- La probabilidad de duplicados es extremadamente baja
- Firestore rechazará automáticamente códigos duplicados

## Mantenimiento

### Limpieza de Licencias Expiradas
```javascript
// Script para limpiar licencias expiradas (ejecutar manualmente)
// TODO: Implementar script de limpieza automática
```

### Estadísticas de Uso
- Revisar colección `licenses` en Firestore Console
- Filtrar por estado: `available`, `used`, `revoked`
- Monitorear fechas de activación y expiración

## Versión
**v1.0.0** - Generador inicial con funcionalidad completa

---

**Desarrollado para Liqueen** - Sistema de Liquidaciones Profesional
