<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="show" class="config-modal-overlay" @click="handleOverlayClick">
        <div class="config-modal-container" @click.stop>
          <!-- Header moderno -->
          <div class="config-modal-header">
            <div class="header-content">
              <div class="header-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2579 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.01127 9.77251C4.28054 9.5799 4.48571 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="header-text">
                <h2 class="modal-title">Configuración</h2>
                <p class="modal-subtitle">Personaliza las opciones de generación de liquidaciones</p>
              </div>
            </div>
            <button @click="$emit('close')" class="btn-close-modern">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="config-modal-content">
          <!-- Configuración de rutas -->
          <div class="config-section">
            <h4>📁 Ubicación de Archivos</h4>
            
            <div class="config-item">
              <label for="pdfPath">Carpeta para guardar PDFs:</label>
              <div class="path-input-group">
                <input 
                  id="pdfPath"
                  v-model="config.defaultPdfPath" 
                  type="text" 
                  class="path-input"
                  placeholder="Selecciona una carpeta..."
                  readonly
                >
                <button @click="selectPdfFolder" class="btn-browse">
                  📂 Examinar
                </button>
              </div>
              <p class="config-help">
                Los archivos PDF se guardarán en esta carpeta con el formato: 
                <code>liq-mm-aaaa-rut-nombre.pdf</code>
              </p>
            </div>

            <div class="config-item">
              <label>
                <input type="checkbox" v-model="config.autoCreateFolder">
                Crear carpeta automáticamente si no existe
              </label>
            </div>
          </div>

          <!-- Configuración de generación -->
          <div class="config-section">
            <h4>📄 Generación de PDFs</h4>
            
            <div class="config-item">
              <label for="maxLiquidaciones">Máximo de liquidaciones por archivo:</label>
              <select id="maxLiquidaciones" v-model="config.maxLiquidaciones" class="config-select">
                <option value="5">5 liquidaciones</option>
                <option value="10">10 liquidaciones</option>
                <option value="15">15 liquidaciones</option>
                <option value="20">20 liquidaciones</option>
              </select>
            </div>

            <div class="config-item">
              <label>
                <input type="checkbox" v-model="config.autoOpenPdf">
                Abrir carpeta automáticamente después de generar PDFs
              </label>
            </div>

            <div class="config-item">
              <label>
                <input type="checkbox" v-model="config.showProgress">
                Mostrar progreso detallado durante la generación
              </label>
            </div>

            <div class="config-item">
              <label>
                <input type="checkbox" v-model="config.compressPdf">
                Comprimir PDFs para reducir tamaño de archivo
              </label>
            </div>
          </div>

          <!-- Configuración de nombres -->
          <div class="config-section">
            <h4>🏷️ Nomenclatura de Archivos</h4>
            
            <div class="config-item">
              <label for="fileNameFormat">Formato de nombre:</label>
              <select id="fileNameFormat" v-model="config.fileNameFormat" class="config-select">
                <option value="liq-mm-aaaa-rut-nombre">liq-mm-aaaa-rut-nombre.pdf</option>
                <option value="liquidacion-nombre-mm-aaaa">liquidacion-nombre-mm-aaaa.pdf</option>
                <option value="aaaa-mm-rut-nombre">aaaa-mm-rut-nombre.pdf</option>
                <option value="nombre-liquidacion-mm-aaaa">nombre-liquidacion-mm-aaaa.pdf</option>
              </select>
            </div>

            <div class="config-item">
              <label for="maxNameLength">Longitud máxima del nombre:</label>
              <input 
                id="maxNameLength"
                v-model.number="config.maxNameLength" 
                type="range" 
                min="50" 
                max="150" 
                step="10"
                class="range-input"
              >
              <span class="range-value">{{ config.maxNameLength }} caracteres</span>
            </div>

            <div class="config-item">
              <label>
                <input type="checkbox" v-model="config.removeAccents">
                Remover acentos y caracteres especiales de los nombres
              </label>
            </div>
          </div>

          <!-- Configuración de notificaciones -->
          <div class="config-section">
            <h4>🔔 Notificaciones</h4>
            
            <div class="config-item">
              <label>
                <input type="checkbox" v-model="config.showNotifications">
                Mostrar notificaciones del sistema
              </label>
            </div>

            <div class="config-item">
              <label>
                <input type="checkbox" v-model="config.soundNotifications">
                Reproducir sonido al completar generación
              </label>
            </div>

            <div class="config-item">
              <label for="notificationDuration">Duración de notificaciones (segundos):</label>
              <input 
                id="notificationDuration"
                v-model.number="config.notificationDuration" 
                type="number" 
                min="1" 
                max="10" 
                class="number-input"
              >
            </div>
          </div>

          <!-- Vista previa del nombre -->
          <div class="config-section">
            <h4>👁️ Vista Previa</h4>
            <div class="preview-box">
              <p><strong>Ejemplo de nombre de archivo:</strong></p>
              <code class="file-name-preview">{{ previewFileName }}</code>
              <p class="preview-note">
                Basado en: Juan Pérez, RUT 12345678-9, Enero 2024
              </p>
            </div>
          </div>
        </div>

          <!-- Footer moderno -->
          <div class="config-modal-footer">
            <button @click="resetToDefaults" class="btn-reset">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C9.61305 21 7.49394 19.9655 6.01562 18.3329" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 16V12H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Restaurar por defecto
            </button>
            <div class="footer-actions">
              <button @click="$emit('close')" class="btn-cancel">
                Cancelar
              </button>
              <button @click="saveConfig" class="btn-save" :disabled="isSaving">
                <svg v-if="isSaving" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-spin">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-opacity="0.25"/>
                  <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="7,3 7,8 15,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ isSaving ? 'Guardando...' : 'Guardar configuración' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ConfigService } from '../services/configService.js'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'config-updated'])

// Estado reactivo
const config = ref({
  defaultPdfPath: '',
  autoCreateFolder: true,
  maxLiquidaciones: 10,
  autoOpenPdf: true,
  showProgress: true,
  compressPdf: false,
  fileNameFormat: 'liq-mm-aaaa-rut-nombre',
  maxNameLength: 100,
  removeAccents: true,
  showNotifications: true,
  soundNotifications: false,
  notificationDuration: 3
})

const isSaving = ref(false)

// Computed
const previewFileName = computed(() => {
  const format = config.value.fileNameFormat
  const maxLength = config.value.maxNameLength
  
  let fileName = ''
  const exampleData = {
    mes: '01',
    año: '2024',
    rut: '12345678-9',
    nombre: config.value.removeAccents ? 'juan-perez' : 'juan-pérez'
  }
  
  switch (format) {
    case 'liq-mm-aaaa-rut-nombre':
      fileName = `liq-${exampleData.mes}-${exampleData.año}-${exampleData.rut}-${exampleData.nombre}.pdf`
      break
    case 'liquidacion-nombre-mm-aaaa':
      fileName = `liquidacion-${exampleData.nombre}-${exampleData.mes}-${exampleData.año}.pdf`
      break
    case 'aaaa-mm-rut-nombre':
      fileName = `${exampleData.año}-${exampleData.mes}-${exampleData.rut}-${exampleData.nombre}.pdf`
      break
    case 'nombre-liquidacion-mm-aaaa':
      fileName = `${exampleData.nombre}-liquidacion-${exampleData.mes}-${exampleData.año}.pdf`
      break
    default:
      fileName = `liq-${exampleData.mes}-${exampleData.año}-${exampleData.rut}-${exampleData.nombre}.pdf`
  }
  
  if (fileName.length > maxLength) {
    fileName = fileName.substring(0, maxLength - 4) + '.pdf'
  }
  
  return fileName
})

// Métodos
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

const selectPdfFolder = async () => {
  try {
    const selectedPath = await ConfigService.selectFolder()
    if (selectedPath) {
      config.value.defaultPdfPath = selectedPath
    }
  } catch (error) {
    console.error('Error selecting folder:', error)
  }
}

const saveConfig = async () => {
  isSaving.value = true
  
  try {
    const success = await ConfigService.saveAllConfig(config.value)
    
    if (success) {
      emit('config-updated')
      emit('close')
    } else {
      throw new Error('Error al guardar la configuración')
    }
  } catch (error) {
    console.error('Error saving config:', error)
    alert('Error al guardar la configuración: ' + error.message)
  } finally {
    isSaving.value = false
  }
}

const resetToDefaults = async () => {
  if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto?')) {
    try {
      await ConfigService.resetConfig()
      await loadConfig()
    } catch (error) {
      console.error('Error resetting config:', error)
    }
  }
}

const loadConfig = async () => {
  try {
    const loadedConfig = await ConfigService.getAllConfig()
    config.value = { ...config.value, ...loadedConfig }
  } catch (error) {
    console.error('Error loading config:', error)
  }
}

// Watchers
watch(() => props.show, (newValue) => {
  if (newValue) {
    loadConfig()
  }
})

// Lifecycle
onMounted(() => {
  if (props.show) {
    loadConfig()
  }
})
</script>

<style scoped>
/* === MODAL OVERLAY Y CONTAINER === */
.config-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: var(--space-4);
}

.config-modal-container {
  background: white;
  border-radius: 24px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* === HEADER MODERNO === */
.config-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6) var(--space-8);
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
  border-bottom: 1px solid var(--primary-200);
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.header-icon {
  width: 48px;
  height: 48px;
  background: var(--primary-500);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.header-text {
  flex: 1;
}

.modal-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0 0 var(--space-1) 0;
  line-height: 1.2;
}

.modal-subtitle {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  margin: 0;
  line-height: 1.4;
}

.btn-close-modern {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  color: var(--gray-600);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  backdrop-filter: blur(10px);
}

.btn-close-modern:hover {
  background: rgba(255, 255, 255, 1);
  color: var(--gray-900);
  transform: scale(1.05);
}

/* === CONTENT === */
.config-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-8);
}

/* === SECCIONES DE CONFIGURACIÓN === */
.config-section {
  margin-bottom: var(--space-8);
  padding: var(--space-6);
  background: var(--gray-50);
  border-radius: 16px;
  border: 1px solid var(--gray-200);
  transition: all var(--transition-normal);
}

.config-section:hover {
  background: white;
  border-color: var(--primary-200);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.config-section:last-child {
  margin-bottom: 0;
}

.config-section h4 {
  margin: 0 0 var(--space-5) 0;
  color: var(--gray-900);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.config-item {
  margin-bottom: var(--space-5);
}

.config-item:last-child {
  margin-bottom: 0;
}

.config-item label {
  display: block;
  margin-bottom: var(--space-3);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
  font-size: var(--font-size-sm);
}

/* === INPUTS Y CONTROLES === */
.path-input-group {
  display: flex;
  gap: var(--space-3);
  align-items: stretch;
}

.path-input {
  flex: 1;
  padding: var(--space-4);
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  background: white;
  color: var(--gray-900);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.path-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-browse {
  padding: var(--space-4) var(--space-6);
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  white-space: nowrap;
}

.btn-browse:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.config-select,
.number-input {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.range-input {
  width: 100%;
  margin: var(--space-2) 0;
}

.range-value {
  display: inline-block;
  margin-left: var(--space-2);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
}

.config-help {
  margin-top: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.config-help code {
  background: var(--color-bg-secondary);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
}

.preview-box {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.file-name-preview {
  display: block;
  background: var(--color-bg-tertiary);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  margin: var(--space-2) 0;
  word-break: break-all;
}

.preview-note {
  margin: var(--space-2) 0 0 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-style: italic;
}

/* === FOOTER MODERNO === */
.config-modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-8);
  background: var(--gray-50);
  border-top: 1px solid var(--gray-200);
}

.footer-actions {
  display: flex;
  gap: var(--space-3);
}

/* === BOTONES MODERNOS === */
.btn-reset {
  padding: var(--space-3) var(--space-5);
  background: white;
  color: var(--gray-600);
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.btn-reset:hover {
  background: var(--gray-50);
  border-color: var(--gray-300);
  color: var(--gray-700);
}

.btn-cancel {
  padding: var(--space-3) var(--space-6);
  background: white;
  color: var(--gray-600);
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.btn-cancel:hover {
  background: var(--gray-50);
  border-color: var(--gray-300);
  color: var(--gray-700);
}

.btn-save {
  padding: var(--space-3) var(--space-6);
  background: var(--primary-500);
  color: white;
  border: 2px solid var(--primary-500);
  border-radius: 12px;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.btn-save:hover:not(:disabled) {
  background: var(--primary-600);
  border-color: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* === CHECKBOX STYLING === */
input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-right: var(--space-3);
  accent-color: var(--primary-500);
  cursor: pointer;
}

/* === TRANSICIONES === */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .config-modal-container,
.modal-leave-to .config-modal-container {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

.modal-enter-to .config-modal-container,
.modal-leave-from .config-modal-container {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* === RESPONSIVE DESIGN === */
@media (max-width: 768px) {
  .config-modal-overlay {
    padding: var(--space-2);
    align-items: flex-start;
    padding-top: var(--space-8);
  }

  .config-modal-container {
    max-width: 100%;
    margin: 0;
    border-radius: 20px 20px 0 0;
    max-height: calc(100vh - 2rem);
  }

  .config-modal-header {
    padding: var(--space-5) var(--space-6);
  }

  .header-icon {
    width: 40px;
    height: 40px;
  }

  .modal-title {
    font-size: var(--font-size-xl);
  }

  .config-modal-content {
    padding: var(--space-6);
  }

  .config-section {
    padding: var(--space-5);
    margin-bottom: var(--space-6);
  }

  .path-input-group {
    flex-direction: column;
    gap: var(--space-3);
  }

  .config-modal-footer {
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-5) var(--space-6);
  }

  .footer-actions {
    width: 100%;
    justify-content: center;
  }

  .btn-reset,
  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .config-modal-header {
    padding: var(--space-4) var(--space-5);
  }

  .config-modal-content {
    padding: var(--space-5);
  }

  .config-section {
    padding: var(--space-4);
  }
}
</style>
