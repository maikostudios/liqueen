<template>
  <div v-if="showModal" class="auth-modal-overlay" @click="closeModal">
    <div class="auth-modal" @click.stop>
      <div class="auth-header">
        <h2>{{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>

      <div class="auth-content">
        <!-- Formulario de Login -->
        <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              required
              :disabled="loading"
              placeholder="tu@email.com"
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              required
              :disabled="loading"
              placeholder="Tu contraseña"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
            </button>
            <button type="button" class="btn-link" @click="showForgotPassword = true">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>

        <!-- Formulario de Registro -->
        <form v-else @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="nombre">Nombre Completo</label>
            <input
              id="nombre"
              v-model="registerForm.nombre"
              type="text"
              required
              :disabled="loading"
              placeholder="Tu nombre completo"
            />
          </div>

          <div class="form-group">
            <label for="empresa">Empresa</label>
            <input
              id="empresa"
              v-model="registerForm.empresa"
              type="text"
              :disabled="loading"
              placeholder="Nombre de tu empresa (opcional)"
            />
          </div>

          <div class="form-group">
            <label for="email-register">Correo Electrónico</label>
            <input
              id="email-register"
              v-model="registerForm.email"
              type="email"
              required
              :disabled="loading"
              placeholder="tu@email.com"
            />
          </div>

          <div class="form-group">
            <label for="password-register">Contraseña</label>
            <input
              id="password-register"
              v-model="registerForm.password"
              type="password"
              required
              :disabled="loading"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirmar Contraseña</label>
            <input
              id="confirm-password"
              v-model="registerForm.confirmPassword"
              type="password"
              required
              :disabled="loading"
              placeholder="Confirma tu contraseña"
            />
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input
                v-model="registerForm.acceptTerms"
                type="checkbox"
                required
                :disabled="loading"
              />
              <span class="checkmark"></span>
              Acepto los <a href="#" @click.prevent="showTerms = true">términos y condiciones</a>
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="loading || !registerForm.acceptTerms">
              {{ loading ? 'Creando...' : 'Crear Cuenta' }}
            </button>
          </div>
        </form>

        <!-- Formulario de Recuperación de Contraseña -->
        <form v-if="showForgotPassword" @submit.prevent="handleForgotPassword" class="auth-form">
          <div class="form-group">
            <label for="reset-email">Correo Electrónico</label>
            <input
              id="reset-email"
              v-model="resetEmail"
              type="email"
              required
              :disabled="loading"
              placeholder="tu@email.com"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Enviando...' : 'Enviar Correo' }}
            </button>
            <button type="button" class="btn-secondary" @click="showForgotPassword = false">
              Cancelar
            </button>
          </div>
        </form>

        <!-- Alternar entre Login y Registro -->
        <div v-if="!showForgotPassword" class="auth-toggle">
          <p v-if="isLogin">
            ¿No tienes cuenta?
            <button type="button" class="btn-link" @click="toggleMode">
              Crear cuenta
            </button>
          </p>
          <p v-else>
            ¿Ya tienes cuenta?
            <button type="button" class="btn-link" @click="toggleMode">
              Iniciar sesión
            </button>
          </p>
        </div>

        <!-- Mensajes de Error/Éxito -->
        <div v-if="message" class="message" :class="messageType">
          {{ message }}
        </div>

        <!-- Estado de Conexión -->
        <div v-if="!isOnline" class="offline-notice">
          <span class="offline-icon">⚠️</span>
          Sin conexión - Modo offline activado
        </div>
      </div>
    </div>

    <!-- Modal de Términos y Condiciones -->
    <div v-if="showTerms" class="terms-modal" @click="showTerms = false">
      <div class="terms-content" @click.stop>
        <h3>Términos y Condiciones</h3>
        <div class="terms-text">
          <p><strong>Generador de Liquidaciones v2.0</strong></p>
          <p>Al usar esta aplicación, aceptas:</p>
          <ul>
            <li>Usar el software de manera responsable y legal</li>
            <li>No compartir tu licencia con terceros</li>
            <li>Mantener la confidencialidad de tus credenciales</li>
            <li>Cumplir con las leyes laborales vigentes</li>
          </ul>
          <p>La licencia tiene una duración de 2 años y requiere validación mensual online.</p>
        </div>
        <button class="btn-primary" @click="showTerms = false">Entendido</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { authService } from '../services/firebase.js'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'authenticated'])

// Estado reactivo
const showModal = computed(() => props.show)
const isLogin = ref(true)
const loading = ref(false)
const message = ref('')
const messageType = ref('info')
const showForgotPassword = ref(false)
const showTerms = ref(false)
const resetEmail = ref('')
const isOnline = ref(navigator.onLine)

// Formularios
const loginForm = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  nombre: '',
  empresa: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

// Métodos
const closeModal = () => {
  emit('close')
  resetForms()
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  showForgotPassword.value = false
  resetMessage()
}

const resetForms = () => {
  Object.assign(loginForm, { email: '', password: '' })
  Object.assign(registerForm, {
    nombre: '',
    empresa: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  resetEmail.value = ''
  resetMessage()
}

const resetMessage = () => {
  message.value = ''
  messageType.value = 'info'
}

const showMessage = (text, type = 'info') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const handleLogin = async () => {
  loading.value = true
  resetMessage()

  const result = await authService.login(loginForm.email, loginForm.password)
  
  if (result.success) {
    showMessage('Sesión iniciada exitosamente', 'success')
    setTimeout(() => {
      emit('authenticated', result.user)
      closeModal()
    }, 1000)
  } else {
    showMessage(result.message, 'error')
  }
  
  loading.value = false
}

const handleRegister = async () => {
  if (registerForm.password !== registerForm.confirmPassword) {
    showMessage('Las contraseñas no coinciden', 'error')
    return
  }

  loading.value = true
  resetMessage()

  const userData = {
    displayName: registerForm.nombre,
    empresa: registerForm.empresa
  }

  const result = await authService.register(registerForm.email, registerForm.password, userData)
  
  if (result.success) {
    showMessage('Cuenta creada exitosamente', 'success')
    setTimeout(() => {
      emit('authenticated', result.user)
      closeModal()
    }, 1000)
  } else {
    showMessage(result.message, 'error')
  }
  
  loading.value = false
}

const handleForgotPassword = async () => {
  loading.value = true
  resetMessage()

  const result = await authService.resetPassword(resetEmail.value)
  
  if (result.success) {
    showMessage('Correo de recuperación enviado', 'success')
    showForgotPassword.value = false
  } else {
    showMessage(result.message, 'error')
  }
  
  loading.value = false
}

// Monitorear estado de conexión
const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.auth-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.auth-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 24px;
}

.auth-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.auth-content {
  padding: 0 24px 24px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.form-group input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.btn-link {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
}

.btn-link:hover {
  color: #0056b3;
}

.auth-toggle {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.auth-toggle p {
  margin: 0;
  color: #666;
}

.message {
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 14px;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.offline-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 14px;
}

.terms-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.terms-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.terms-content h3 {
  margin-top: 0;
  color: #333;
}

.terms-text {
  margin: 16px 0;
  line-height: 1.6;
}

.terms-text ul {
  padding-left: 20px;
}

.terms-text li {
  margin-bottom: 8px;
}
</style>
