<template>
  <div 
    class="drag-drop-zone"
    :class="{ 
      'drag-over': isDragOver, 
      'has-file': hasFile,
      'drag-error': dragError 
    }"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
  >
    <!-- Icono y contenido principal -->
    <div class="drop-content">
      <div class="drop-icon">
        <svg v-if="!hasFile" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <line x1="10" y1="9" x2="8" y2="9"/>
        </svg>
        
        <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      </div>
      
      <div class="drop-text">
        <h3 v-if="!hasFile">{{ title }}</h3>
        <h3 v-else class="success-text">¡Archivo cargado!</h3>
        
        <p v-if="!hasFile">
          Arrastra tu archivo {{ acceptedTypes }} aquí<br>
          <span class="or-text">o</span>
        </p>
        <p v-else class="file-info">
          {{ fileName }} ({{ fileSize }})
        </p>
      </div>
      
      <!-- Botón de carga manual -->
      <button 
        v-if="!hasFile"
        type="button" 
        class="btn btn-primary upload-button"
        @click="triggerFileInput"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,15 17,10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Seleccionar archivo
      </button>
      
      <!-- Botones de acción cuando hay archivo -->
      <div v-else class="file-actions">
        <button 
          type="button" 
          class="btn btn-success"
          @click="processFile"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          Procesar archivo
        </button>
        
        <button 
          type="button" 
          class="btn btn-secondary"
          @click="clearFile"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Cambiar
        </button>
      </div>
    </div>
    
    <!-- Input file oculto -->
    <input 
      ref="fileInput"
      type="file" 
      :accept="accept"
      @change="handleFileSelect"
      style="display: none"
    >
    
    <!-- Overlay de arrastre -->
    <div v-if="isDragOver" class="drag-overlay">
      <div class="drag-overlay-content">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,15 17,10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <p>Suelta el archivo aquí</p>
      </div>
    </div>
    
    <!-- Indicador de error -->
    <div v-if="dragError" class="error-message">
      {{ dragError }}
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'DragDropZone',
  props: {
    title: {
      type: String,
      default: 'Cargar archivo'
    },
    accept: {
      type: String,
      default: '.json'
    },
    acceptedTypes: {
      type: String,
      default: 'JSON'
    },
    maxSize: {
      type: Number,
      default: 5 * 1024 * 1024 // 5MB
    }
  },
  emits: ['file-selected', 'file-processed', 'file-error'],
  setup(props, { emit }) {
    const isDragOver = ref(false)
    const dragError = ref('')
    const selectedFile = ref(null)
    const fileInput = ref(null)
    
    const hasFile = computed(() => !!selectedFile.value)
    const fileName = computed(() => selectedFile.value?.name || '')
    const fileSize = computed(() => {
      if (!selectedFile.value) return ''
      const size = selectedFile.value.size
      if (size < 1024) return `${size} B`
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
      return `${(size / (1024 * 1024)).toFixed(1)} MB`
    })
    
    const validateFile = (file) => {
      // Validar tipo
      if (props.accept.includes('image/*')) {
        // Para imágenes, validar tipo MIME
        if (!file.type.startsWith('image/')) {
          return `Tipo de archivo no válido. Se esperaba: ${props.acceptedTypes}`
        }

        // Validar tipos específicos de imagen
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp']
        if (!allowedImageTypes.includes(file.type)) {
          return `Formato de imagen no soportado. Formatos válidos: JPG, PNG, SVG, WebP`
        }
      } else {
        // Para otros tipos, validar por extensión
        const acceptedExtensions = props.accept.split(',').map(ext => ext.trim())
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase()

        if (!acceptedExtensions.includes(fileExtension)) {
          return `Tipo de archivo no válido. Se esperaba: ${props.acceptedTypes}`
        }
      }

      // Validar tamaño
      if (file.size > props.maxSize) {
        return `Archivo muy grande. Máximo: ${(props.maxSize / (1024 * 1024)).toFixed(1)} MB`
      }

      return null
    }
    
    const handleDragOver = (e) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }
    
    const handleDragEnter = (e) => {
      e.preventDefault()
      isDragOver.value = true
      dragError.value = ''
    }
    
    const handleDragLeave = (e) => {
      e.preventDefault()
      // Solo ocultar si realmente salimos del componente
      if (!e.currentTarget.contains(e.relatedTarget)) {
        isDragOver.value = false
      }
    }
    
    const handleDrop = (e) => {
      e.preventDefault()
      isDragOver.value = false
      
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileSelection(files[0])
      }
    }
    
    const handleFileSelect = (e) => {
      const files = Array.from(e.target.files)
      if (files.length > 0) {
        handleFileSelection(files[0])
      }
    }
    
    const handleFileSelection = (file) => {
      console.log('🎯 DragDropZone: handleFileSelection iniciado con:', file.name)

      const error = validateFile(file)
      if (error) {
        console.log('❌ DragDropZone: Error de validación:', error)
        dragError.value = error
        emit('file-error', error)
        return
      }

      selectedFile.value = file
      dragError.value = ''
      console.log('📤 DragDropZone: Emitiendo file-selected')
      emit('file-selected', file)

      // Procesar automáticamente después de un breve delay
      console.log('⏰ DragDropZone: Programando processFile en 100ms')
      setTimeout(() => {
        console.log('🔄 DragDropZone: Ejecutando processFile')
        processFile()
      }, 100)
    }
    
    const triggerFileInput = () => {
      fileInput.value?.click()
    }
    
    const processFile = () => {
      console.log('🔄 DragDropZone: processFile ejecutado')
      console.log('📁 DragDropZone: selectedFile.value:', selectedFile.value)

      if (selectedFile.value) {
        console.log('📤 DragDropZone: Emitiendo file-processed con:', selectedFile.value.name)
        emit('file-processed', selectedFile.value)
      } else {
        console.log('❌ DragDropZone: No hay selectedFile.value')
      }
    }
    
    const clearFile = () => {
      selectedFile.value = null
      dragError.value = ''
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
    
    return {
      isDragOver,
      dragError,
      hasFile,
      fileName,
      fileSize,
      fileInput,
      handleDragOver,
      handleDragEnter,
      handleDragLeave,
      handleDrop,
      handleFileSelect,
      triggerFileInput,
      processFile,
      clearFile
    }
  }
}
</script>

<style scoped>
.drag-drop-zone {
  position: relative;
  border: 2px dashed var(--gray-300);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  text-align: center;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  transition: var(--transition-normal);
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drag-drop-zone:hover {
  border-color: var(--primary-400);
  background: var(--primary-50);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.drag-drop-zone.drag-over {
  border-color: var(--primary-500);
  background: var(--primary-100);
  transform: scale(1.02);
  box-shadow: var(--shadow-xl);
}

.drag-drop-zone.has-file {
  border-color: var(--secondary-400);
  background: var(--secondary-50);
}

.drag-drop-zone.drag-error {
  border-color: var(--danger-400);
  background: var(--danger-50);
}

.drop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  z-index: 2;
}

.drop-icon {
  color: var(--gray-400);
  transition: var(--transition-normal);
}

.drag-drop-zone:hover .drop-icon {
  color: var(--primary-500);
  transform: scale(1.1);
}

.drag-drop-zone.has-file .drop-icon {
  color: var(--secondary-500);
}

.drop-text h3 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-700);
}

.success-text {
  color: var(--secondary-600) !important;
}

.drop-text p {
  margin: var(--space-2) 0 0 0;
  color: var(--gray-500);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.or-text {
  font-weight: var(--font-weight-medium);
  color: var(--gray-400);
}

.file-info {
  color: var(--secondary-600) !important;
  font-weight: var(--font-weight-medium) !important;
}

.upload-button {
  margin-top: var(--space-2);
}

.file-actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.drag-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(59, 130, 246, 0.9);
  backdrop-filter: blur(4px);
  border-radius: var(--radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.drag-overlay-content {
  color: white;
  text-align: center;
}

.drag-overlay-content svg {
  animation: bounce 1s infinite;
}

.drag-overlay-content p {
  margin: var(--space-3) 0 0 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.error-message {
  position: absolute;
  bottom: var(--space-3);
  left: var(--space-3);
  right: var(--space-3);
  background: var(--danger-100);
  color: var(--danger-700);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border: 1px solid var(--danger-200);
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0,-8px,0);
  }
  70% {
    transform: translate3d(0,-4px,0);
  }
  90% {
    transform: translate3d(0,-2px,0);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .drag-drop-zone {
    padding: var(--space-6);
    min-height: 160px;
  }
  
  .drop-icon svg {
    width: 36px;
    height: 36px;
  }
  
  .drop-text h3 {
    font-size: var(--font-size-lg);
  }
  
  .file-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .file-actions .btn {
    width: 100%;
  }
}
</style>
