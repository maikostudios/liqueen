# 📋 Estructura del JSON para Liquidaciones

## 🎯 Campos Requeridos vs Opcionales

### ✅ **CAMPOS OBLIGATORIOS** (Mínimos para generar liquidación)

```json
{
  "empleador": "Nombre de la empresa",
  "trabajador": {
    "nombre": "Nombre completo del trabajador",
    "rut": "12.345.678-9"
  }
}
```

### 📝 **ESTRUCTURA COMPLETA** (Todos los campos disponibles)

```json
{
  "empleador": "string - Nombre de la empresa",
  "rutEmpleador": "string - RUT de la empresa (formato: 76.123.456-7)",
  "area": "string - Departamento o área",
  "mes": "string - Mes y año (ej: Enero 2024)",

  "trabajador": {
    "nombre": "string - Nombre completo (OBLIGATORIO)",
    "rut": "string - RUT del trabajador (OBLIGATORIO)",
    "cargo": "string - Cargo o puesto",
    "tipoContrato": "string - Tipo de contrato",
    "inicioContrato": "string - Fecha inicio (DD/MM/YYYY)",
    "diasTrabajados": "number - Días trabajados en el mes (1-31)",
    "diasVacaciones": "number - Días de vacaciones tomados",
    "sueldoBase": "number - Sueldo base en pesos",
    "prevision": "string - AFP del trabajador",
    "salud": "string - Sistema de salud"
  },

  "haberesImponibles": [
    {
      "concepto": "string - Nombre del concepto",
      "monto": "number - Monto en pesos"
    }
  ],

  "haberesNoImponibles": [
    {
      "concepto": "string - Nombre del concepto",
      "monto": "number - Monto en pesos"
    }
  ],

  "descuentosLegales": [
    {
      "concepto": "string - Nombre del concepto",
      "monto": "number - Monto en pesos"
    }
  ],

  "otrosDescuentos": [
    {
      "concepto": "string - Nombre del concepto",
      "monto": "number - Monto en pesos"
    }
  ],

  "totales": {
    "totalHaberes": "number - Se calcula automáticamente",
    "totalDescuentos": "number - Se calcula automáticamente",
    "impPrevSalud": "number - Se calcula automáticamente",
    "impCesantia": "number - Se calcula automáticamente",
    "baseTributable": "number - Se calcula automáticamente",
    "liquido": "number - Se calcula automáticamente"
  }
}
```

## 📋 **Valores por Defecto**

Si no se proporcionan, el sistema usa estos valores:

```json
{
  "empleador": "",
  "rutEmpleador": "",
  "area": "",
  "mes": "",

  "trabajador": {
    "nombre": "",
    "rut": "",
    "cargo": "",
    "tipoContrato": "",
    "inicioContrato": "",
    "diasTrabajados": 30,
    "diasVacaciones": 0,
    "sueldoBase": 0,
    "prevision": "",
    "salud": ""
  },

  "haberesImponibles": [
    { "concepto": "Sueldo Base", "monto": 0 },
    { "concepto": "Gratificación", "monto": 0 }
  ],

  "haberesNoImponibles": [
    { "concepto": "Movilización", "monto": 0 },
    { "concepto": "Colación", "monto": 0 },
    { "concepto": "Cargas Familiares", "monto": 0 }
  ],

  "descuentosLegales": [
    { "concepto": "AFP Provida", "monto": 0 },
    { "concepto": "Fonasa", "monto": 0 },
    { "concepto": "Seguro Desempleo", "monto": 0 }
  ],

  "otrosDescuentos": [
    { "concepto": "Anticipos", "monto": 0 },
    { "concepto": "Préstamos", "monto": 0 }
  ]
}
```

## 🎯 **Opciones Predefinidas**

### Tipo de Contrato:

- "Indefinido"
- "Plazo Fijo"
- "Por Obra"
- "Honorarios"

### AFP (Previsión):

- "AFP Capital"
- "AFP Cuprum"
- "AFP Habitat"
- "AFP Modelo"
- "AFP PlanVital"
- "AFP ProVida"
- "AFP Uno"

### Salud:

- "Fonasa"
- "Isapre Banmédica"
- "Isapre Colmena"
- "Isapre Consalud"
- "Isapre Cruz Blanca"
- "Isapre Nueva Masvida"
- "Isapre Vida Tres"
- "Otra"

## 🧮 **Cálculos Automáticos**

El sistema calcula automáticamente los descuentos legales basados en los porcentajes oficiales:

- **AFP Provida**: 11.45% del sueldo imponible
- **Fonasa**: 7% del sueldo imponible
- **Seguro Desempleo**: 0.6% del sueldo imponible
- **Sueldo Proporcional**: Se ajusta automáticamente según días trabajados

## 💡 **Notas Importantes**

1. **Totales**: Se calculan automáticamente, no es necesario incluirlos
2. **Arrays vacíos**: Si no hay conceptos, se pueden omitir las secciones
3. **Montos**: Siempre en pesos chilenos (sin puntos ni comas)
4. **Fechas**: Formato DD/MM/YYYY (ej: "15/03/2024")
5. **RUT**: Con puntos y guión (ej: "12.345.678-9")
6. **Cargas Familiares**: Nuevo haber no imponible incluido
7. **Descuentos**: Se actualizan automáticamente al cambiar el sueldo base

## 📄 **Ejemplos de JSON Mínimo vs Completo**

### JSON Mínimo (Solo campos obligatorios):

```json
{
  "empleador": "Mi Empresa",
  "trabajador": {
    "nombre": "Juan Pérez",
    "rut": "12.345.678-9"
  }
}
```

### JSON Completo (Todos los campos):

```json
{
  "empleador": "Empresa Ejemplo S.A.",
  "rutEmpleador": "76.123.456-7",
  "area": "Administración",
  "mes": "Enero 2024",
  "trabajador": {
    "nombre": "Juan Pérez González",
    "rut": "12.345.678-9",
    "cargo": "Analista",
    "tipoContrato": "Indefinido",
    "inicioContrato": "01/03/2023",
    "diasTrabajados": 30,
    "diasVacaciones": 0,
    "sueldoBase": 800000,
    "prevision": "AFP Cuprum",
    "salud": "Fonasa"
  },
  "haberesImponibles": [
    { "concepto": "Sueldo Base", "monto": 800000 },
    { "concepto": "Gratificación", "monto": 66667 }
  ],
  "haberesNoImponibles": [
    { "concepto": "Movilización", "monto": 30000 },
    { "concepto": "Colación", "monto": 25000 },
    { "concepto": "Cargas Familiares", "monto": 15000 }
  ],
  "descuentosLegales": [
    { "concepto": "AFP Provida", "monto": 99225 },
    { "concepto": "Fonasa", "monto": 60667 },
    { "concepto": "Seguro Desempleo", "monto": 5200 }
  ],
  "otrosDescuentos": [{ "concepto": "Anticipos", "monto": 50000 }]
}
```
