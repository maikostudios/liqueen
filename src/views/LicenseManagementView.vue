<template>
  <div class="license-management">
    <!-- Header -->
    <div class="header">
      <h1 class="title">🎫 Gestión de Licencias</h1>
      <p class="subtitle">Administra tu licencia de Liqueen</p>
    </div>

    <!-- Estado de Licencia Actual -->
    <div class="license-status-card">
      <div class="status-header">
        <h2>📜 Estado de Licencia</h2>
        <div class="status-indicator" :class="licenseStatusClass">
          <span class="status-dot"></span>
          <span class="status-text">{{ licenseStatusText }}</span>
        </div>
      </div>

      <div v-if="licenseStatus" class="license-details">
        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">Código de Licencia:</span>
            <span class="value code">{{ licenseStatus.licenseCode }}</span>
          </div>
          
          <div class="detail-item">
            <span class="label">Días Restantes:</span>
            <span class="value" :class="getDaysRemainingClass(licenseStatus.daysRemaining)">
              {{ licenseStatus.daysRemaining }} días
            </span>
          </div>
          
          <div class="detail-item">
            <span class="label">Fecha de Expiración:</span>
            <span class="value">{{ formatDate(licenseStatus.expiryDate) }}</span>
          </div>
          
          <div class="detail-item">
            <span class="label">Última Validación:</span>
            <span class="value">{{ formatDate(licenseStatus.lastValidation) }}</span>
          </div>
          
          <div class="detail-item">
            <span class="label">Modo de Conexión:</span>
            <span class="value" :class="licenseStatus.isOnline ? 'online' : 'offline'">
              {{ licenseStatus.isOnline ? '🌐 Online' : '🔒 Offline' }}
            </span>
          </div>
        </div>

        <!-- Alertas -->
        <div v-if="licenseStatus.needsOnlineValidation" class="alert warning">
          ⚠️ Se requiere validación online pronto
        </div>
        
        <div v-if="licenseStatus.daysRemaining <= 30" class="alert" :class="licenseStatus.daysRemaining <= 7 ? 'critical' : 'warning'">
          {{ licenseStatus.daysRemaining <= 7 ? '🚨' : '⚠️' }} 
          Tu licencia expira en {{ licenseStatus.daysRemaining }} días
        </div>
      </div>
    </div>

    <!-- Acciones de Licencia -->
    <div class="actions-section">
      <h3>🔧 Acciones</h3>
      
      <div class="action-buttons">
        <!-- Validar Online -->
        <button 
          @click="validateOnline" 
          class="action-button primary"
          :disabled="isLoading"
        >
          <span v-if="isValidating" class="loading-spinner">⏳</span>
          <span v-else>🌐</span>
          Validar Online
        </button>

        <!-- Renovar Licencia -->
        <button 
          @click="showRenewalForm = true" 
          class="action-button secondary"
          :disabled="isLoading"
        >
          <span>🔄</span>
          Renovar Licencia
        </button>

        <!-- Verificar Actualizaciones -->
        <button 
          @click="checkUpdates" 
          class="action-button tertiary"
          :disabled="isLoading"
        >
          <span v-if="isCheckingUpdates" class="loading-spinner">⏳</span>
          <span v-else>📦</span>
          Verificar Actualizaciones
        </button>
      </div>
    </div>

    <!-- Formulario de Renovación -->
    <div v-if="showRenewalForm" class="renewal-form-overlay">
      <div class="renewal-form">
        <h3>🔄 Renovar Licencia</h3>
        <p>Ingresa tu nuevo código de licencia para renovar</p>
        
        <form @submit.prevent="handleRenewal">
          <div class="form-group">
            <label for="newLicenseCode">Nuevo Código de Licencia:</label>
            <input
              id="newLicenseCode"
              v-model="newLicenseCode"
              type="text"
              class="form-input"
              placeholder="LIQ-2025-XXXX-YYYY"
              required
              :disabled="isRenewing"
              @input="formatLicenseCode"
            />
          </div>

          <div v-if="renewalError" class="error-message">
            ❌ {{ renewalError }}
          </div>

          <div v-if="renewalSuccess" class="success-message">
            ✅ {{ renewalSuccess }}
          </div>

          <div class="form-buttons">
            <button 
              type="button" 
              @click="cancelRenewal" 
              class="button secondary"
              :disabled="isRenewing"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="button primary"
              :disabled="isRenewing || !isRenewalFormValid"
            >
              <span v-if="isRenewing" class="loading-spinner">⏳</span>
              <span v-else>🔄</span>
              {{ isRenewing ? 'Renovando...' : 'Renovar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Información de Actualizaciones -->
    <div v-if="updateInfo" class="update-info-card">
      <h3>📦 Actualización Disponible</h3>
      <div class="update-details">
        <p><strong>Nueva Versión:</strong> {{ updateInfo.latestVersion }}</p>
        <p><strong>Versión Actual:</strong> {{ updateInfo.currentVersion }}</p>
        <p><strong>Fecha de Lanzamiento:</strong> {{ formatDate(updateInfo.updateInfo.releaseDate) }}</p>
        
        <div v-if="updateInfo.updateInfo.changelog" class="changelog">
          <h4>Novedades:</h4>
          <ul>
            <li v-for="change in updateInfo.updateInfo.changelog" :key="change">
              {{ change }}
            </li>
          </ul>
        </div>

        <div class="update-actions">
          <button @click="downloadUpdate" class="button primary">
            📥 Descargar Actualización
          </button>
          <button @click="updateInfo = null" class="button secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Mensajes de Estado -->
    <div v-if="statusMessage" class="status-message" :class="statusMessageType">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LicenseService from '../services/LicenseService.js'
import UpdateService from '../services/UpdateService.js'
import CryptoService from '../services/CryptoService.js'

// Estado reactivo
const licenseStatus = ref(null)
const isLoading = ref(false)
const isValidating = ref(false)
const isCheckingUpdates = ref(false)
const isRenewing = ref(false)
const showRenewalForm = ref(false)
const newLicenseCode = ref('')
const renewalError = ref('')
const renewalSuccess = ref('')
const updateInfo = ref(null)
const statusMessage = ref('')
const statusMessageType = ref('info')

// Computed properties
const licenseStatusClass = computed(() => {
  if (!licenseStatus.value) return 'unknown'
  if (!licenseStatus.value.isValid) return 'invalid'
  if (licenseStatus.value.daysRemaining <= 7) return 'critical'
  if (licenseStatus.value.daysRemaining <= 30) return 'warning'
  return 'valid'
})

const licenseStatusText = computed(() => {
  if (!licenseStatus.value) return 'Desconocido'
  if (!licenseStatus.value.isValid) return 'Inválida'
  if (licenseStatus.value.daysRemaining <= 7) return 'Crítica'
  if (licenseStatus.value.daysRemaining <= 30) return 'Por Vencer'
  return 'Activa'
})

const isRenewalFormValid = computed(() => {
  return newLicenseCode.value && CryptoService.validateLicenseCodeFormat(newLicenseCode.value)
})

// Métodos
const loadLicenseStatus = async () => {
  try {
    isLoading.value = true
    const status = await LicenseService.getLicenseStatus()
    licenseStatus.value = status
  } catch (error) {
    console.error('Error cargando estado de licencia:', error)
    showStatusMessage('Error al cargar el estado de la licencia', 'error')
  } finally {
    isLoading.value = false
  }
}

const validateOnline = async () => {
  try {
    isValidating.value = true
    const result = await LicenseService.performPeriodicValidation()
    
    if (result.success) {
      showStatusMessage('Validación online exitosa', 'success')
      await loadLicenseStatus()
    } else {
      showStatusMessage(result.error || 'Error en la validación online', 'error')
    }
  } catch (error) {
    console.error('Error en validación online:', error)
    showStatusMessage('Error al validar online', 'error')
  } finally {
    isValidating.value = false
  }
}

const checkUpdates = async () => {
  try {
    isCheckingUpdates.value = true
    const result = await UpdateService.checkForUpdates()
    
    if (result.hasUpdate) {
      updateInfo.value = result
      showStatusMessage('Nueva actualización disponible', 'info')
    } else {
      showStatusMessage('La aplicación está actualizada', 'success')
    }
  } catch (error) {
    console.error('Error verificando actualizaciones:', error)
    showStatusMessage('Error al verificar actualizaciones', 'error')
  } finally {
    isCheckingUpdates.value = false
  }
}

const handleRenewal = async () => {
  try {
    isRenewing.value = true
    renewalError.value = ''
    renewalSuccess.value = ''

    const result = await LicenseService.renewLicense(newLicenseCode.value)
    
    if (result.success) {
      renewalSuccess.value = `Licencia renovada exitosamente. ${result.daysRemaining} días restantes.`
      setTimeout(() => {
        showRenewalForm.value = false
        loadLicenseStatus()
      }, 2000)
    }
  } catch (error) {
    console.error('Error renovando licencia:', error)
    renewalError.value = error.message || 'Error al renovar la licencia'
  } finally {
    isRenewing.value = false
  }
}

const cancelRenewal = () => {
  showRenewalForm.value = false
  newLicenseCode.value = ''
  renewalError.value = ''
  renewalSuccess.value = ''
}

const formatLicenseCode = (event) => {
  let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
  
  if (value.length > 3) {
    value = value.substring(0, 3) + '-' + value.substring(3)
  }
  if (value.length > 8) {
    value = value.substring(0, 8) + '-' + value.substring(8)
  }
  if (value.length > 13) {
    value = value.substring(0, 13) + '-' + value.substring(13)
  }
  if (value.length > 18) {
    value = value.substring(0, 18)
  }
  
  newLicenseCode.value = value
}

const downloadUpdate = () => {
  if (updateInfo.value?.updateInfo?.downloadUrl) {
    window.open(updateInfo.value.updateInfo.downloadUrl, '_blank')
  }
}

const getDaysRemainingClass = (days) => {
  if (days > 30) return 'good'
  if (days > 7) return 'warning'
  return 'critical'
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const showStatusMessage = (message, type = 'info') => {
  statusMessage.value = message
  statusMessageType.value = type
  setTimeout(() => {
    statusMessage.value = ''
  }, 5000)
}

// Lifecycle
onMounted(() => {
  loadLicenseStatus()
})
</script>

<style scoped>
.license-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #f7fafc;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  font-size: 1.2rem;
  color: #718096;
  margin: 0;
}

.license-status-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.status-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
}

.status-indicator.valid {
  background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
  color: #22543d;
}

.status-indicator.warning {
  background: linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%);
  color: #c05621;
}

.status-indicator.critical {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  color: #c53030;
}

.status-indicator.invalid {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
  color: #4a5568;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 12px;
}

.label {
  font-weight: 500;
  color: #4a5568;
}

.value {
  font-weight: 600;
  color: #2d3748;
}

.value.code {
  font-family: 'Courier New', monospace;
  background: #edf2f7;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.value.good {
  color: #38a169;
}

.value.warning {
  color: #d69e2e;
}

.value.critical {
  color: #e53e3e;
}

.value.online {
  color: #38a169;
}

.value.offline {
  color: #d69e2e;
}

.alert {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 500;
}

.alert.warning {
  background: linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%);
  color: #c05621;
}

.alert.critical {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  color: #c53030;
}

.actions-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.actions-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-button {
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-button.primary {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.action-button.secondary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-button.tertiary {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #2d3748;
}

.action-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.renewal-form-overlay {
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
}

.renewal-form {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.renewal-form h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.renewal-form p {
  color: #718096;
  margin: 0 0 1.5rem 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
}

.error-message {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  color: #c53030;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-weight: 500;
}

.success-message {
  background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
  color: #22543d;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-weight: 500;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.button.primary {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.button.secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.update-info-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.update-info-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1rem 0;
}

.update-details p {
  margin: 0.5rem 0;
  color: #4a5568;
}

.changelog {
  margin: 1rem 0;
}

.changelog h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.changelog ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #4a5568;
}

.changelog li {
  margin-bottom: 0.25rem;
}

.update-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.status-message {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.status-message.success {
  background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
  color: #22543d;
}

.status-message.error {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  color: #c53030;
}

.status-message.info {
  background: linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%);
  color: #2c5282;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .license-management {
    padding: 1rem;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }

  .status-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .form-buttons {
    flex-direction: column;
  }

  .update-actions {
    flex-direction: column;
  }
}
</style>
