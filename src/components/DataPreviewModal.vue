<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <!-- Header del modal -->
      <div class="modal-header">
        <div class="modal-title-section">
          <h3 class="modal-title">📋 Previsualización de Datos</h3>
          <p class="modal-subtitle">Revisa los datos y confirma para habilitar la generación de PDF</p>
        </div>
        <button class="modal-close" @click="closeModal" aria-label="Cerrar modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Contenido del modal -->
      <div class="modal-content">
        <div v-if="data" class="data-preview">
          <!-- Información del empleador -->
          <div class="data-section">
            <h4 class="section-title">🏢 Información del Empleador</h4>
            <div class="data-grid">
              <div class="data-item">
                <span class="data-label">Empleador:</span>
                <span class="data-value">{{ data.empleador || 'No especificado' }}</span>
              </div>
              <div class="data-item">
                <span class="data-label">RUT:</span>
                <span class="data-value">{{ data.rutEmpleador || 'No especificado' }}</span>
              </div>
              <div class="data-item">
                <span class="data-label">Área:</span>
                <span class="data-value">{{ data.area || 'No especificado' }}</span>
              </div>
              <div class="data-item">
                <span class="data-label">Período:</span>
                <span class="data-value">{{ data.mes || 'No especificado' }}</span>
              </div>
            </div>
          </div>

          <!-- Información del trabajador -->
          <div class="data-section">
            <h4 class="section-title">👤 Información del Trabajador</h4>
            <div class="data-grid">
              <div class="data-item">
                <span class="data-label">Nombre:</span>
                <span class="data-value">{{ data.trabajador?.nombre || 'No especificado' }}</span>
              </div>
              <div class="data-item">
                <span class="data-label">RUT:</span>
                <span class="data-value">{{ data.trabajador?.rut || 'No especificado' }}</span>
              </div>
              <div class="data-item">
                <span class="data-label">Cargo:</span>
                <span class="data-value">{{ data.trabajador?.cargo || 'No especificado' }}</span>
              </div>
              <div class="data-item">
                <span class="data-label">Inicio Contrato:</span>
                <span class="data-value">{{ data.trabajador?.inicioContrato || 'No especificado' }}</span>
              </div>
            </div>
          </div>

          <!-- Información salarial -->
          <div class="data-section">
            <h4 class="section-title">💰 Información Salarial</h4>
            <div class="data-grid">
              <div class="data-item">
                <span class="data-label">Sueldo Base:</span>
                <span class="data-value">{{ formatCurrency(data.trabajador?.sueldoBase) }}</span>
              </div>
              <div class="data-item">
                <span class="data-label">Días Trabajados:</span>
                <span class="data-value">{{ data.trabajador?.diasTrabajados || 0 }} días</span>
              </div>
              <div class="data-item">
                <span class="data-label">Días Vacaciones:</span>
                <span class="data-value">{{ data.trabajador?.diasVacaciones || 0 }} días</span>
              </div>
              <div class="data-item">
                <span class="data-label">Tipo Contrato:</span>
                <span class="data-value">{{ data.trabajador?.tipoContrato || 'No especificado' }}</span>
              </div>
              <div class="data-item">
                <span class="data-label">Previsión:</span>
                <span class="data-value">{{ data.trabajador?.prevision || 'No especificado' }}</span>
              </div>
              <div class="data-item">
                <span class="data-label">Salud:</span>
                <span class="data-value">{{ data.trabajador?.salud || 'No especificado' }}</span>
              </div>
            </div>
          </div>

          <!-- Haberes Imponibles -->
          <div v-if="data.haberesImponibles && data.haberesImponibles.length > 0" class="data-section">
            <h4 class="section-title">➕ Haberes Imponibles</h4>
            <div class="haberes-list">
              <div v-for="(haber, index) in data.haberesImponibles" :key="index" class="haber-item">
                <span class="haber-concepto">{{ haber.concepto }}</span>
                <span class="haber-monto">{{ formatCurrency(haber.monto) }}</span>
              </div>
            </div>
          </div>

          <!-- Haberes No Imponibles -->
          <div v-if="data.haberesNoImponibles && data.haberesNoImponibles.length > 0" class="data-section">
            <h4 class="section-title">💰 Haberes No Imponibles</h4>
            <div class="haberes-list">
              <div v-for="(haber, index) in data.haberesNoImponibles" :key="index" class="haber-item">
                <span class="haber-concepto">{{ haber.concepto }}</span>
                <span class="haber-monto">{{ formatCurrency(haber.monto) }}</span>
              </div>
            </div>
          </div>

          <!-- Descuentos Legales -->
          <div v-if="data.descuentosLegales && data.descuentosLegales.length > 0" class="data-section">
            <h4 class="section-title">⚖️ Descuentos Legales</h4>
            <div class="descuentos-list">
              <div v-for="(descuento, index) in data.descuentosLegales" :key="index" class="descuento-item">
                <span class="descuento-concepto">{{ descuento.concepto }}</span>
                <span class="descuento-monto">{{ formatCurrency(descuento.monto) }}</span>
              </div>
            </div>
          </div>

          <!-- Otros Descuentos -->
          <div v-if="data.otrosDescuentos && data.otrosDescuentos.length > 0" class="data-section">
            <h4 class="section-title">➖ Otros Descuentos</h4>
            <div class="descuentos-list">
              <div v-for="(descuento, index) in data.otrosDescuentos" :key="index" class="descuento-item">
                <span class="descuento-concepto">{{ descuento.concepto }}</span>
                <span class="descuento-monto">{{ formatCurrency(descuento.monto) }}</span>
              </div>
            </div>
          </div>

          <!-- Resumen Financiero -->
          <div class="data-section summary-section">
            <h4 class="section-title">📊 Resumen Financiero</h4>
            <div class="summary-grid">
              <div class="summary-item positive">
                <span class="summary-label">Total Haberes:</span>
                <span class="summary-value">{{ formatCurrency(calculateTotalHaberes()) }}</span>
              </div>
              <div class="summary-item negative">
                <span class="summary-label">Total Descuentos:</span>
                <span class="summary-value">{{ formatCurrency(calculateTotalDescuentos()) }}</span>
              </div>
              <div class="summary-item total">
                <span class="summary-label">Líquido a Pagar:</span>
                <span class="summary-value">{{ formatCurrency(calculateLiquidoAPagar()) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Instrucción -->
      <div class="instruction-banner">
        <div class="instruction-content">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="m9,12 2,2 4,-4"/>
          </svg>
          <span><strong>¡Datos cargados correctamente!</strong> Haz clic en "Usar Estos Datos" para habilitar la generación de PDF.</span>
        </div>
      </div>

      <!-- Footer del modal -->
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="closeModal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Cancelar
        </button>
        <button class="btn btn-primary" @click="confirmData">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          ✅ Usar Estos Datos para Generar PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'confirm'])

// Métodos
const closeModal = () => {
  console.log('❌ DataPreviewModal: closeModal called')
  emit('close')
}

const confirmData = () => {
  console.log('✅ DataPreviewModal: confirmData called with:', props.data)
  emit('confirm', props.data)
}

const handleOverlayClick = (event) => {
  console.log('🖱️ DataPreviewModal: overlay clicked')
  // Solo cerrar si se hace clic directamente en el overlay, no en sus hijos
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

// Formatear moneda
const formatCurrency = (value) => {
  if (!value && value !== 0) return 'No especificado'
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value)
}

// Calcular total de haberes
const calculateTotalHaberes = () => {
  if (!props.data) return 0

  let total = 0

  // Sumar haberes imponibles
  if (props.data.haberesImponibles) {
    total += props.data.haberesImponibles.reduce((sum, haber) => sum + (haber.monto || 0), 0)
  }

  // Sumar haberes no imponibles
  if (props.data.haberesNoImponibles) {
    total += props.data.haberesNoImponibles.reduce((sum, haber) => sum + (haber.monto || 0), 0)
  }

  return total
}

// Calcular total de descuentos
const calculateTotalDescuentos = () => {
  if (!props.data) return 0

  let total = 0

  // Sumar descuentos legales
  if (props.data.descuentosLegales) {
    total += props.data.descuentosLegales.reduce((sum, descuento) => sum + (descuento.monto || 0), 0)
  }

  // Sumar otros descuentos
  if (props.data.otrosDescuentos) {
    total += props.data.otrosDescuentos.reduce((sum, descuento) => sum + (descuento.monto || 0), 0)
  }

  return total
}

// Calcular líquido a pagar
const calculateLiquidoAPagar = () => {
  return calculateTotalHaberes() - calculateTotalDescuentos()
}

// Cerrar modal con tecla Escape
const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.isVisible) {
    console.log('⌨️ DataPreviewModal: Escape key pressed, closing modal')
    closeModal()
  }
}

// Agregar/remover listener de teclado
watch(() => props.isVisible, (newValue) => {
  console.log('👁️ DataPreviewModal: isVisible changed to:', newValue)
  if (newValue) {
    console.log('🎯 DataPreviewModal: Adding keyboard listener')
    document.addEventListener('keydown', handleKeydown)
  } else {
    console.log('🎯 DataPreviewModal: Removing keyboard listener')
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 9999;
  padding: var(--space-4);
  overflow-y: auto;
  min-height: 100vh;
}

.modal-container {
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  max-width: 800px;
  width: 100%;
  max-height: calc(100vh - 2rem);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  margin: var(--space-4) auto;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--space-4);
  border-bottom: 1px solid var(--gray-200);
  background: var(--gray-50);
  flex-shrink: 0;
}

.modal-title-section {
  flex: 1;
  min-width: 0;
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0 0 var(--space-1) 0;
}

.modal-subtitle {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  transition: var(--transition-fast);
  margin-left: var(--space-4);
}

.modal-close:hover {
  background: var(--gray-100);
  color: var(--gray-600);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
  min-height: 0;
}

.data-preview {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.data-section {
  background: var(--gray-50);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  border: 1px solid var(--gray-200);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-800);
  margin: 0 0 var(--space-4) 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
}

.data-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.data-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-600);
}

.data-value {
  font-size: var(--font-size-base);
  color: var(--gray-900);
  font-weight: var(--font-weight-medium);
}

.haberes-list,
.descuentos-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.haber-item,
.descuento-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
}

.haber-concepto,
.descuento-concepto {
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
}

.haber-monto {
  font-weight: var(--font-weight-semibold);
  color: var(--secondary-600);
}

.descuento-monto {
  font-weight: var(--font-weight-semibold);
  color: var(--danger-600);
}

.summary-section {
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%);
  border: 2px solid var(--primary-200);
}

.summary-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
}

.summary-item.positive {
  background: var(--success-50);
  border: 1px solid var(--success-200);
  color: var(--success-700);
}

.summary-item.negative {
  background: var(--danger-50);
  border: 1px solid var(--danger-200);
  color: var(--danger-700);
}

.summary-item.total {
  background: var(--primary-100);
  border: 2px solid var(--primary-300);
  color: var(--primary-800);
  font-size: var(--font-size-lg);
}

.summary-label {
  font-weight: var(--font-weight-semibold);
}

.summary-value {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
}

/* Banner de instrucción */
.instruction-banner {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: var(--space-4);
  margin: 0 -2rem -1px -2rem;
  border-top: 1px solid var(--gray-200);
}

.instruction-content {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.instruction-content svg {
  flex-shrink: 0;
  opacity: 0.9;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4);
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-xl);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  border: none;
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-secondary {
  background: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-secondary:hover {
  background: var(--gray-50);
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--space-2);
  }
  
  .modal-header,
  .modal-content,
  .modal-footer {
    padding: var(--space-3);
  }
  
  .data-section {
    padding: var(--space-3);
  }

  .data-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column;
  }

  .instruction-banner {
    margin: 0 -2rem;
  }
  
  .btn {
    justify-content: center;
  }

  .summary-item {
    flex-direction: column;
    text-align: center;
    gap: var(--space-2);
  }
}
</style>
