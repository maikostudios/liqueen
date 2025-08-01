<template>
  <div class="option-section">
    <h3>📤 Cargar JSON y Editar en Formulario</h3>
    <p style="margin-bottom: 20px; color: #666;">
      Carga un archivo JSON para rellenar automáticamente el formulario, luego edita los datos antes de generar la liquidación.
    </p>

    <!-- Paso 1: Cargar JSON -->
    <div v-if="!jsonLoaded" class="form-section modern-card">
      <h4>📂 Paso 1: Cargar archivo JSON</h4>

      <!-- Drag & Drop Zone -->
      <DragDropZone
        title="Cargar archivo JSON"
        accept=".json"
        accepted-types="JSON"
        :max-size="5 * 1024 * 1024"
        @file-selected="handleFileSelected"
        @file-processed="handleFileProcessed"
        @file-error="handleFileError"
      />

      <!-- O pegar JSON -->
      <div class="divider">
        <span>O</span>
      </div>

      <div class="form-group">
        <label for="pasteJsonInput">📋 Pegar JSON directamente:</label>
        <textarea 
          id="pasteJsonInput"
          v-model="pastedJson"
          @input="validatePastedJson"
          placeholder="Pega aquí el contenido JSON..."
          style="min-height: 150px;"
        ></textarea>
      </div>

      <button 
        v-if="pastedJson && pastedJsonValid" 
        @click="loadFromPastedJson"
        class="btn btn-success"
        style="width: 100%; margin-top: 10px;"
      >
        ✅ Cargar datos del JSON pegado
      </button>

      <div v-if="errorMessage" class="message error">
        ❌ {{ errorMessage }}
      </div>

      <details style="margin-top: 15px;">
        <summary style="cursor: pointer; font-weight: bold;">📋 Ver ejemplo de JSON</summary>
        <div class="example-json">{{ exampleJson }}</div>
      </details>
    </div>

    <!-- Paso 2: Editar en formulario -->
    <div v-if="jsonLoaded" class="form-section">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h4>✏️ Paso 2: Editar datos en el formulario</h4>
        <button @click="resetForm" class="btn btn-small" style="background-color: #666; color: white;">
          🔄 Cargar otro JSON
        </button>
      </div>

      <div class="message success" style="margin-bottom: 20px;">
        <h4>✅ JSON cargado y procesado automáticamente</h4>
        <p><strong>🔄 Cálculos automáticos aplicados:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>📐 Sueldo proporcional calculado según días trabajados</li>
          <li>🧮 AFP Provida (11.45%), Fonasa (7%), Seguro Desempleo (0.6%)</li>
          <li>📊 Totales actualizados en tiempo real</li>
        </ul>
        <p><strong>💡 Tip:</strong> Cambia el sueldo base o días trabajados y verás los cálculos automáticos en acción.</p>
      </div>

      <!-- Formulario completo -->
      <FormTab 
        :form-data="localFormData"
        @data-ready="handleFormDataReady"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { LiquidacionService } from '../services/liquidacionService.js'
import FormTab from './FormTab.vue'
import DragDropZone from './DragDropZone.vue'

// Props y emits
const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['data-loaded', 'data-ready'])

// Estado reactivo
const jsonLoaded = ref(false)
const fileName = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const selectedFile = ref(null)
const fileInput = ref(null)
const pastedJson = ref('')
const pastedJsonValid = ref(false)
const localFormData = ref({ ...props.formData })

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

// Manejar cambio de archivo
// Manejar selección de archivo (Drag & Drop)
const handleFileSelected = (file) => {
  selectedFile.value = file
  fileName.value = file.name
  errorMessage.value = ''
  successMessage.value = `Archivo seleccionado: ${file.name}`
}

// Procesar archivo JSON (Drag & Drop)
const handleFileProcessed = (file) => {
  const reader = new FileReader()

  reader.onload = (e) => {
    try {
      const jsonData = JSON.parse(e.target.result)
      loadJsonData(jsonData)
      successMessage.value = `✅ Archivo ${file.name} procesado correctamente`
      errorMessage.value = ''
    } catch (error) {
      errorMessage.value = `Error al procesar el archivo JSON: ${error.message}`
      successMessage.value = ''
    }
  }

  reader.onerror = () => {
    errorMessage.value = 'Error al leer el archivo'
    successMessage.value = ''
  }

  reader.readAsText(file)
}

// Manejar errores de archivo (Drag & Drop)
const handleFileError = (error) => {
  errorMessage.value = error
  successMessage.value = ''
}

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) {
    fileName.value = ''
    errorMessage.value = ''
    return
  }

  fileName.value = file.name
  const reader = new FileReader()

  reader.onload = (e) => {
    try {
      const jsonData = JSON.parse(e.target.result)
      loadJsonData(jsonData)
    } catch (error) {
      errorMessage.value = 'Error al leer el archivo JSON: ' + error.message
      fileName.value = ''
    }
  }

  reader.onerror = () => {
    errorMessage.value = 'Error al leer el archivo'
    fileName.value = ''
  }

  reader.readAsText(file)
}

// Validar JSON pegado
const validatePastedJson = () => {
  if (!pastedJson.value.trim()) {
    pastedJsonValid.value = false
    errorMessage.value = ''
    return
  }

  try {
    JSON.parse(pastedJson.value)
    pastedJsonValid.value = true
    errorMessage.value = ''
  } catch (error) {
    pastedJsonValid.value = false
    errorMessage.value = 'JSON inválido: ' + error.message
  }
}

// Cargar desde JSON pegado
const loadFromPastedJson = () => {
  try {
    const jsonData = JSON.parse(pastedJson.value)
    loadJsonData(jsonData)
  } catch (error) {
    errorMessage.value = 'Error al procesar JSON: ' + error.message
  }
}

// Cargar datos JSON al formulario
const loadJsonData = (jsonData) => {
  try {
    localFormData.value = LiquidacionService.jsonToForm(jsonData)
    jsonLoaded.value = true
    errorMessage.value = ''
    emit('data-loaded', jsonData)
  } catch (error) {
    errorMessage.value = 'Error al convertir datos: ' + error.message
  }
}

// Manejar datos del formulario listos (sin actualizar localFormData para evitar loops)
const handleFormDataReady = (formData) => {
  // Solo emitir, NO actualizar localFormData para evitar loops infinitos
  emit('data-ready', formData)
}

// Resetear formulario para cargar otro JSON
const resetForm = () => {
  jsonLoaded.value = false
  fileName.value = ''
  pastedJson.value = ''
  pastedJsonValid.value = false
  errorMessage.value = ''
  localFormData.value = LiquidacionService.createEmptyFormData()
  
  // Limpiar input de archivo
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.divider {
  display: flex;
  align-items: center;
  margin: var(--space-6) 0;
  text-align: center;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--gray-300);
}

.divider span {
  padding: 0 var(--space-4);
  color: var(--gray-500);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  background: white;
}
</style>
