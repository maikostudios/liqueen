<template>
  <div class="logo-upload-container">
    <!-- Logo cargado -->
    <div v-if="logoData" class="logo-preview">
      <div class="logo-image-container">
        <img :src="logoData" alt="Logo de la empresa" class="logo-image" />
        <div class="logo-overlay">
          <button @click="removeLogo" class="btn-remove-logo" title="Quitar logo">
            ❌
          </button>
        </div>
      </div>
      <div class="logo-info">
        <p class="logo-filename">📁 {{ logoFileName }}</p>
        <p class="logo-hint">El logo aparecerá en todas las liquidaciones</p>
      </div>
    </div>

    <!-- Zona de carga -->
    <div v-else class="logo-upload-zone" 
         :class="{ 'drag-over': isDragOver, 'drag-error': dragError }"
         @dragover.prevent="handleDragOver"
         @dragenter.prevent="handleDragEnter" 
         @dragleave.prevent="handleDragLeave"
         @drop.prevent="handleDrop">
      
      <input
        ref="fileInput"
        type="file"
        @change="handleFileSelect"
        accept="image/*"
        style="display: none"
      />
      
      <div class="upload-content">
        <div class="upload-icon">🖼️</div>
        <h4>Subir Logo de la Empresa</h4>
        <p class="upload-description">
          Arrastra una imagen aquí o 
          <button @click="triggerFileInput" class="btn-browse-inline">haz clic para seleccionar</button>
        </p>
        <div class="upload-specs">
          <span>📏 Formatos: JPG, PNG, GIF</span>
          <span>📦 Tamaño máximo: 5MB</span>
        </div>
      </div>
      
      <div v-if="dragError" class="error-message">
        {{ dragError }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

// Props
const props = defineProps({
  logoData: {
    type: String,
    default: null
  },
  logoFileName: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['logo-uploaded', 'logo-removed'])

// Estado reactivo
const isDragOver = ref(false)
const dragError = ref('')
const fileInput = ref(null)

// Validación de archivos
const validateFile = (file) => {
  // Verificar tipo de archivo
  if (!file.type.startsWith('image/')) {
    return 'Por favor selecciona un archivo de imagen válido'
  }
  
  // Verificar tamaño (5MB máximo)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return 'El archivo es demasiado grande. Máximo 5MB permitido'
  }
  
  return null
}

// Manejo de drag & drop
const handleDragOver = (e) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragEnter = (e) => {
  e.preventDefault()
  isDragOver.value = true
  dragError.value = ''
}

const handleDragLeave = (e) => {
  e.preventDefault()
  // Solo quitar el estado si realmente salimos del área
  if (!e.currentTarget.contains(e.relatedTarget)) {
    isDragOver.value = false
  }
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragOver.value = false
  dragError.value = ''
  
  const files = e.dataTransfer.files
  if (files.length > 0) {
    handleFileSelection(files[0])
  }
}

// Manejo de selección de archivos
const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    handleFileSelection(file)
  }
}

const handleFileSelection = (file) => {
  console.log('🖼️ LogoUpload: Archivo seleccionado:', file.name)
  
  const error = validateFile(file)
  if (error) {
    dragError.value = error
    return
  }
  
  // Leer archivo como base64
  const reader = new FileReader()
  reader.onload = (e) => {
    const logoData = e.target.result
    console.log('✅ LogoUpload: Logo cargado exitosamente')
    emit('logo-uploaded', {
      data: logoData,
      fileName: file.name
    })
  }
  
  reader.onerror = () => {
    dragError.value = 'Error al leer el archivo'
  }
  
  reader.readAsDataURL(file)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const removeLogo = () => {
  console.log('🗑️ LogoUpload: Logo removido')
  emit('logo-removed')
}
</script>

<style scoped>
.logo-upload-container {
  width: 100%;
}

/* Logo preview */
.logo-preview {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--gray-50);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
}

.logo-image-container {
  position: relative;
  flex-shrink: 0;
}

.logo-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: var(--radius-md);
  background: white;
  border: 1px solid var(--gray-200);
}

.logo-overlay {
  position: absolute;
  top: -8px;
  right: -8px;
}

.btn-remove-logo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: var(--red-500);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;
}

.btn-remove-logo:hover {
  background: var(--red-600);
  transform: scale(1.1);
}

.logo-info {
  flex: 1;
}

.logo-filename {
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 var(--space-1) 0;
}

.logo-hint {
  color: var(--gray-600);
  font-size: var(--font-size-sm);
  margin: 0;
}

/* Upload zone */
.logo-upload-zone {
  border: 2px dashed var(--gray-300);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  text-align: center;
  background: var(--gray-50);
  transition: all 0.3s ease;
  cursor: pointer;
}

.logo-upload-zone:hover {
  border-color: var(--blue-400);
  background: var(--blue-50);
}

.logo-upload-zone.drag-over {
  border-color: var(--blue-500);
  background: var(--blue-100);
  transform: scale(1.02);
}

.logo-upload-zone.drag-error {
  border-color: var(--red-400);
  background: var(--red-50);
}

.upload-content {
  pointer-events: none;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: var(--space-4);
}

.upload-content h4 {
  margin: 0 0 var(--space-2) 0;
  color: var(--gray-900);
  font-weight: 600;
}

.upload-description {
  color: var(--gray-600);
  margin: 0 0 var(--space-4) 0;
}

.btn-browse-inline {
  background: none;
  border: none;
  color: var(--blue-600);
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
  pointer-events: all;
}

.btn-browse-inline:hover {
  color: var(--blue-700);
}

.upload-specs {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--gray-500);
}

.error-message {
  margin-top: var(--space-4);
  padding: var(--space-3);
  background: var(--red-100);
  color: var(--red-700);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}

/* Responsive */
@media (max-width: 768px) {
  .logo-preview {
    flex-direction: column;
    text-align: center;
  }
  
  .upload-specs {
    flex-direction: column;
    gap: var(--space-2);
  }
}
</style>
