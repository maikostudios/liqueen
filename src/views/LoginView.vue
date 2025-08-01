<template>
  <div class="login-container">
    <!-- Toggle de tema -->
    <ThemeToggle />

    <!-- Header -->
    <div class="login-header">
      <div class="logo-section">
        <div class="logo-container">
          <img src="/src/img/logos/liqueen_logo_sin_fondo.png" alt="Liqueen" class="main-logo" />
        </div>
        <p class="app-subtitle">Generador de Liquidaciones Profesional</p>
      </div>
    </div>

    <!-- Formulario de Login -->
    <div class="login-form-container">
      <div class="login-form">
        <h2 class="form-title">🔐 Iniciar Sesión</h2>
        <p class="form-description">
          Accede a tu cuenta para usar Liqueen
        </p>

        <!-- Indicador de Estado de Conexión -->
        <div class="connection-status" :class="connectionStatusClass">
          <span class="status-icon">{{ connectionStatusIcon }}</span>
          <span class="status-text">{{ connectionStatusText }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="form">
          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">
              📧 Correo Electrónico
            </label>
            <input id="email" v-model="formData.email" type="email" class="form-input" placeholder="tu@email.com"
              required :disabled="isLoading" />
          </div>

          <!-- Contraseña -->
          <div class="form-group">
            <label for="password" class="form-label">
              🔒 Contraseña
            </label>
            <input id="password" v-model="formData.password" type="password" class="form-input"
              placeholder="Tu contraseña" required :disabled="isLoading" />
          </div>

          <!-- Mensajes de Error -->
          <div v-if="errorMessage" class="error-message">
            ❌ {{ errorMessage }}
          </div>

          <!-- Mensajes de Éxito -->
          <div v-if="successMessage" class="success-message">
            ✅ {{ successMessage }}
          </div>

          <!-- Información de Modo Offline - Removido para mejor UX -->

          <!-- Botones de Login -->
          <div class="button-group">
            <!-- Botón Unificado de Login -->
            <button type="submit" @click="handleUnifiedLogin" class="login-button primary"
              :disabled="isLoading || !isFormValid">
              <span v-if="isLoading" class="loading-spinner">⏳</span>
              <span v-else-if="connectivityStatus === 'online'">🌐</span>
              <span v-else-if="connectivityStatus === 'offline'">🔒</span>
              <span v-else>🔍</span>
              {{ getLoginButtonText() }}
            </button>
          </div>
        </form>

        <!-- Link a Registro -->
        <div class="form-footer">
          <p class="register-link">
            ¿No tienes cuenta?
            <router-link to="/register" class="link">Registrarse</router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Información básica para producción (sin datos sensibles) -->
    <div v-if="registeredUser" class="device-info">
      <p class="device-registered">
        <span class="icon">🔒</span>
        Dispositivo registrado para: <strong>{{ registeredUser }}</strong>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LicenseService from '../services/LicenseService.js'
import ConnectivityService from '../services/ConnectivityService.js'
import ThemeToggle from '../components/ThemeToggle.vue'

const router = useRouter()

// Estado del formulario
const formData = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isOfflineMode = ref(false)
const registeredUser = ref(null)
const isOnline = ref(navigator.onLine)
const connectivityStatus = ref('checking') // 'checking', 'online', 'offline'
const connectivityDetails = ref(null)
const licenseStatus = ref(null)

// Validación del formulario
const isFormValid = computed(() => {
  return formData.value.email && formData.value.password
})

// Estado de conexión
const connectionStatusClass = computed(() => {
  return isOnline.value ? 'online' : 'offline'
})

const connectionStatusIcon = computed(() => {
  if (connectivityStatus.value === 'checking') return '🔍'
  return connectivityStatus.value === 'online' ? '🌐' : '📡'
})

const connectionStatusText = computed(() => {
  switch (connectivityStatus.value) {
    case 'checking':
      return 'Verificando conexión...'
    case 'online':
      return 'Conectado'
    case 'offline':
      return 'Desconectado - Modo Offline'
    default:
      return isOnline.value ? 'Conectado' : 'Sin conexión'
  }
})

// Verificar estado de licencia al cargar
onMounted(async () => {
  try {
    // Diagnóstico de localStorage
    console.log('🔍 Diagnóstico de localStorage:')
    console.log('- liqueen_license.lic:', !!localStorage.getItem('liqueen_license.lic'))
    console.log('- liqueen_user:', !!localStorage.getItem('liqueen_user'))

    // Cargar información del usuario registrado (solo para mostrar dispositivo registrado)
    const userData = await LicenseService.loadUserDataLocally()
    if (userData) {
      registeredUser.value = userData.email
      console.log('👤 Usuario registrado encontrado:', userData.email)
    }

    // Verificar licencia local
    const localLicense = await LicenseService.loadLicenseLocally()
    if (localLicense) {
      console.log('📄 Licencia local encontrada:', localLicense.licenseCode)
    } else {
      console.log('❌ No se encontró licencia local')
    }
  } catch (error) {
    console.log('❌ Error en diagnóstico inicial:', error)
  }

  // Verificación inicial de conectividad
  console.log('🔍 Verificación inicial de conectividad...')
  try {
    const connectivity = await ConnectivityService.performFullConnectivityCheck()
    connectivityDetails.value = connectivity
    connectivityStatus.value = connectivity.recommendedMode === 'online' ? 'online' : 'offline'
    console.log('✅ Estado inicial de conectividad:', connectivityStatus.value)
  } catch (error) {
    console.error('❌ Error verificando conectividad inicial:', error)
    connectivityStatus.value = 'offline'
  }

  // Escuchar cambios de conexión
  ConnectivityService.addConnectivityListener((isOnlineNow) => {
    isOnline.value = isOnlineNow
    console.log('🔄 Cambio de conectividad detectado:', isOnlineNow ? 'online' : 'offline')

    // Re-verificar conectividad cuando cambie el estado
    if (isOnlineNow) {
      ConnectivityService.performFullConnectivityCheck().then(connectivity => {
        connectivityDetails.value = connectivity
        connectivityStatus.value = connectivity.recommendedMode === 'online' ? 'online' : 'offline'
      })
    } else {
      connectivityStatus.value = 'offline'
    }
  })

  // Listeners legacy para compatibilidad
  window.addEventListener('online', () => {
    isOnline.value = true
  })

  window.addEventListener('offline', () => {
    isOnline.value = false
  })
})

// Manejar login online
const handleLogin = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    isOfflineMode.value = false

    const result = await LicenseService.loginUser(
      formData.value.email,
      formData.value.password
    )

    if (result.success) {
      if (result.isOffline) {
        isOfflineMode.value = true
        successMessage.value = `Acceso offline exitoso. ${result.daysRemaining} días restantes`

        if (result.needsOnlineValidation) {
          errorMessage.value = 'Se requiere validación online pronto'
        }
      } else {
        successMessage.value = `¡Bienvenido! ${result.daysRemaining} días restantes`
      }

      // Actualizar estado de licencia
      licenseStatus.value = {
        isValid: true,
        licenseCode: result.licenseData.licenseCode || 'N/A',
        daysRemaining: result.daysRemaining,
        isOnline: !result.isOffline,
        needsOnlineValidation: result.needsOnlineValidation
      }

      // Redirigir a la aplicación
      setTimeout(() => {
        router.push('/app')
      }, 1500)
    }

  } catch (error) {
    console.error('Error en login:', error)
    errorMessage.value = error.message || 'Error en el inicio de sesión'
  } finally {
    isLoading.value = false
  }
}

// Obtener texto del botón según estado de conectividad
const getLoginButtonText = () => {
  if (isLoading.value) {
    return connectivityStatus.value === 'online' ? 'Conectando...' : 'Verificando...'
  }

  // Siempre mostrar "Iniciar Sesión" - la lógica interna maneja online/offline
  return 'Iniciar Sesión'
}

// Método unificado de login con detección automática
const handleUnifiedLogin = async (event) => {
  event.preventDefault()

  try {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    console.log('🚀 Iniciando proceso de login unificado...')

    // Verificar si son credenciales maestras
    if (email.value === 'maikostudios@gmail.com') {
      console.log('🔑 Detectadas credenciales maestras, intentando login maestro...')
      await performMasterLogin()
      return
    }

    // Verificar conectividad completa
    connectivityStatus.value = 'checking'
    const connectivity = await ConnectivityService.performFullConnectivityCheck()
    connectivityDetails.value = connectivity

    console.log('📊 Estado de conectividad:', connectivity)

    // Determinar método de login basado en conectividad
    if (connectivity.recommendedMode === 'online') {
      console.log('🌐 Usando login online')
      connectivityStatus.value = 'online'
      await performOnlineLogin()
    } else {
      console.log('🔒 Usando login offline')
      connectivityStatus.value = 'offline'
      await performOfflineLogin()
    }

  } catch (error) {
    console.error('❌ Error en login unificado:', error)
    errorMessage.value = error.message || 'Error en el proceso de login'
  } finally {
    isLoading.value = false
  }
}

// Realizar login online
const performOnlineLogin = async () => {
  console.log('🌐 Ejecutando login online...')

  const result = await LicenseService.loginUser(
    formData.value.email,
    formData.value.password
  )

  if (result.success) {
    if (result.isOffline) {
      isOfflineMode.value = true
      successMessage.value = `Acceso offline exitoso. ${result.daysRemaining} días restantes`

      if (result.needsOnlineValidation) {
        errorMessage.value = 'Se requiere validación online pronto'
      }
    } else {
      successMessage.value = 'Login exitoso'
    }

    setTimeout(() => {
      router.push('/app')
    }, 1500)
  } else {
    throw new Error(result.message || 'Error en el login online')
  }
}

// Realizar login offline
const performOfflineLogin = async () => {
  console.log('🔒 Ejecutando login offline...')
  isOfflineMode.value = true

  const result = await LicenseService.loginOffline(formData.value.email, formData.value.password)

  if (result.success) {
    successMessage.value = `Acceso offline exitoso. ${result.daysRemaining} días restantes`

    if (result.needsOnlineValidation) {
      errorMessage.value = 'Se requiere validación online pronto'
    }

    setTimeout(() => {
      router.push('/app')
    }, 1500)
  } else {
    throw new Error(result.message || 'Error en el acceso offline')
  }
}

// Manejar login offline (método legacy - mantener por compatibilidad)
const handleOfflineLogin = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    isOfflineMode.value = true

    const result = await LicenseService.loginOffline(formData.value.email, formData.value.password)

    if (result.success) {
      successMessage.value = `Acceso offline exitoso. ${result.daysRemaining} días restantes`

      if (result.needsOnlineValidation) {
        errorMessage.value = 'Se requiere validación online pronto'
      }

      // Actualizar estado de licencia
      licenseStatus.value = {
        isValid: true,
        licenseCode: result.licenseData.licenseCode,
        daysRemaining: result.daysRemaining,
        isOnline: false,
        needsOnlineValidation: result.needsOnlineValidation
      }

      // Redirigir a la aplicación
      setTimeout(() => {
        router.push('/app')
      }, 1500)
    }

  } catch (error) {
    console.error('Error en login offline:', error)
    errorMessage.value = error.message || 'Error en el acceso offline'
  } finally {
    isLoading.value = false
  }
}

// Realizar login maestro
const performMasterLogin = async () => {
  try {
    console.log('🔑 Ejecutando login maestro...')

    const result = await LicenseService.loginMaster(formData.value.email, formData.value.password)

    if (result.success) {
      successMessage.value = '🔑 Acceso maestro autorizado - Modo Administrador'

      // Actualizar estado de licencia
      licenseStatus.value = {
        isValid: true,
        licenseCode: result.licenseData.licenseCode,
        daysRemaining: result.daysRemaining,
        isOnline: false,
        isMaster: true,
        permissions: result.licenseData.permissions
      }

      // Redirigir a la aplicación con permisos de administrador
      setTimeout(() => {
        router.push('/app')
      }, 1500)
    }

  } catch (error) {
    console.error('❌ Error en login maestro:', error)
    errorMessage.value = error.message || 'Credenciales maestras inválidas'
  }
}

// Obtener clase CSS para días restantes
const getDaysRemainingClass = (days) => {
  if (days > 30) return 'good'
  if (days > 7) return 'warning'
  return 'critical'
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: hidden;
}

.login-header {
  text-align: center;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.1rem;
}

.main-logo {
  height: 300px;
  max-width: 500px;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(251, 254, 253, 0.3));
  transition: transform 0.3s ease;
}

.main-logo:hover {
  transform: scale(1.02);
}

.app-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0rem 0 0 0;
}

.login-form-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 380px;
  flex-shrink: 0;
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
  margin-bottom: 1.5rem;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.connection-status.online {
  background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
  color: #22543d;
}

.connection-status.offline {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  color: #c53030;
}

.form-group {
  margin-bottom: 1rem;
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

.offline-info {
  background: linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%);
  color: #2c5282;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-weight: 500;
  text-align: center;
}

.offline-info small {
  display: block;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-button {
  width: 100%;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-button.primary {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.login-button.secondary {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #2d3748;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(79, 172, 254, 0.3);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.form-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.register-link {
  color: #718096;
  margin: 0;
}

.link {
  color: #4facfe;
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

/* Información del dispositivo */
.device-info {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 20px;
  text-align: center;
}

.device-registered {
  margin: 0;
  color: #0c4a6e;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.device-registered .icon {
  font-size: 1.1rem;
}

.device-registered strong {
  color: #0369a1;
}
</style>
