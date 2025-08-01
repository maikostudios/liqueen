<template>
  <div class="option-section card-primary">
    <h3>📂 Subir archivo JSON</h3>
    <p class="section-description">
      Selecciona o arrastra un archivo JSON con los datos de la liquidación
    </p>

    <DragDropZone
      title="Cargar archivo JSON"
      accept=".json"
      accepted-types="JSON"
      :max-size="5 * 1024 * 1024"
      @file-selected="handleFileSelected"
      @file-processed="handleFileProcessed"
      @file-error="handleFileError"
    />

    <div v-if="errorMessage" class="message error">
      {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="message success">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DragDropZone from './DragDropZone.vue'

// Props y emits
const emit = defineEmits(['data-loaded'])

// Estado reactivo
const errorMessage = ref('')
const successMessage = ref('')
const selectedFile = ref(null)

// Manejar selección de archivo
const handleFileSelected = (file) => {
  selectedFile.value = file
  errorMessage.value = ''
  successMessage.value = `Archivo seleccionado: ${file.name}`
}

// Procesar archivo JSON
const handleFileProcessed = (file) => {
  console.log('🔄 Processing JSON file:', file.name)
  const reader = new FileReader()

  reader.onload = (e) => {
    try {
      const jsonData = JSON.parse(e.target.result)
      console.log('✅ JSON parsed successfully:', jsonData)

      successMessage.value = `✅ Archivo ${file.name} procesado correctamente - Datos listos para generar PDF`
      errorMessage.value = ''

      // Emitir evento al padre para cargar los datos directamente
      emit('data-loaded', jsonData)

      console.log('📝 Success message set:', successMessage.value)
      console.log('🔍 Emitting data-loaded event with data:', jsonData)
    } catch (error) {
      console.error('❌ Error parsing JSON:', error)
      errorMessage.value = `Error al procesar el archivo JSON: ${error.message}`
      successMessage.value = ''
    }
  }

  reader.onerror = () => {
    console.error('❌ Error reading file')
    errorMessage.value = 'Error al leer el archivo'
    successMessage.value = ''
  }

  reader.readAsText(file)
}

// Manejar errores de archivo
const handleFileError = (error) => {
  errorMessage.value = error
  successMessage.value = ''
}
</script>

<style scoped>
.section-description {
  color: var(--gray-600);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-6);
  line-height: 1.5;
}
</style>
