<template>
  <div class="admin-license-generator">
    <!-- Header -->
    <div class="header">
      <h1 class="title">🔧 Generador de Licencias</h1>
      <p class="subtitle">Panel administrativo para generar códigos de licencia</p>
    </div>

    <!-- Formulario de Generación -->
    <div class="generator-form-card">
      <h2>📝 Generar Nueva Licencia</h2>
      
      <form @submit.prevent="generateLicense" class="generator-form">
        <div class="form-row">
          <div class="form-group">
            <label for="licenseType">Tipo de Licencia:</label>
            <select id="licenseType" v-model="formData.licenseType" class="form-select">
              <option value="standard">Estándar (2 años)</option>
              <option value="trial">Prueba (30 días)</option>
              <option value="extended">Extendida (5 años)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="quantity">Cantidad:</label>
            <input
              id="quantity"
              v-model.number="formData.quantity"
              type="number"
              min="1"
              max="100"
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="description">Descripción (opcional):</label>
            <input
              id="description"
              v-model="formData.description"
              type="text"
              class="form-input"
              placeholder="Ej: Licencias para cliente ABC"
            />
          </div>

          <div class="form-group">
            <label for="expiryDate">Fecha de Expiración Personalizada:</label>
            <input
              id="expiryDate"
              v-model="formData.customExpiryDate"
              type="date"
              class="form-input"
            />
            <small class="form-hint">Deja vacío para usar duración estándar</small>
          </div>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="generate-button"
            :disabled="isGenerating"
          >
            <span v-if="isGenerating" class="loading-spinner">⏳</span>
            <span v-else>🎫</span>
            {{ isGenerating ? 'Generando...' : 'Generar Licencias' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Licencias Generadas -->
    <div v-if="generatedLicenses.length > 0" class="generated-licenses-card">
      <div class="licenses-header">
        <h2>✅ Licencias Generadas</h2>
        <div class="header-actions">
          <button @click="exportLicenses" class="export-button">
            📄 Exportar CSV
          </button>
          <button @click="copyAllLicenses" class="copy-button">
            📋 Copiar Todas
          </button>
        </div>
      </div>

      <div class="licenses-grid">
        <div
          v-for="license in generatedLicenses"
          :key="license.code"
          class="license-card"
        >
          <div class="license-code">
            <span class="code-text">{{ license.code }}</span>
            <button @click="copyLicense(license.code)" class="copy-icon">
              📋
            </button>
          </div>
          <div class="license-details">
            <span class="detail">Tipo: {{ getLicenseTypeLabel(license.type) }}</span>
            <span class="detail">Expira: {{ formatDate(license.expiryDate) }}</span>
            <span class="detail">Estado: {{ license.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="stats-card">
      <h2>📊 Estadísticas</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">{{ stats.totalGenerated }}</span>
          <span class="stat-label">Total Generadas</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.activeCount }}</span>
          <span class="stat-label">Activas</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.usedCount }}</span>
          <span class="stat-label">En Uso</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.expiredCount }}</span>
          <span class="stat-label">Expiradas</span>
        </div>
      </div>
    </div>

    <!-- Gestión de Licencias Existentes -->
    <div class="management-card">
      <h2>🔍 Buscar y Gestionar Licencias</h2>
      
      <div class="search-section">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por código de licencia..."
          class="search-input"
          @input="searchLicenses"
        />
        <button @click="searchLicenses" class="search-button">
          🔍 Buscar
        </button>
      </div>

      <div v-if="searchResults.length > 0" class="search-results">
        <div
          v-for="license in searchResults"
          :key="license.code"
          class="result-item"
        >
          <div class="result-info">
            <span class="result-code">{{ license.code }}</span>
            <span class="result-status" :class="license.status">{{ license.status }}</span>
            <span class="result-date">{{ formatDate(license.createdAt) }}</span>
          </div>
          <div class="result-actions">
            <button
              v-if="license.status === 'available'"
              @click="revokeLicense(license.code)"
              class="revoke-button"
            >
              🚫 Revocar
            </button>
            <button @click="viewLicenseDetails(license)" class="details-button">
              👁️ Detalles
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div v-if="selectedLicense" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>📋 Detalles de Licencia</h3>
          <button @click="selectedLicense = null" class="close-button">✕</button>
        </div>
        <div class="modal-content">
          <div class="detail-row">
            <span class="detail-label">Código:</span>
            <span class="detail-value">{{ selectedLicense.code }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Estado:</span>
            <span class="detail-value" :class="selectedLicense.status">
              {{ selectedLicense.status }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tipo:</span>
            <span class="detail-value">{{ getLicenseTypeLabel(selectedLicense.type) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Creada:</span>
            <span class="detail-value">{{ formatDate(selectedLicense.createdAt) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Expira:</span>
            <span class="detail-value">{{ formatDate(selectedLicense.expiryDate) }}</span>
          </div>
          <div v-if="selectedLicense.userId" class="detail-row">
            <span class="detail-label">Usuario:</span>
            <span class="detail-value">{{ selectedLicense.userEmail }}</span>
          </div>
          <div v-if="selectedLicense.activatedOn" class="detail-row">
            <span class="detail-label">Activada:</span>
            <span class="detail-value">{{ formatDate(selectedLicense.activatedOn) }}</span>
          </div>
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
import { ref, reactive, onMounted } from 'vue'
import { db } from '../services/firebase.js'
import { collection, addDoc, query, where, getDocs, updateDoc, doc, getCountFromServer } from 'firebase/firestore'
import CryptoService from '../services/CryptoService.js'

// Estado reactivo
const formData = reactive({
  licenseType: 'standard',
  quantity: 1,
  description: '',
  customExpiryDate: ''
})

const isGenerating = ref(false)
const generatedLicenses = ref([])
const searchQuery = ref('')
const searchResults = ref([])
const selectedLicense = ref(null)
const statusMessage = ref('')
const statusMessageType = ref('info')

const stats = reactive({
  totalGenerated: 0,
  activeCount: 0,
  usedCount: 0,
  expiredCount: 0
})

// Métodos
const generateLicense = async () => {
  try {
    isGenerating.value = true
    const licenses = []

    for (let i = 0; i < formData.quantity; i++) {
      const licenseCode = CryptoService.generateLicenseCode()
      const expiryDate = getExpiryDate(formData.licenseType, formData.customExpiryDate)
      
      const licenseData = {
        code: licenseCode,
        type: formData.licenseType,
        status: 'available',
        createdAt: Date.now(),
        expiryDate: expiryDate,
        description: formData.description || null,
        generatedBy: 'admin', // En una implementación real, usar el ID del admin
        validationCount: 0
      }

      // Guardar en Firestore
      await addDoc(collection(db, 'licenses'), {
        [licenseCode]: licenseData
      })

      licenses.push(licenseData)
    }

    generatedLicenses.value = licenses
    showStatusMessage(`${formData.quantity} licencia(s) generada(s) exitosamente`, 'success')
    
    // Actualizar estadísticas
    await loadStats()

  } catch (error) {
    console.error('Error generando licencias:', error)
    showStatusMessage('Error al generar licencias', 'error')
  } finally {
    isGenerating.value = false
  }
}

const getExpiryDate = (type, customDate) => {
  if (customDate) {
    return new Date(customDate).getTime()
  }

  const now = Date.now()
  switch (type) {
    case 'trial':
      return now + (30 * 24 * 60 * 60 * 1000) // 30 días
    case 'extended':
      return now + (5 * 365 * 24 * 60 * 60 * 1000) // 5 años
    default: // standard
      return now + (2 * 365 * 24 * 60 * 60 * 1000) // 2 años
  }
}

const searchLicenses = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  try {
    const q = query(
      collection(db, 'licenses'),
      where('code', '>=', searchQuery.value.toUpperCase()),
      where('code', '<=', searchQuery.value.toUpperCase() + '\uf8ff')
    )
    
    const querySnapshot = await getDocs(q)
    const results = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      Object.keys(data).forEach(code => {
        if (code.includes(searchQuery.value.toUpperCase())) {
          results.push({ ...data[code], code })
        }
      })
    })
    
    searchResults.value = results
  } catch (error) {
    console.error('Error buscando licencias:', error)
    showStatusMessage('Error al buscar licencias', 'error')
  }
}

const revokeLicense = async (licenseCode) => {
  try {
    const licenseDoc = doc(db, 'licenses', licenseCode)
    await updateDoc(licenseDoc, {
      status: 'revoked',
      revokedAt: Date.now(),
      revokedBy: 'admin'
    })
    
    showStatusMessage('Licencia revocada exitosamente', 'success')
    await searchLicenses()
    await loadStats()
  } catch (error) {
    console.error('Error revocando licencia:', error)
    showStatusMessage('Error al revocar licencia', 'error')
  }
}

const viewLicenseDetails = (license) => {
  selectedLicense.value = license
}

const copyLicense = async (code) => {
  try {
    await navigator.clipboard.writeText(code)
    showStatusMessage('Código copiado al portapapeles', 'success')
  } catch (error) {
    console.error('Error copiando código:', error)
    showStatusMessage('Error al copiar código', 'error')
  }
}

const copyAllLicenses = async () => {
  try {
    const codes = generatedLicenses.value.map(l => l.code).join('\n')
    await navigator.clipboard.writeText(codes)
    showStatusMessage('Todos los códigos copiados al portapapeles', 'success')
  } catch (error) {
    console.error('Error copiando códigos:', error)
    showStatusMessage('Error al copiar códigos', 'error')
  }
}

const exportLicenses = () => {
  const csvContent = [
    'Código,Tipo,Estado,Creada,Expira,Descripción',
    ...generatedLicenses.value.map(l => 
      `${l.code},${l.type},${l.status},${formatDate(l.createdAt)},${formatDate(l.expiryDate)},"${l.description || ''}"`
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `licencias_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const loadStats = async () => {
  try {
    // En una implementación real, estas consultas deberían optimizarse
    const licensesRef = collection(db, 'licenses')
    
    const totalSnapshot = await getCountFromServer(licensesRef)
    stats.totalGenerated = totalSnapshot.data().count

    // Para simplificar, usaremos valores simulados
    // En producción, se harían consultas específicas por estado
    stats.activeCount = Math.floor(stats.totalGenerated * 0.7)
    stats.usedCount = Math.floor(stats.totalGenerated * 0.2)
    stats.expiredCount = Math.floor(stats.totalGenerated * 0.1)
    
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  }
}

const getLicenseTypeLabel = (type) => {
  const labels = {
    'standard': 'Estándar',
    'trial': 'Prueba',
    'extended': 'Extendida'
  }
  return labels[type] || type
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
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
  loadStats()
})
</script>

<style scoped>
.admin-license-generator {
  max-width: 1400px;
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

.generator-form-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.generator-form-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
}

.generator-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2d3748;
}

.form-input,
.form-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
}

.form-hint {
  font-size: 0.875rem;
  color: #718096;
}

.form-actions {
  display: flex;
  justify-content: center;
}

.generate-button {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.generate-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.generate-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.generated-licenses-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.licenses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.licenses-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.export-button,
.copy-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-button {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.copy-button {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #2d3748;
}

.licenses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
}

.license-card {
  background: #f7fafc;
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid #e2e8f0;
}

.license-code {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.code-text {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  font-size: 1rem;
  color: #2d3748;
}

.copy-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.copy-icon:hover {
  background: #e2e8f0;
}

.license-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail {
  font-size: 0.875rem;
  color: #4a5568;
}

.stats-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.stats-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.management-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.management-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
}

.search-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
}

.search-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.result-code {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #2d3748;
}

.result-status {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  width: fit-content;
}

.result-status.available {
  background: #c6f6d5;
  color: #22543d;
}

.result-status.used {
  background: #bee3f8;
  color: #2c5282;
}

.result-status.expired {
  background: #fed7d7;
  color: #c53030;
}

.result-status.revoked {
  background: #e2e8f0;
  color: #4a5568;
}

.result-date {
  font-size: 0.875rem;
  color: #718096;
}

.result-actions {
  display: flex;
  gap: 0.5rem;
}

.revoke-button,
.details-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.revoke-button {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  color: #c53030;
}

.details-button {
  background: linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%);
  color: #2c5282;
}

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
}

.modal {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  padding: 0.25rem;
  border-radius: 4px;
}

.close-button:hover {
  background: #f7fafc;
}

.modal-content {
  padding: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f7fafc;
}

.detail-label {
  font-weight: 600;
  color: #4a5568;
}

.detail-value {
  color: #2d3748;
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
  .admin-license-generator {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .licenses-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .licenses-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .search-section {
    flex-direction: column;
  }

  .result-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .result-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
