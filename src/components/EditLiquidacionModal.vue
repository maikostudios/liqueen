<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container edit-modal" @click.stop>
        <!-- Header -->
        <div class="modal-header">
          <h3>✏️ Editar Liquidación</h3>
          <button @click="$emit('close')" class="btn-close">✕</button>
        </div>

        <!-- Content -->
        <div class="modal-content" v-if="localLiquidacion">
          <!-- Datos del Trabajador -->
          <div class="form-section">
            <h4>👤 Datos del Trabajador</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label for="nombre">Nombre Completo *</label>
                <input 
                  id="nombre"
                  v-model="localLiquidacion.trabajador.nombre" 
                  type="text" 
                  class="form-input"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="rut">RUT *</label>
                <input 
                  id="rut"
                  v-model="localLiquidacion.trabajador.rut" 
                  type="text" 
                  class="form-input"
                  placeholder="12345678-9"
                  required
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="cargo">Cargo</label>
                <input 
                  id="cargo"
                  v-model="localLiquidacion.trabajador.cargo" 
                  type="text" 
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label for="fechaIngreso">Fecha de Ingreso</label>
                <input 
                  id="fechaIngreso"
                  v-model="localLiquidacion.trabajador.fechaIngreso" 
                  type="date" 
                  class="form-input"
                >
              </div>
            </div>
          </div>

          <!-- Período -->
          <div class="form-section">
            <h4>📅 Período</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label for="mes">Mes</label>
                <select id="mes" v-model="localLiquidacion.periodo.mes" class="form-select">
                  <option value="1">Enero</option>
                  <option value="2">Febrero</option>
                  <option value="3">Marzo</option>
                  <option value="4">Abril</option>
                  <option value="5">Mayo</option>
                  <option value="6">Junio</option>
                  <option value="7">Julio</option>
                  <option value="8">Agosto</option>
                  <option value="9">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="año">Año</label>
                <input 
                  id="año"
                  v-model.number="localLiquidacion.periodo.año" 
                  type="number" 
                  class="form-input"
                  min="2020"
                  max="2030"
                >
              </div>
            </div>
          </div>

          <!-- Haberes -->
          <div class="form-section">
            <h4>💰 Haberes</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label for="sueldoBase">Sueldo Base *</label>
                <input 
                  id="sueldoBase"
                  v-model.number="localLiquidacion.haberes.sueldoBase" 
                  type="number" 
                  class="form-input"
                  min="0"
                  step="1000"
                >
              </div>
              
              <div class="form-group">
                <label for="horasExtra">Horas Extra</label>
                <input 
                  id="horasExtra"
                  v-model.number="localLiquidacion.haberes.horasExtra" 
                  type="number" 
                  class="form-input"
                  min="0"
                  step="1"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="valorHoraExtra">Valor Hora Extra</label>
                <input 
                  id="valorHoraExtra"
                  v-model.number="localLiquidacion.haberes.valorHoraExtra" 
                  type="number" 
                  class="form-input"
                  min="0"
                  step="100"
                >
              </div>
              
              <div class="form-group">
                <label for="bonos">Bonos</label>
                <input 
                  id="bonos"
                  v-model.number="localLiquidacion.haberes.bonos" 
                  type="number" 
                  class="form-input"
                  min="0"
                  step="1000"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="comision">Comisión</label>
                <input 
                  id="comision"
                  v-model.number="localLiquidacion.haberes.comision" 
                  type="number" 
                  class="form-input"
                  min="0"
                  step="1000"
                >
              </div>
              
              <div class="form-group">
                <label for="otrosHaberes">Otros Haberes</label>
                <input 
                  id="otrosHaberes"
                  v-model.number="localLiquidacion.haberes.otrosHaberes" 
                  type="number" 
                  class="form-input"
                  min="0"
                  step="1000"
                >
              </div>
            </div>
          </div>

          <!-- Descuentos -->
          <div class="form-section">
            <h4>📉 Descuentos</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label for="diasAusencia">Días de Ausencia</label>
                <input 
                  id="diasAusencia"
                  v-model.number="localLiquidacion.descuentos.diasAusencia" 
                  type="number" 
                  class="form-input"
                  min="0"
                  max="31"
                  step="1"
                >
              </div>
              
              <div class="form-group">
                <label for="otrosDescuentos">Otros Descuentos</label>
                <input 
                  id="otrosDescuentos"
                  v-model.number="localLiquidacion.descuentos.otrosDescuentos" 
                  type="number" 
                  class="form-input"
                  min="0"
                  step="1000"
                >
              </div>
            </div>

            <!-- Descuentos calculados automáticamente -->
            <div class="calculated-discounts">
              <p class="discount-note">
                <strong>Descuentos Legales (calculados automáticamente):</strong>
              </p>
              <div class="discount-row">
                <span>AFP (10%):</span>
                <span class="discount-value">{{ formatCurrency(calculatedAFP) }}</span>
              </div>
              <div class="discount-row">
                <span>Salud (7%):</span>
                <span class="discount-value">{{ formatCurrency(calculatedSalud) }}</span>
              </div>
            </div>
          </div>

          <!-- Resumen -->
          <div class="form-section summary-section">
            <h4>📊 Resumen</h4>
            
            <div class="summary-grid">
              <div class="summary-item">
                <span class="summary-label">Total Haberes:</span>
                <span class="summary-value positive">{{ formatCurrency(totalHaberes) }}</span>
              </div>
              
              <div class="summary-item">
                <span class="summary-label">Total Descuentos:</span>
                <span class="summary-value negative">{{ formatCurrency(totalDescuentos) }}</span>
              </div>
              
              <div class="summary-item total">
                <span class="summary-label">Líquido a Pagar:</span>
                <span class="summary-value liquid">{{ formatCurrency(liquidoAPagar) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button @click="$emit('close')" class="btn-secondary">
            Cancelar
          </button>
          <button @click="saveLiquidacion" class="btn-primary" :disabled="!isValid">
            💾 Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  liquidacion: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'save'])

// Estado reactivo
const localLiquidacion = ref(null)

// Computed
const totalHaberes = computed(() => {
  if (!localLiquidacion.value) return 0
  
  const haberes = localLiquidacion.value.haberes
  return (haberes.sueldoBase || 0) + 
         (haberes.horasExtra || 0) * (haberes.valorHoraExtra || 0) +
         (haberes.bonos || 0) + 
         (haberes.comision || 0) + 
         (haberes.otrosHaberes || 0)
})

const calculatedAFP = computed(() => {
  return totalHaberes.value * 0.1 // 10% AFP
})

const calculatedSalud = computed(() => {
  return totalHaberes.value * 0.07 // 7% Fonasa
})

const totalDescuentos = computed(() => {
  if (!localLiquidacion.value) return 0
  
  return calculatedAFP.value + 
         calculatedSalud.value + 
         (localLiquidacion.value.descuentos.otrosDescuentos || 0)
})

const liquidoAPagar = computed(() => {
  return totalHaberes.value - totalDescuentos.value
})

const isValid = computed(() => {
  if (!localLiquidacion.value) return false
  
  return localLiquidacion.value.trabajador.nombre && 
         localLiquidacion.value.trabajador.rut &&
         localLiquidacion.value.haberes.sueldoBase > 0
})

// Métodos
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

const saveLiquidacion = () => {
  if (isValid.value) {
    emit('save', { ...localLiquidacion.value })
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount || 0)
}

// Watchers
watch(() => props.liquidacion, (newLiquidacion) => {
  if (newLiquidacion) {
    localLiquidacion.value = JSON.parse(JSON.stringify(newLiquidacion))
  }
}, { immediate: true })

watch(() => props.show, (newShow) => {
  if (newShow && props.liquidacion) {
    localLiquidacion.value = JSON.parse(JSON.stringify(props.liquidacion))
  }
})
</script>

<style scoped>
.edit-modal {
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-section {
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section h4 {
  margin: 0 0 var(--space-4) 0;
  color: var(--color-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: var(--space-2);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-input,
.form-select {
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.calculated-discounts {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-top: var(--space-4);
}

.discount-note {
  margin: 0 0 var(--space-3) 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.discount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.discount-value {
  font-weight: var(--font-weight-medium);
  color: var(--color-warning-dark);
}

.summary-section {
  background: var(--gradient-glass);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
}

.summary-grid {
  display: grid;
  gap: var(--space-3);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
}

.summary-item.total {
  background: var(--color-primary-light);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-lg);
}

.summary-label {
  color: var(--color-text-secondary);
}

.summary-value {
  font-weight: var(--font-weight-semibold);
}

.summary-value.positive {
  color: var(--color-success-dark);
}

.summary-value.negative {
  color: var(--color-error-dark);
}

.summary-value.liquid {
  color: var(--color-primary-dark);
  font-size: var(--font-size-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .edit-modal {
    max-width: 95vw;
    margin: var(--space-4);
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
  
  .modal-footer {
    flex-direction: column;
  }
}
</style>
