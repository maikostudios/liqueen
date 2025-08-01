<template>
  <div class="mass-upload-container">
    <!-- Header con información -->
    <div class="upload-header">
      <h3>📊 Carga Masiva de Liquidaciones</h3>
      <p class="upload-description">
        Sube un archivo Excel o Google Sheets con hasta 10 trabajadores para generar múltiples liquidaciones de una vez.
      </p>
    </div>

    <!-- Botones de acción -->
    <div class="action-buttons">
      <button @click="downloadTemplate" class="btn-secondary">
        📥 Descargar Plantilla
      </button>
    </div>

    <!-- Zona de carga de archivos -->
    <div class="upload-section">
      <DragDropZone
        v-if="!uploadedFile"
        title="Arrastra tu archivo Excel aquí"
        subtitle="o haz clic para seleccionar"
        accept=".xlsx,.xls,.csv"
        accepted-types="Excel (.xlsx, .xls) o CSV"
        :max-size="10 * 1024 * 1024"
        @file-selected="handleFileSelected"
        @file-processed="handleFileProcessed"
        @file-error="handleFileError"
      />
      
      <!-- Archivo cargado -->
      <div v-else class="file-uploaded">
        <div class="file-info">
          <span class="file-icon">📊</span>
          <div class="file-details">
            <h4>{{ uploadedFile.name }}</h4>
            <p>{{ liquidaciones.length }} liquidaciones encontradas</p>
          </div>
          <button @click="clearFile" class="btn-remove">
            ❌ Quitar
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla de vista previa -->
    <div v-if="liquidaciones.length > 0" class="preview-section">
      <h4>📋 Vista Previa de Liquidaciones</h4>
      
      <div class="table-container">
        <table class="liquidaciones-table">
          <thead>
            <tr>
              <th>Trabajador</th>
              <th>RUT</th>
              <th>Cargo</th>
              <th>Sueldo Base</th>
              <th>Período</th>
              <th>Total Haberes</th>
              <th>Total Descuentos</th>
              <th>Líquido</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(liquidacion, index) in liquidaciones" :key="index" class="liquidacion-row">
              <td class="worker-name">{{ liquidacion.trabajador.nombre }}</td>
              <td class="worker-rut">{{ liquidacion.trabajador.rut }}</td>
              <td class="worker-cargo">{{ liquidacion.trabajador.cargo }}</td>
              <td class="amount">{{ formatCurrency(liquidacion.haberes.sueldoBase) }}</td>
              <td class="period">{{ formatPeriod(liquidacion.periodo) }}</td>
              <td class="amount positive">{{ formatCurrency(calculateTotalHaberes(liquidacion)) }}</td>
              <td class="amount negative">{{ formatCurrency(calculateTotalDescuentos(liquidacion)) }}</td>
              <td class="amount liquid">{{ formatCurrency(calculateLiquido(liquidacion)) }}</td>
              <td class="actions">
                <button @click="editLiquidacion(index)" class="btn-edit" title="Editar">
                  ✏️
                </button>
                <button @click="removeLiquidacion(index)" class="btn-remove-small" title="Eliminar">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Resumen -->
      <div class="summary-section">
        <div class="summary-card">
          <h5>📊 Resumen</h5>
          <div class="summary-stats">
            <div class="stat">
              <span class="stat-label">Total Liquidaciones:</span>
              <span class="stat-value">{{ liquidaciones.length }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Total Haberes:</span>
              <span class="stat-value positive">{{ formatCurrency(totalHaberes) }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Total Descuentos:</span>
              <span class="stat-value negative">{{ formatCurrency(totalDescuentos) }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Total Líquido:</span>
              <span class="stat-value liquid">{{ formatCurrency(totalLiquido) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="generate-section">
        <button 
          @click="generateAllPDFs" 
          class="btn-primary btn-large"
          :disabled="liquidaciones.length === 0 || isGenerating"
        >
          <span v-if="isGenerating">⏳ Generando PDFs...</span>
          <span v-else>📄 Generar Todas las Liquidaciones ({{ liquidaciones.length }})</span>
        </button>
        
        <div class="generate-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="autoOpenPDFs">
            <span>Abrir PDFs automáticamente</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="showProgress">
            <span>Mostrar progreso detallado</span>
          </label>
        </div>
      </div>

      <!-- Barra de progreso -->
      <div v-if="isGenerating && showProgress" class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <p class="progress-text">
          {{ currentProgress }} de {{ liquidaciones.length }} liquidaciones generadas ({{ progressPercentage }}%)
        </p>
        <p v-if="currentFileName" class="current-file">
          Generando: {{ currentFileName }}
        </p>
      </div>
    </div>

    <!-- Modal de edición de liquidación -->
    <EditLiquidacionModal
      :show="showEditModal"
      :liquidacion="editingLiquidacion"
      @close="showEditModal = false"
      @save="handleLiquidacionSaved"
    />

    <!-- Notificaciones -->
    <div v-if="showToast" :class="['simple-toast', `toast-${toastType}`]">
      <span>{{ toastMessage }}</span>
      <button @click="showToast = false" class="toast-close">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ExcelService } from '../services/excelService.js'
import { ConfigService } from '../services/configService.js'
import { LiquidacionService } from '../services/liquidacionService.js'
import { LiquidacionGenerator } from '../services/liquidacionGenerator.js'
import { DataTransformService } from '../services/dataTransformService.js'
import DragDropZone from './DragDropZone.vue'
import EditLiquidacionModal from './EditLiquidacionModal.vue'


// Props
const props = defineProps({
  logoData: {
    type: String,
    default: null
  }
})

// Emits
const emit = defineEmits(['liquidaciones-generated', 'error'])

// Estado reactivo
const uploadedFile = ref(null)
const liquidaciones = ref([])
const showEditModal = ref(false)
const editingLiquidacion = ref(null)
const editingIndex = ref(-1)
const isGenerating = ref(false)
const currentProgress = ref(0)
const currentFileName = ref('')
const autoOpenPDFs = ref(true)
const showProgress = ref(true)

// Toast notifications
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('info')

// Computed
const progressPercentage = computed(() => {
  if (liquidaciones.value.length === 0) return 0
  return Math.round((currentProgress.value / liquidaciones.value.length) * 100)
})

const totalHaberes = computed(() => {
  return liquidaciones.value.reduce((total, liq) => total + calculateTotalHaberes(liq), 0)
})

const totalDescuentos = computed(() => {
  return liquidaciones.value.reduce((total, liq) => total + calculateTotalDescuentos(liq), 0)
})

const totalLiquido = computed(() => {
  return liquidaciones.value.reduce((total, liq) => total + calculateLiquido(liq), 0)
})

// Métodos
const handleFileSelected = async (file) => {
  uploadedFile.value = file
  showToast.value = true
  toastMessage.value = `Archivo seleccionado: ${file.name}`
  toastType.value = 'info'

  // Procesar directamente aquí con un pequeño delay
  setTimeout(() => {
    handleFileProcessed(file)
  }, 200)
}

const handleFileProcessed = async (file) => {
  console.log('🚀 === INICIANDO handleFileProcessed ===')
  console.log('📁 Archivo recibido:', file)

  try {
    console.log('🔍 Procesando archivo:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    console.log('📦 ExcelService disponible:', !!ExcelService)
    console.log('📦 Método readExcelFile disponible:', !!ExcelService.readExcelFile)
    console.log('📦 XLSX disponible:', typeof window.XLSX !== 'undefined')

    showToast.value = true
    toastMessage.value = 'Procesando archivo...'
    toastType.value = 'info'

    const result = await ExcelService.readExcelFile(file)

    console.log('📊 Resultado del ExcelService:', result)

    if (result.success) {
      liquidaciones.value = result.data
      console.log('✅ Liquidaciones cargadas:', result.data)
      showToast.value = true
      toastMessage.value = `✅ ${result.data.length} liquidaciones cargadas exitosamente`
      toastType.value = 'success'

      emit('liquidaciones-generated', result.data)
    } else {
      console.error('❌ Error en ExcelService:', result.error)
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Error processing file:', error)
    showToast.value = true
    toastMessage.value = `❌ Error: ${error.message}`
    toastType.value = 'error'
    
    emit('error', error.message)
  }
}

const handleFileError = (error) => {
  showToast.value = true
  toastMessage.value = `❌ ${error}`
  toastType.value = 'error'
  
  emit('error', error)
}

const clearFile = () => {
  uploadedFile.value = null
  liquidaciones.value = []
  currentProgress.value = 0
  currentFileName.value = ''
}

// Función para transformar datos del Excel al formato estándar del generador
const transformLiquidacionForGenerator = (liquidacion) => {
  // Usar el servicio centralizado de transformación
  return DataTransformService.fromExcel(liquidacion)
}



const downloadTemplate = () => {
  try {
    ExcelService.generateTemplate()
    showToast.value = true
    toastMessage.value = '📥 Plantilla descargada exitosamente'
    toastType.value = 'success'
  } catch (error) {
    console.error('Error downloading template:', error)
    showToast.value = true
    toastMessage.value = '❌ Error al descargar la plantilla'
    toastType.value = 'error'
  }
}

const editLiquidacion = (index) => {
  editingLiquidacion.value = { ...liquidaciones.value[index] }
  editingIndex.value = index
  showEditModal.value = true
}

const removeLiquidacion = (index) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta liquidación?')) {
    liquidaciones.value.splice(index, 1)
    showToast.value = true
    toastMessage.value = 'Liquidación eliminada'
    toastType.value = 'info'
  }
}

const handleLiquidacionSaved = (liquidacion) => {
  liquidaciones.value[editingIndex.value] = liquidacion
  showEditModal.value = false
  showToast.value = true
  toastMessage.value = 'Liquidación actualizada'
  toastType.value = 'success'
}



const generateAllPDFs = async () => {
  if (liquidaciones.value.length === 0) return

  isGenerating.value = true
  currentProgress.value = 0
  
  try {
    const defaultPath = await ConfigService.getDefaultPdfPath()

    console.log('🎯 Iniciando generación de PDFs:', {
      cantidad: liquidaciones.value.length,
      logoData: props.logoData ? 'Logo personalizado cargado' : 'Sin logo personalizado',
      defaultPath,
      electronAPI: !!window.electronAPI,
      isElectron: window.electronAPI ? 'SÍ' : 'NO'
    })

    for (let i = 0; i < liquidaciones.value.length; i++) {
      const liquidacion = liquidaciones.value[i]

      // Transformar datos para el generador usando el servicio centralizado
      const transformedData = transformLiquidacionForGenerator(liquidacion)

      // Generar nombre de archivo usando el servicio centralizado
      currentFileName.value = DataTransformService.generateFileName(transformedData)

      console.log(`📄 Generando PDF ${i + 1}/${liquidaciones.value.length}:`, {
        trabajador: liquidacion.trabajador.nombre,
        fileName: currentFileName.value
      })

      try {
        console.log(`🔄 Datos transformados para ${liquidacion.trabajador.nombre}:`, transformedData)

        // Generar PDF
        console.log(`🖼️ Logo data para ${liquidacion.trabajador.nombre}:`, props.logoData ? 'Logo presente' : 'Sin logo')
        const result = await LiquidacionGenerator.generateAndSave(transformedData, props.logoData, defaultPath, currentFileName.value)
        console.log(`✅ PDF ${i + 1} generado:`, result)
      } catch (pdfError) {
        console.error(`❌ Error generando PDF ${i + 1}:`, pdfError)
        // Continuar con el siguiente PDF en lugar de parar todo
      }

      currentProgress.value = i + 1

      // Pequeña pausa para mostrar progreso
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    showToast.value = true
    toastMessage.value = `✅ ${liquidaciones.value.length} liquidaciones generadas exitosamente`
    toastType.value = 'success'
    
    if (autoOpenPDFs.value && window.electronAPI) {
      await window.electronAPI.openExternal(defaultPath)
    }
    
  } catch (error) {
    console.error('Error generating PDFs:', error)
    showToast.value = true
    toastMessage.value = `❌ Error generando PDFs: ${error.message}`
    toastType.value = 'error'
  } finally {
    isGenerating.value = false
    currentFileName.value = ''
  }
}

// Funciones de cálculo
const calculateTotalHaberes = (liquidacion) => {
  const haberes = liquidacion.haberes
  return (haberes.sueldoBase || 0) + 
         (haberes.horasExtra || 0) * (haberes.valorHoraExtra || 0) +
         (haberes.bonos || 0) + 
         (haberes.comision || 0) + 
         (haberes.otrosHaberes || 0)
}

const calculateTotalDescuentos = (liquidacion) => {
  const descuentos = liquidacion.descuentos
  const haberes = calculateTotalHaberes(liquidacion)
  
  // Calcular descuentos legales
  const descuentoAFP = haberes * 0.1 // 10% AFP
  const descuentoSalud = haberes * 0.07 // 7% Fonasa
  
  return descuentoAFP + descuentoSalud + 
         (descuentos.otrosDescuentos || 0)
}

const calculateLiquido = (liquidacion) => {
  return calculateTotalHaberes(liquidacion) - calculateTotalDescuentos(liquidacion)
}

// Funciones de formato
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount || 0)
}

const formatPeriod = (periodo) => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  return `${meses[periodo.mes - 1]} ${periodo.año}`
}

// Lifecycle
onMounted(async () => {
  // Cargar configuración inicial
  autoOpenPDFs.value = await ConfigService.getConfig('autoOpenPdf') ?? true
  showProgress.value = await ConfigService.getConfig('showProgress') ?? true
})
</script>

<style scoped>
/* Layout principal */
.mass-upload-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
}

.upload-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.upload-header h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 24px;
}

.upload-description {
  color: #6c757d;
  font-size: 16px;
  margin: 0;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.btn-secondary {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

/* Sección de vista previa */
.preview-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-section h4 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 20px;
}

/* Tabla */
.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.liquidaciones-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.liquidaciones-table th,
.liquidaciones-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.liquidaciones-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
  position: sticky;
  top: 0;
  z-index: 10;
}

.liquidaciones-table tr:hover {
  background: #f8f9fa;
}

/* Botones de acción en tabla */
.btn-small {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 6px;
}

/* Sección de generación */
.generation-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.btn-large {
  padding: 15px 30px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}

.generate-options {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #007bff;
}

/* Progreso */
.progress-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 14px;
  color: #6c757d;
}

/* Estados */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn:disabled:hover {
  transform: none !important;
  box-shadow: none !important;
}

/* Toast simple */
.simple-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  animation: slideIn 0.3s ease;
}

.toast-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.toast-close:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #333;
}

.toast-success {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-color: #b8dacc;
  color: #155724;
}

.toast-error {
  background: linear-gradient(135deg, #f8d7da 0%, #f1b0b7 100%);
  border-color: #f1b0b7;
  color: #721c24;
}

.toast-warning {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-color: #ffeaa7;
  color: #856404;
}

.toast-info {
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
  border-color: #bee5eb;
  color: #0c5460;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
