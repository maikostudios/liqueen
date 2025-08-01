<template>
  <div class="option-section">
    <h3>📝 Formulario Interactivo</h3>
    
    <!-- Datos de la Empresa -->
    <div class="form-section">
      <h4>🏢 Datos de la Empresa</h4>
      <div class="form-row">
        <div class="form-group">
          <label>Empleador:</label>
          <input type="text" v-model="localFormData.empleador" placeholder="Nombre de la empresa">
        </div>
        <div class="form-group">
          <label>RUT Empleador:</label>
          <input type="text" v-model="localFormData.rutEmpleador" placeholder="76.123.456-7">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Área:</label>
          <input type="text" v-model="localFormData.area" placeholder="Departamento o área">
        </div>
        <div class="form-group">
          <label>Mes:</label>
          <input type="text" v-model="localFormData.mes" placeholder="Enero 2024">
        </div>
      </div>
    </div>

    <!-- Datos del Trabajador -->
    <div class="form-section">
      <h4>👤 Datos del Trabajador</h4>
      <div class="form-row">
        <div class="form-group">
          <label>Nombre Completo:</label>
          <input type="text" v-model="localFormData.trabajador.nombre" placeholder="Juan Pérez González">
        </div>
        <div class="form-group">
          <label>RUT:</label>
          <input type="text" v-model="localFormData.trabajador.rut" placeholder="12.345.678-9">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Cargo:</label>
          <input type="text" v-model="localFormData.trabajador.cargo" placeholder="Analista">
        </div>
        <div class="form-group">
          <label>Tipo de Contrato:</label>
          <select v-model="localFormData.trabajador.tipoContrato">
            <option value="">Seleccionar...</option>
            <option value="Indefinido">Indefinido</option>
            <option value="Plazo Fijo">Plazo Fijo</option>
            <option value="Por Obra">Por Obra</option>
            <option value="Honorarios">Honorarios</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Fecha Inicio Contrato:</label>
          <input type="date" v-model="localFormData.trabajador.inicioContrato">
        </div>
        <div class="form-group">
          <label>Días Trabajados:</label>
          <input type="number" v-model.number="localFormData.trabajador.diasTrabajados" min="1" max="31">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Días Vacaciones:</label>
          <input type="number" v-model.number="localFormData.trabajador.diasVacaciones" min="0" max="31">
        </div>
        <div class="form-group">
          <label>Sueldo Base:</label>
          <input type="number" v-model.number="localFormData.trabajador.sueldoBase" min="0" step="1000">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Previsión:</label>
          <select v-model="localFormData.trabajador.prevision">
            <option value="">Seleccionar...</option>
            <option value="AFP Capital">AFP Capital</option>
            <option value="AFP Cuprum">AFP Cuprum</option>
            <option value="AFP Habitat">AFP Habitat</option>
            <option value="AFP Modelo">AFP Modelo</option>
            <option value="AFP PlanVital">AFP PlanVital</option>
            <option value="AFP ProVida">AFP ProVida</option>
            <option value="AFP Uno">AFP Uno</option>
          </select>
        </div>
        <div class="form-group">
          <label>Salud:</label>
          <select v-model="localFormData.trabajador.salud">
            <option value="">Seleccionar...</option>
            <option value="Fonasa">Fonasa</option>
            <option value="Isapre Banmédica">Isapre Banmédica</option>
            <option value="Isapre Colmena">Isapre Colmena</option>
            <option value="Isapre Consalud">Isapre Consalud</option>
            <option value="Isapre Cruz Blanca">Isapre Cruz Blanca</option>
            <option value="Isapre Nueva Masvida">Isapre Nueva Masvida</option>
            <option value="Isapre Vida Tres">Isapre Vida Tres</option>
            <option value="Otra">Otra</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Haberes Imponibles -->
    <DynamicList
      title="💰 Haberes Imponibles"
      :items="localFormData.haberesImponibles"
      @add-item="addHaberImponible"
      @remove-item="removeHaberImponible"
    />

    <!-- Haberes No Imponibles -->
    <DynamicList
      title="💵 Haberes No Imponibles"
      :items="localFormData.haberesNoImponibles"
      @add-item="addHaberNoImponible"
      @remove-item="removeHaberNoImponible"
    />

    <!-- Descuentos Legales -->
    <DynamicList
      title="⚖️ Descuentos Legales"
      :items="localFormData.descuentosLegales"
      @add-item="addDescuentoLegal"
      @remove-item="removeDescuentoLegal"
    />

    <!-- Otros Descuentos -->
    <DynamicList
      title="📋 Otros Descuentos"
      :items="localFormData.otrosDescuentos"
      @add-item="addOtroDescuento"
      @remove-item="removeOtroDescuento"
    />

    <!-- Totales Calculados -->
    <TotalsDisplay :totals="calculatedTotals" />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { LiquidacionService } from '../services/liquidacionService.js'
import DynamicList from './DynamicList.vue'
import TotalsDisplay from './TotalsDisplay.vue'

// Props y emits
const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['data-ready'])

// Estado local reactivo
const localFormData = ref({ ...props.formData })

// Totales calculados SIN mutaciones para evitar loops
const calculatedTotals = computed(() => {
  // Solo calcular, NO mutar localFormData aquí
  const formDataCopy = JSON.parse(JSON.stringify(localFormData.value))
  const result = LiquidacionService.calculateTotals(formDataCopy)

  // NO actualizar localFormData desde computed - esto causa loops infinitos
  return result
})

// Funciones para manejar listas dinámicas
const addHaberImponible = () => {
  localFormData.value.haberesImponibles.push({ concepto: '', monto: 0 })
}

const removeHaberImponible = (index) => {
  if (localFormData.value.haberesImponibles.length > 1) {
    localFormData.value.haberesImponibles.splice(index, 1)
  }
}

const addHaberNoImponible = () => {
  localFormData.value.haberesNoImponibles.push({ concepto: '', monto: 0 })
}

const removeHaberNoImponible = (index) => {
  if (localFormData.value.haberesNoImponibles.length > 1) {
    localFormData.value.haberesNoImponibles.splice(index, 1)
  }
}

const addDescuentoLegal = () => {
  localFormData.value.descuentosLegales.push({ concepto: '', monto: 0 })
}

const removeDescuentoLegal = (index) => {
  if (localFormData.value.descuentosLegales.length > 1) {
    localFormData.value.descuentosLegales.splice(index, 1)
  }
}

const addOtroDescuento = () => {
  localFormData.value.otrosDescuentos.push({ concepto: '', monto: 0 })
}

const removeOtroDescuento = (index) => {
  if (localFormData.value.otrosDescuentos.length > 1) {
    localFormData.value.otrosDescuentos.splice(index, 1)
  }
}

// Flag para evitar loops infinitos
let isUpdating = false

// Función para actualizar cálculos sin loops
const updateCalculations = () => {
  if (isUpdating) return

  isUpdating = true
  nextTick(() => {
    const result = LiquidacionService.calculateTotals(localFormData.value)
    if (result.updatedFormData) {
      // Actualizar solo si hay cambios reales
      const currentHaberes = JSON.stringify(localFormData.value.haberesImponibles)
      const newHaberes = JSON.stringify(result.updatedFormData.haberesImponibles)
      const currentDescuentos = JSON.stringify(localFormData.value.descuentosLegales)
      const newDescuentos = JSON.stringify(result.updatedFormData.descuentosLegales)

      if (currentHaberes !== newHaberes) {
        localFormData.value.haberesImponibles = [...result.updatedFormData.haberesImponibles]
      }
      if (currentDescuentos !== newDescuentos) {
        localFormData.value.descuentosLegales = [...result.updatedFormData.descuentosLegales]
      }
    }
    isUpdating = false
  })
}

// Watcher específico para sueldo base - recalcula automáticamente
watch(() => localFormData.value.trabajador?.sueldoBase, (newValue, oldValue) => {
  if (newValue !== oldValue && newValue && newValue > 0) {
    updateCalculations()
  }
})

// Watcher específico para días trabajados - recalcula automáticamente
watch(() => localFormData.value.trabajador?.diasTrabajados, (newValue, oldValue) => {
  if (newValue !== oldValue && newValue && newValue > 0) {
    updateCalculations()
  }
})

// Observar cambios en props (sin emitir para evitar loops)
watch(() => props.formData, (newData) => {
  if (newData && JSON.stringify(newData) !== JSON.stringify(localFormData.value)) {
    localFormData.value = JSON.parse(JSON.stringify(newData))
  }
}, { immediate: true, deep: true })

// Emitir cambios solo cuando el usuario modifica campos (no en watchers automáticos)
watch(localFormData, (newData) => {
  if (!isUpdating) {
    emit('data-ready', newData)
  }
}, { deep: true })
</script>
