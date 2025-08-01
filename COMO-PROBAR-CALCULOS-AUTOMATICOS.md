# 🧮 Cómo Probar los Cálculos Automáticos

## 🎯 **Objetivo**
Demostrar que los montos se actualizan automáticamente cuando cambias el sueldo base, días trabajados o cualquier concepto.

## 📋 **Archivos de Prueba Disponibles**

### 1. **`demo-calculo-automatico.json`** 
- **Propósito**: Archivo con valores incorretos a propósito (999999) para ver cómo se corrigen automáticamente
- **Sueldo Base**: $786.000
- **Días Trabajados**: 28 días
- **Montos incorretos**: Todos los descuentos en $999.999

### 2. **`liquidacion-dario-corregida.json`**
- **Propósito**: Archivo con valores ya corregidos para comparar
- **Mismos datos**: Pero con cálculos correctos

## 🚀 **Pasos para Probar**

### **Prueba 1: Corrección Automática de JSON**

1. **Ve a "📤 Cargar y Editar"**
2. **Carga** `demo-calculo-automatico.json`
3. **Observa** que inmediatamente se corrigen:
   - ❌ Sueldo Base: $999.999 → ✅ $734.400 (28 días de $786.000)
   - ❌ AFP: $999.999 → ✅ $112.516 (11.45%)
   - ❌ Fonasa: $999.999 → ✅ $68.775 (7%)
   - ❌ Seguro Desempleo: $999.999 → ✅ $5.895 (0.6%)

### **Prueba 2: Cambio de Días Trabajados**

1. **Con el JSON ya cargado**
2. **Cambia "Días Trabajados"** de 28 a 30
3. **Observa** los cambios automáticos:
   - Sueldo Base: $734.400 → $786.000
   - AFP: $112.516 → $124.567
   - Fonasa: $68.775 → $76.125
   - Seguro Desempleo: $5.895 → $6.525
   - **Total Líquido**: Se recalcula automáticamente

### **Prueba 3: Cambio de Sueldo Base**

1. **Cambia "Sueldo Base"** de $786.000 a $1.000.000
2. **Observa** los cambios automáticos:
   - Sueldo proporcional: Se ajusta según días trabajados
   - Todos los descuentos se recalculan con los nuevos porcentajes
   - Totales se actualizan en tiempo real

### **Prueba 4: Agregar Haberes**

1. **Agrega una "Gratificación"** de $200.000
2. **Observa** que:
   - Total imponible aumenta
   - Descuentos se recalculan sobre el nuevo total
   - Líquido final se ajusta automáticamente

## 🔍 **Qué Observar**

### **Indicadores Visuales**
- 🔄 **"En tiempo real"** en la sección de totales
- 💡 **Mensajes explicativos** sobre cálculos automáticos
- 📐 **Fórmulas mostradas** en la interfaz

### **Cálculos Específicos**
- **Sueldo Proporcional**: `Sueldo Base × (Días Trabajados ÷ 30)`
- **AFP Provida**: `Total Imponible × 11.45%`
- **Fonasa**: `Total Imponible × 7%`
- **Seguro Desempleo**: `Total Imponible × 0.6%`

## 📊 **Ejemplo de Cálculo Completo**

**Datos Iniciales:**
- Sueldo Base: $786.000
- Días Trabajados: 28
- Gratificación: $196.500

**Cálculos Automáticos:**
1. **Sueldo Proporcional**: $786.000 × (28 ÷ 30) = $734.400
2. **Total Imponible**: $734.400 + $196.500 = $930.900
3. **AFP Provida**: $930.900 × 11.45% = $106.588
4. **Fonasa**: $930.900 × 7% = $65.163
5. **Seguro Desempleo**: $930.900 × 0.6% = $5.585

## ✅ **Confirmación de Funcionamiento**

Si ves que los valores cambian automáticamente cuando modificas:
- ✅ Sueldo base
- ✅ Días trabajados  
- ✅ Cualquier haber imponible

**¡Los cálculos automáticos están funcionando correctamente!** 🎉

## 🐛 **Si No Funciona**

1. **Refresca la página** (F5)
2. **Verifica** que estés en la pestaña "📤 Cargar y Editar"
3. **Asegúrate** de que el JSON tenga los conceptos correctos:
   - "Sueldo Base" en haberes imponibles
   - "AFP Provida", "Fonasa", "Seguro Desempleo" en descuentos legales
