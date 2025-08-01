<template>
  <div class="form-section">
    <h4>📊 Totales (Calculados Automáticamente) <span class="auto-calc-indicator">🔄 En tiempo real</span></h4>
    <div class="auto-calc-notice">
      <small>💡 <strong>AUTOMÁTICO:</strong> Sueldo proporcional, AFP (11.45%), Fonasa (7%), Seguro Desempleo (0.6%) se calculan automáticamente</small>
    </div>
    <div class="calc-formula">
      <small>📐 <strong>Fórmula:</strong> Sueldo Base × (Días Trabajados ÷ 30) → Descuentos = % × Total Imponible</small>
    </div>
    <div class="totals-section">
      <div class="totals-grid">
        <div class="total-item">
          <span>Total Haberes:</span>
          <span class="amount">{{ formatMoney(totals.totalHaberes) }}</span>
        </div>
        <div class="total-item">
          <span>Total Descuentos:</span>
          <span class="amount">{{ formatMoney(totals.totalDescuentos) }}</span>
        </div>
        <div class="total-item">
          <span>Imp. Prev./Salud:</span>
          <span class="amount">{{ formatMoney(totals.impPrevSalud) }}</span>
        </div>
        <div class="total-item">
          <span>Seguro Desempleo:</span>
          <span class="amount">{{ formatMoney(totals.impSeguroDesempleo) }}</span>
        </div>
        <div class="total-item">
          <span>Base Tributable:</span>
          <span class="amount">{{ formatMoney(totals.baseTributable) }}</span>
        </div>
        <div class="total-item highlight">
          <span>LÍQUIDO A RECIBIR:</span>
          <span class="amount final">{{ formatMoney(totals.liquido) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LiquidacionService } from '../services/liquidacionService.js'

// Props
defineProps({
  totals: {
    type: Object,
    required: true
  }
})

// Función para formatear dinero
const formatMoney = (amount) => {
  return LiquidacionService.formatNumber(amount)
}
</script>

<style scoped>
.auto-calc-indicator {
  font-size: 12px;
  color: #4CAF50;
  font-weight: normal;
  animation: pulse 2s infinite;
}

.auto-calc-notice {
  background-color: #e8f5e8;
  border: 1px solid #4CAF50;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  color: #2e7d32;
}

.calc-formula {
  background-color: #fff3e0;
  border: 1px solid #ff9800;
  border-radius: 4px;
  padding: 6px;
  margin-bottom: 15px;
  color: #e65100;
  font-family: monospace;
}

.total-item.highlight {
  background-color: #e3f2fd;
  border: 2px solid #2196F3;
  border-radius: 6px;
  padding: 8px;
  font-weight: bold;
}

.amount {
  font-weight: bold;
  color: #1976d2;
}

.amount.final {
  font-size: 18px;
  color: #2e7d32;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>
