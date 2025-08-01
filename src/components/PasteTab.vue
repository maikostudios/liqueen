<template>
  <div class="option-section">
    <h3>✏️ Pegar JSON manualmente</h3>
    
    <div class="form-group">
      <label for="jsonInput">Pega aquí el contenido JSON:</label>
      <textarea 
        id="jsonInput"
        v-model="jsonInput"
        @input="validateJson"
        placeholder="Pega aquí el contenido JSON..."
      ></textarea>
    </div>

    <div v-if="jsonValid" class="message success">
      ✅ JSON válido
    </div>
    
    <div v-if="jsonError" class="message error">
      ❌ {{ jsonError }}
    </div>

    <details style="margin-top: 15px;">
      <summary style="cursor: pointer; font-weight: bold;">📋 Ver ejemplo de JSON</summary>
      <div class="example-json">{{ exampleJson }}</div>
    </details>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props y emits
const emit = defineEmits(['data-loaded'])

// Estado reactivo
const jsonInput = ref('')
const jsonError = ref('')
const jsonValid = ref(false)

// JSON de ejemplo
const exampleJson = `{
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
    { "concepto": "Colación", "monto": 25000 }
  ],
  "descuentosLegales": [
    { "concepto": "AFP", "monto": 86667 },
    { "concepto": "Salud", "monto": 58000 },
    { "concepto": "Seguro Cesantía", "monto": 2167 }
  ],
  "otrosDescuentos": [
    { "concepto": "Anticipos", "monto": 50000 }
  ]
}`

// Validar JSON
const validateJson = () => {
  if (!jsonInput.value.trim()) {
    jsonError.value = ''
    jsonValid.value = false
    return
  }

  try {
    const parsed = JSON.parse(jsonInput.value)
    jsonError.value = ''
    jsonValid.value = true
    emit('data-loaded', parsed)
  } catch (error) {
    jsonError.value = 'JSON inválido: ' + error.message
    jsonValid.value = false
  }
}

// Observar cambios en el input
watch(jsonInput, validateJson)
</script>
