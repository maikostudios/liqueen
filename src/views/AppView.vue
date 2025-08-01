<template>
  <div class="app-container">
    <!-- Toggle de tema -->
    <ThemeToggle />

    <!-- Header principal -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-section">
            <div class="logo-icon">
              <img src="/src/img/logos/logo_liqueen_ico.png" alt="Liqueen" class="logo-image" />
            </div>
            <div class="logo-text">
              <img src="/src/img/logos/liqueen_logo_sin_fondo2.png" alt="Liqueen" class="logo-brand" />
              <p>Sistema profesional de liquidaciones</p>
            </div>
          </div>
        </div>

        <div class="header-right">
          <!-- Botón de configuración global -->
          <button @click="showConfigModal = true" class="btn-config" title="Configuración">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2579 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.01127 9.77251C4.28054 9.5799 4.48571 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Configuración
          </button>

          <!-- Información del usuario (clickeable) -->
          <div class="user-info" @click="showUserModal = true" title="Ver información de cuenta">
            <div class="user-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="user-details">
              <span class="user-name">{{ userData?.displayName || userData?.name || user?.displayName || user?.email ||
                'Usuario' }}</span>
              <span class="user-role">{{ userData?.role === 'admin' ? 'Administrador' : 'Usuario' }}</span>
            </div>
          </div>

          <!-- Botón de logout -->
          <button @click="handleLogout" class="btn-logout" title="Cerrar Sesión">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12L16 7M21 12H9"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="app-main">
      <!-- Pestañas de navegación -->
      <div class="tabs">
        <button class="tab" :class="{ active: activeTab === 'form' }" @click="activeTab = 'form'">
          📝 Formulario
        </button>
        <button class="tab" :class="{ active: activeTab === 'massUpload' }" @click="activeTab = 'massUpload'">
          📊 Carga Masiva
        </button>
        <button class="tab" :class="{ active: activeTab === 'upload' }" @click="activeTab = 'upload'">
          📂 Subir JSON
        </button>
        <button class="tab" :class="{ active: activeTab === 'paste' }" @click="activeTab = 'paste'">
          ✏️ Pegar JSON
        </button>
        <button class="tab" :class="{ active: activeTab === 'loadEdit' }" @click="activeTab = 'loadEdit'">
          📤 Cargar y Editar
        </button>
      </div>

      <!-- Área de carga de logo -->
      <div class="logo-upload-section">
        <LogoUpload :logo-data="logoData" :logo-file-name="logoFileName" @logo-uploaded="handleLogoUploaded"
          @logo-removed="handleLogoRemoved" />
      </div>

      <!-- Contenido de las pestañas con transiciones -->
      <Transition name="fade" mode="out-in">
        <FormTab v-if="activeTab === 'form'" key="form" :form-data="formData" @data-ready="handleFormReady" />

        <MassUploadTab v-else-if="activeTab === 'massUpload'" key="massUpload" :logo-data="logoData"
          @liquidaciones-generated="handleMassLiquidacionesGenerated" @error="handleError" />

        <UploadTab v-else-if="activeTab === 'upload'" key="upload" @data-loaded="handleDataLoaded" />

        <PasteTab v-else-if="activeTab === 'paste'" key="paste" @data-loaded="handleJsonLoaded" />

        <LoadEditTab v-else-if="activeTab === 'loadEdit'" key="loadEdit" :form-data="formData"
          @data-loaded="handleJsonLoaded" @data-ready="handleFormReady" />
      </Transition>

      <!-- Botón de generar liquidación -->
      <button v-if="isDataReady && activeTab !== 'massUpload'" @click="generarLiquidacion" class="btn-generate"
        :disabled="isGenerating">
        ➡️ Generar Liquidación
      </button>

      <div v-if="!isDataReady && activeTab !== 'massUpload'" class="message"
        style="text-align: center; margin-top: 10px; color: #666;">
        <small v-if="activeTab === 'form' || activeTab === 'loadEdit'">
          Completa los campos del formulario para continuar
        </small>
        <small v-else>
          Carga un archivo JSON o pega los datos manualmente para continuar
        </small>
      </div>
    </main>

    <!-- Modales -->
    <DataPreviewModal :is-visible="showPreview" :data="previewData" @close="showPreview = false"
      @confirm="handlePreviewConfirm" />

    <ConfigModal :show="showConfigModal" @close="showConfigModal = false" @config-updated="handleConfigUpdated" />

    <!-- Modal de información de usuario -->
    <UserInfoModal :show="showUserModal" :userData="userData" :licenseStatus="licenseStatus"
      @close="showUserModal = false" />

    <!-- Mensajes de estado -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UploadTab from '../components/UploadTab.vue'
import PasteTab from '../components/PasteTab.vue'
import FormTab from '../components/FormTab.vue'
import LoadEditTab from '../components/LoadEditTab.vue'
import MassUploadTab from '../components/MassUploadTab.vue'
import DataPreviewModal from '../components/DataPreviewModal.vue'
import ConfigModal from '../components/ConfigModal.vue'
import UserInfoModal from '../components/UserInfoModal.vue'
import LogoUpload from '../components/LogoUpload.vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import { LiquidacionService } from '../services/liquidacionService.js'
import { LiquidacionGenerator } from '../services/liquidacionGenerator.js'
import { ConfigService } from '../services/configService.js'
import { DataTransformService } from '../services/dataTransformService.js'
import { authStore, user } from '../stores/authStore.js'
import LicenseService from '../services/LicenseService.js'

const router = useRouter()

// Estado reactivo
const activeTab = ref('form')
const userData = ref(null)
const formData = ref(LiquidacionService.createEmptyFormData())
const jsonData = ref(null)
const errorMessage = ref('')
const successMessage = ref('')
const logoData = ref(null) // Estado para almacenar imagen de logo en base64
const logoFileName = ref('') // Nombre del archivo de logo cargado
const showPreview = ref(false)
const previewData = ref(null)
const showConfigModal = ref(false)
const showUserModal = ref(false)
const licenseStatus = ref(null)
const isGenerating = ref(false)

// Computed properties
const isDataReady = computed(() => {
  console.log('🔍 Checking if data is ready...')
  console.log('📊 Current tab:', activeTab.value)
  console.log('📋 Form data:', formData.value)
  console.log('📄 JSON data:', jsonData.value)

  // Información básica para el nombre del archivo
  const basicInfo = DataTransformService.generateFileName({
    empleador: formData.value?.empleador,
    trabajadorNombre: formData.value?.trabajador?.nombre,
    trabajadorRut: formData.value?.trabajador?.rut
  })

  if (activeTab.value === 'form' || activeTab.value === 'loadEdit') {
    // Validación básica sin llamar a funciones complejas
    const isValid = formData.value &&
      formData.value.empleador &&
      formData.value.trabajador?.nombre &&
      formData.value.trabajador?.rut
    console.log('📋 Form validation result:', isValid)
    console.log('🔍 LoadEdit - empleador:', formData.value?.empleador)
    console.log('🔍 LoadEdit - trabajador.nombre:', formData.value?.trabajador?.nombre)
    console.log('🔍 LoadEdit - trabajador.rut:', formData.value?.trabajador?.rut)
    return isValid
  } else if (activeTab.value === 'massUpload') {
    // Para carga masiva, no necesitamos validación aquí ya que se maneja internamente
    return true
  }

  const hasData = jsonData.value !== null
  console.log('📄 Has JSON data:', hasData)
  return hasData
})

// Watchers
watch(activeTab, (newTab) => {
  console.log('🔄 Tab changed to:', newTab)
  clearMessages()
})

// Métodos
const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const handleDataLoaded = (data) => {
  console.log('📂 Data loaded from upload:', data)
  jsonData.value = data
  clearMessages()
}

const handleJsonLoaded = (data) => {
  console.log('✏️ JSON data loaded:', data)
  jsonData.value = data
  clearMessages()
}

const handleFormReady = (data) => {
  console.log('📝 Form data ready:', data)
  formData.value = data
  clearMessages()
}

const handleShowPreview = (data) => {
  console.log('👁️ Showing preview for data:', data)
  console.log('🔍 Setting showPreview to true...')
  previewData.value = data
  showPreview.value = true
  console.log('✅ showPreview.value:', showPreview.value)
  console.log('📄 previewData.value:', previewData.value)
}

const handlePreviewConfirm = (data) => {
  console.log('✅ Preview confirmed, loading data:', data)
  jsonData.value = data
  showPreview.value = false
  clearMessages()
}

const handleMassLiquidacionesGenerated = (result) => {
  console.log('📊 Mass liquidaciones generated:', result)
  successMessage.value = `✅ Se generaron ${result.count} liquidaciones exitosamente en: ${result.path}`
  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}

const handleError = (error) => {
  console.error('❌ Error occurred:', error)
  errorMessage.value = error
  setTimeout(() => {
    errorMessage.value = ''
  }, 5000)
}

const handleConfigUpdated = () => {
  console.log('⚙️ Configuration updated')
  successMessage.value = '✅ Configuración guardada exitosamente'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

const handleLogoUploaded = (logoInfo) => {
  console.log('🖼️ Logo uploaded:', logoInfo.fileName)
  logoData.value = logoInfo.data
  logoFileName.value = logoInfo.fileName
  console.log('✅ Logo loaded successfully')
}

const handleLogoRemoved = () => {
  logoData.value = null
  logoFileName.value = ''
  console.log('🗑️ Logo removed')
}

// Mantener compatibilidad con el método anterior (por si se usa en otros lugares)
const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    console.log('🖼️ Logo file selected:', file.name)
    logoFileName.value = file.name

    const reader = new FileReader()
    reader.onload = (e) => {
      logoData.value = e.target.result
      console.log('✅ Logo loaded successfully')
    }
    reader.readAsDataURL(file)
  }
}

const removeLogo = () => {
  handleLogoRemoved()
}

const handleLogout = async () => {
  try {
    console.log('🚪 Iniciando cierre de sesión...')

    // Limpiar SOLO los datos de sesión, NO la licencia (para permitir login offline)
    localStorage.removeItem('liqueen_session')      // Datos de sesión
    localStorage.removeItem('liqueen_user_data')    // Datos adicionales de usuario

    // MANTENER estos datos para login offline:
    // - liqueen_license.lic (licencia principal)
    // - liqueen_user (datos de usuario cifrados)
    // - liqueen_hardware_id (ID de hardware)

    console.log('💾 Manteniendo licencia local para acceso offline')

    // Limpiar datos de autenticación de Firebase
    await authStore.logout()

    console.log('✅ Sesión cerrada exitosamente')

    // Usar Vue Router de manera más robusta
    console.log('🔄 Redirigiendo al login...')

    // Método 1: Intentar con Vue Router primero
    try {
      await router.replace('/login')
      console.log('✅ Redirección con Vue Router exitosa')
    } catch (routerError) {
      console.warn('⚠️ Vue Router falló, usando navegación nativa:', routerError)
      // Método 2: Fallback con navegación nativa
      window.location.hash = '#/login'
    }

  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error)
    // Fallback final: navegación nativa
    window.location.hash = '#/login'
  }
}

const generarLiquidacion = async () => {
  if (!isDataReady.value || isGenerating.value) {
    console.log('⚠️ Cannot generate: data not ready or already generating')
    return
  }

  isGenerating.value = true
  clearMessages()

  try {
    let rawData
    let standardData

    // Obtener datos según la pestaña activa
    if (activeTab.value === 'form' || activeTab.value === 'loadEdit') {
      // Transformar datos del formulario al formato estándar
      rawData = formData.value
      standardData = DataTransformService.fromForm(rawData)
    } else {
      // Transformar datos JSON al formato estándar
      rawData = jsonData.value
      standardData = DataTransformService.fromJSON(rawData)
    }

    console.log('🔄 Raw data:', rawData)
    console.log('📋 Standard data:', standardData)

    // Obtener configuración
    const defaultPath = await ConfigService.getDefaultPdfPath()
    console.log('📁 Default path:', defaultPath)

    // Generar nombre de archivo
    const fileName = DataTransformService.generateFileName(standardData)
    console.log('📄 Generated filename:', fileName)

    // Generar y guardar la liquidación
    console.log('🚀 Starting PDF generation...')
    const result = await LiquidacionGenerator.generateAndSave(standardData, logoData.value, defaultPath, fileName)

    console.log('✅ PDF generated successfully:', result)
    successMessage.value = `✅ Liquidación generada exitosamente: ${result.fileName}`

    setTimeout(() => {
      successMessage.value = ''
    }, 5000)

  } catch (error) {
    console.error('❌ Error generating liquidación:', error)
    errorMessage.value = `❌ Error al generar la liquidación: ${error.message}`

    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    isGenerating.value = false
  }
}

// Lifecycle
onMounted(async () => {
  console.log('🚀 AppView mounted')

  // Cargar datos del usuario
  try {
    const localUserData = await LicenseService.loadUserDataLocally()
    if (localUserData) {
      userData.value = localUserData
      console.log('👤 Datos de usuario cargados:', localUserData)
    }
  } catch (error) {
    console.log('⚠️ No se pudieron cargar datos de usuario locales')
  }

  // Cargar estado de licencia
  try {
    const status = await LicenseService.getLicenseStatus()
    licenseStatus.value = status
  } catch (error) {
    console.log('⚠️ No se pudo cargar estado de licencia')
  }
})
</script>

<style scoped>
/* === CONTAINER PRINCIPAL === */
.app-container {
  min-height: 100vh;
  background: var(--gray-50);
  display: flex;
  flex-direction: column;
}

/* === HEADER MODERNO === */
.app-header {
  background: var(--brand-gradient);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-4) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
}

.header-left {
  flex: 1;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.logo-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-brand {
  height: 50px;
  object-fit: contain;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1));
}

/* Logo brand image ya no necesita estilos de h1 */

.logo-text p {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.btn-config {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  backdrop-filter: blur(10px);
}

.btn-config:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  backdrop-filter: blur(10px);
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: var(--gray-200);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-600);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-900);
}

.user-role {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
}

.btn-logout {
  width: 40px;
  height: 40px;
  background: var(--red-50);
  color: var(--red-600);
  border: 1px solid var(--red-200);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.btn-logout:hover {
  background: var(--red-100);
  border-color: var(--red-300);
  transform: translateY(-1px);
}

/* === MAIN CONTENT === */
.app-main {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-6);
  width: 100%;
}

/* === TABS === */
.tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  background: white;
  padding: var(--space-2);
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--gray-200);
}

.tab {
  flex: 1;
  padding: var(--space-4) var(--space-6);
  background: transparent;
  color: var(--gray-600);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  text-align: center;
  white-space: nowrap;
}

.tab:hover {
  background: var(--gray-50);
  color: var(--gray-900);
}

.tab.active {
  background: var(--primary-500);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* === LOGO UPLOAD === */
.logo-upload-section {
  margin-bottom: var(--space-6);
}

.logo-upload-container {
  background: white;
  border: 2px dashed var(--gray-300);
  border-radius: 16px;
  padding: var(--space-6);
  text-align: center;
  transition: all var(--transition-fast);
}

.logo-upload-container:hover {
  border-color: var(--primary-400);
  background: var(--primary-25);
}

.logo-preview {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  justify-content: center;
}

.logo-image {
  max-width: 120px;
  max-height: 60px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-start;
}

.logo-filename {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
}

.btn-remove-logo {
  padding: var(--space-2) var(--space-3);
  background: var(--red-50);
  color: var(--red-600);
  border: 1px solid var(--red-200);
  border-radius: 6px;
  cursor: pointer;
  font-size: var(--font-size-xs);
  transition: all var(--transition-fast);
}

.btn-remove-logo:hover {
  background: var(--red-100);
  border-color: var(--red-300);
}

.logo-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.btn-upload-logo {
  padding: var(--space-4) var(--space-6);
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.btn-upload-logo:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.upload-hint {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  margin: 0;
}

/* === BOTÓN GENERAR === */
.btn-generate {
  width: 100%;
  max-width: 400px;
  margin: 2rem auto 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #ffffff !important;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.125rem;
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-generate::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-generate:hover::before {
  left: 100%;
}

.btn-generate:hover:not(:disabled) {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
  color: #ffffff !important;
}

.btn-generate:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.btn-generate:disabled {
  background: #9ca3af !important;
  color: #ffffff !important;
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-generate:focus {
  outline: none;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3), 0 0 0 3px rgba(34, 197, 94, 0.2);
}

/* === MENSAJES === */
.message {
  text-align: center;
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #3b82f6;
  border-radius: 12px;
  color: #1e40af !important;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
}

.success-message {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #ffffff !important;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
  z-index: 1000;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  animation: slideInRight 0.3s ease-out;
}

.error-message {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  background: var(--red-500);
  color: white;
  padding: var(--space-4) var(--space-6);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
  z-index: 1000;
  font-weight: var(--font-weight-medium);
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* === TRANSICIONES === */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .header-content {
    padding: var(--space-4);
  }

  .app-main {
    padding: var(--space-4);
  }

  .tabs {
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .tab {
    flex: 1 1 calc(50% - var(--space-1));
    min-width: 140px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: var(--space-4);
    align-items: stretch;
  }

  .header-left,
  .header-right {
    flex: none;
  }

  .header-right {
    justify-content: space-between;
  }

  .logo-brand {
    height: 24px;
  }

  .user-info {
    flex: 1;
  }

  .tabs {
    flex-direction: column;
    gap: var(--space-2);
  }

  .tab {
    flex: none;
  }

  .logo-preview {
    flex-direction: column;
    text-align: center;
  }

  .logo-info {
    align-items: center;
  }
}

@media (max-width: 480px) {
  .app-main {
    padding: var(--space-3);
  }

  .logo-section {
    flex-direction: column;
    text-align: center;
    gap: var(--space-3);
  }

  .header-right {
    flex-direction: column;
    gap: var(--space-3);
  }

  .success-message,
  .error-message {
    left: var(--space-3);
    right: var(--space-3);
    top: var(--space-4);
  }
}
</style>
