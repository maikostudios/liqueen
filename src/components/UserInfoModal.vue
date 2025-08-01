<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>👤 Información de Usuario</h3>
        <button @click="$emit('close')" class="close-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Información del Usuario -->
        <div class="user-section">
          <h4>📋 Datos del Usuario</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Nombre:</span>
              <span class="value">{{ userData?.displayName || userData?.name || 'No disponible' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">{{ userData?.email || 'No disponible' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Rol:</span>
              <span class="value" :class="getRoleClass(userData?.role)">
                {{ userData?.role === 'admin' ? '👑 Administrador' : '👤 Usuario' }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">Último acceso:</span>
              <span class="value">{{ formatDate(userData?.lastLogin) }}</span>
            </div>
          </div>
        </div>

        <!-- Estado de Licencia -->
        <div v-if="licenseStatus" class="license-section">
          <h4>📜 Estado de Licencia</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Código:</span>
              <span class="value license-code">{{ licenseStatus.licenseCode }}</span>
            </div>
            <div class="info-item">
              <span class="label">Estado:</span>
              <span class="value" :class="getStatusClass(licenseStatus.isValid)">
                {{ licenseStatus.isValid ? '✅ Válida' : '❌ Inválida' }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">Días restantes:</span>
              <span class="value" :class="getDaysClass(licenseStatus.daysRemaining)">
                {{ licenseStatus.daysRemaining }} días
              </span>
            </div>
            <div v-if="licenseStatus.needsOnlineValidation" class="info-item warning">
              <span class="label">⚠️ Requiere validación online</span>
            </div>
          </div>
        </div>

        <!-- Información del Sistema -->
        <div class="system-section">
          <h4>💻 Información del Sistema</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Aplicación:</span>
              <span class="value">Liqueen v2.1.0</span>
            </div>
            <div class="info-item">
              <span class="label">Desarrollado por:</span>
              <span class="value">Maiko Studios SPA</span>
            </div>
            <div class="info-item">
              <span class="label">Modo:</span>
              <span class="value">{{ licenseStatus?.isOffline ? '🔒 Offline' : '🌐 Online' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-secondary">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  userData: {
    type: Object,
    default: null
  },
  licenseStatus: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const handleOverlayClick = () => {
  emit('close')
}

const getRoleClass = (role) => {
  return role === 'admin' ? 'role-admin' : 'role-user'
}

const getStatusClass = (isValid) => {
  return isValid ? 'status-valid' : 'status-invalid'
}

const getDaysClass = (days) => {
  if (days > 30) return 'days-good'
  if (days > 7) return 'days-warning'
  return 'days-critical'
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'No disponible'
  return new Date(timestamp).toLocaleString('es-CL')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: #6b7280;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.user-section,
.license-section,
.system-section {
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e7eb;
}

.user-section h4,
.license-section h4,
.system-section h4 {
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item.warning {
  background: #fef3cd;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f59e0b;
  justify-content: center;
  color: #92400e;
  font-weight: 500;
}

.label {
  font-weight: 500;
  color: #6b7280;
}

.value {
  font-weight: 600;
  color: #1f2937;
}

.license-code {
  font-family: 'Courier New', monospace;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.role-admin {
  color: #dc2626;
}

.role-user {
  color: #059669;
}

.status-valid {
  color: #059669;
}

.status-invalid {
  color: #dc2626;
}

.days-good {
  color: #059669;
}

.days-warning {
  color: #d97706;
}

.days-critical {
  color: #dc2626;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
