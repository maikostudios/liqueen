<template>
  <div class="register-container">
    <!-- Banner de modo desarrollo -->
    <div v-if="isDevelopmentMode" class="dev-banner">
      🧪 <strong>MODO DESARROLLO</strong> - Usa las licencias de prueba:
      <br>
      <code>LIQ-2025-TEST-0001-MAIK</code> |
      <code>LIQ-2025-DEMO-0001-STUD</code> |
      <code>LIQ-2025-ADMIN-0001-SAEZ</code>
    </div>

    <!-- Header -->
    <div class="register-header">
      <div class="logo-section">
        <h1 class="app-title">🏢 Liqueen</h1>
        <p class="app-subtitle">Generador de Liquidaciones Profesional</p>
      </div>
    </div>

    <!-- Formulario de Registro -->
    <div class="register-form-container">
      <div class="register-form">
        <h2 class="form-title">📝 Registro de Usuario</h2>
        <p class="form-description">
          Ingresa tus datos y código de licencia para activar Liqueen
        </p>

        <!-- Paso 1: Datos Personales -->
        <form v-if="currentStep === 1" @submit.prevent="nextStep" class="form">
          <!-- Nombre -->
          <div class="form-group">
            <label for="name" class="form-label">
              👤 Nombre Completo
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              class="form-input"
              placeholder="Tu nombre completo"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Teléfono -->
          <div class="form-group">
            <label for="phone" class="form-label">
              📱 Teléfono
            </label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              class="form-input"
              placeholder="+56 9 1234 5678"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">
              📧 Correo Electrónico
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="form-input"
              placeholder="tu@email.com"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Contraseña -->
          <div class="form-group">
            <label for="password" class="form-label">
              🔒 Contraseña
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="form-input"
              placeholder="Mínimo 6 caracteres"
              required
              minlength="6"
              :disabled="isLoading"
            />
          </div>

          <!-- Confirmar Contraseña -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label">
              🔒 Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              class="form-input"
              placeholder="Repite tu contraseña"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Botón Siguiente -->
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isLoading || !isStep1Valid"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            {{ isLoading ? 'Validando...' : 'Siguiente →' }}
          </button>
        </form>

        <!-- Paso 2: Código de Licencia -->
        <form v-if="currentStep === 2" @submit.prevent="handleRegister" class="form">
          <!-- Código de Licencia -->
          <div class="form-group">
            <label for="licenseCode" class="form-label">
              🎫 Código de Licencia
            </label>
            <input
              id="licenseCode"
              v-model="formData.licenseCode"
              type="text"
              class="form-input license-input"
              placeholder="LIQ-2025-XXXX-YYYY-ZZZZ"
              required
              :disabled="isLoading"
              @input="formatLicenseCode"
            />
            <small class="form-hint">
              Formato: LIQ-YYYY-XXXX-YYYY-ZZZZ
            </small>
          </div>

          <!-- Estado de Validación de Licencia -->
          <div v-if="licenseValidationStatus" class="validation-status" :class="licenseValidationClass">
            <span class="status-icon">{{ licenseValidationIcon }}</span>
            <span class="status-text">{{ licenseValidationMessage }}</span>
          </div>

          <!-- Mensajes de Error -->
          <div v-if="errorMessage" class="error-message">
            ❌ {{ errorMessage }}
          </div>

          <!-- Mensajes de Éxito -->
          <div v-if="successMessage" class="success-message">
            ✅ {{ successMessage }}
          </div>

          <!-- Botones de Navegación -->
          <div class="form-buttons">
            <button
              type="button"
              class="btn btn-secondary"
              @click="previousStep"
              :disabled="isLoading"
            >
              ← Anterior
            </button>

            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isLoading || !isLicenseValid"
            >
              <span v-if="isLoading" class="loading-spinner">⏳</span>
              <span v-else>🚀</span>
              {{ isLoading ? 'Registrando...' : 'Completar Registro' }}
            </button>
          </div>
        </form>

        <!-- Link a Login -->
        <div class="form-footer">
          <p class="login-link">
            ¿Ya tienes cuenta?
            <router-link to="/login" class="link">Iniciar Sesión</router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Información de Licencia -->
    <div class="license-info">
      <h3>📋 Información de Licencia</h3>
      <ul>
        <li>✅ Validez: 2 años desde la activación</li>
        <li>🔒 Vinculada a este dispositivo</li>
        <li>🌐 Funciona online y offline</li>
        <li>🔄 Renovación automática disponible</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import LicenseService from '../services/LicenseService.js'
import CryptoService from '../services/CryptoService.js'

const router = useRouter()

// Estado del formulario
const formData = ref({
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  licenseCode: ''
})

// Estado de pasos
const currentStep = ref(1)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isDevelopmentMode = ref(import.meta.env.DEV)

// Estado de validación de licencia
const licenseValidationStatus = ref('')
const licenseValidationMessage = ref('')
const isLicenseValid = ref(false)

// Validación del paso 1
const isStep1Valid = computed(() => {
  return (
    formData.value.name &&
    formData.value.phone &&
    formData.value.email &&
    formData.value.password &&
    formData.value.confirmPassword &&
    formData.value.password === formData.value.confirmPassword &&
    formData.value.password.length >= 6
  )
})

// Clases y iconos para validación de licencia
const licenseValidationClass = computed(() => {
  if (licenseValidationStatus.value === 'valid') return 'validation-success'
  if (licenseValidationStatus.value === 'invalid') return 'validation-error'
  if (licenseValidationStatus.value === 'checking') return 'validation-checking'
  return ''
})

const licenseValidationIcon = computed(() => {
  if (licenseValidationStatus.value === 'valid') return '✅'
  if (licenseValidationStatus.value === 'invalid') return '❌'
  if (licenseValidationStatus.value === 'checking') return '⏳'
  return ''
})

// Navegación entre pasos
const nextStep = () => {
  if (currentStep.value === 1 && isStep1Valid.value) {
    currentStep.value = 2
    errorMessage.value = ''
  }
}

const previousStep = () => {
  if (currentStep.value === 2) {
    currentStep.value = 1
    errorMessage.value = ''
    licenseValidationStatus.value = ''
    licenseValidationMessage.value = ''
    isLicenseValid.value = false
  }
}

// Formatear código de licencia mientras se escribe
const formatLicenseCode = async (event) => {
  let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')

  // Aplicar formato LIQ-YYYY-XXXX-YYYY-ZZZZ
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
    value = value.substring(0, 18) + '-' + value.substring(18)
  }
  if (value.length > 23) {
    value = value.substring(0, 23)
  }

  formData.value.licenseCode = value

  // Validar código en tiempo real si tiene el formato correcto
  if (CryptoService.validateLicenseCodeFormat(value)) {
    await validateLicenseCode(value)
  } else {
    licenseValidationStatus.value = ''
    licenseValidationMessage.value = ''
    isLicenseValid.value = false
  }
}

// Validar código de licencia en tiempo real
const validateLicenseCode = async (code) => {
  try {
    licenseValidationStatus.value = 'checking'
    licenseValidationMessage.value = 'Validando código de licencia...'
    isLicenseValid.value = false

    // Verificar si el código existe y está disponible
    const isValid = await LicenseService.validateLicenseCode(code)

    if (isValid) {
      licenseValidationStatus.value = 'valid'
      licenseValidationMessage.value = 'Código de licencia válido ✅'
      isLicenseValid.value = true
    } else {
      licenseValidationStatus.value = 'invalid'
      licenseValidationMessage.value = 'Código de licencia inválido o ya usado ❌'
      isLicenseValid.value = false
    }
  } catch (error) {
    console.error('Error validando código de licencia:', error)
    licenseValidationStatus.value = 'invalid'
    licenseValidationMessage.value = 'Error al validar código de licencia'
    isLicenseValid.value = false
  }
}

// Manejar registro
const handleRegister = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // Validar contraseñas
    if (formData.value.password !== formData.value.confirmPassword) {
      throw new Error('Las contraseñas no coinciden')
    }

    // Validar formato de licencia
    if (!CryptoService.validateLicenseCodeFormat(formData.value.licenseCode)) {
      throw new Error('Formato de código de licencia inválido')
    }

    // Registrar usuario
    const result = await LicenseService.registerUserWithLicense(
      formData.value.email,
      formData.value.password,
      formData.value.licenseCode,
      formData.value.name,
      formData.value.phone
    )

    if (result.success) {
      successMessage.value = `¡Registro exitoso! Licencia activada por ${result.daysRemaining} días`
      
      // Redirigir a la aplicación después de 2 segundos
      setTimeout(() => {
        router.push('/app')
      }, 2000)
    }

  } catch (error) {
    console.error('Error en registro:', error)
    errorMessage.value = error.message || 'Error en el registro'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.dev-banner {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #92400e;
  padding: 1rem 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #fcd34d;
  max-width: 600px;
  width: 100%;
}

.dev-banner code {
  background: rgba(146, 64, 14, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  margin: 0 0.25rem;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.app-title {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.app-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0.5rem 0 0 0;
}

.register-form-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.form-description {
  color: #718096;
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
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
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.license-input {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  letter-spacing: 1px;
}

.form-hint {
  color: #718096;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
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
  width: 100%;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex: 1;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
  color: white;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.validation-status {
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.validation-success {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.validation-error {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.validation-checking {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.form-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.login-link {
  color: #718096;
  margin: 0;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

.license-info {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 1.5rem;
  max-width: 500px;
  width: 100%;
}

.license-info h3 {
  color: #2d3748;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
}

.license-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.license-info li {
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
</style>
