/**
 * Servicio para comunicación con el proceso principal de Electron
 * Maneja la obtención de información del sistema y otras operaciones nativas
 */

class ElectronService {
  constructor() {
    this.isElectron = this.checkElectronEnvironment()
    this.ipcRenderer = this.isElectron ? window.require('electron').ipcRenderer : null
  }

  /**
   * Verifica si la aplicación se está ejecutando en Electron
   */
  checkElectronEnvironment() {
    try {
      return !!(window && window.process && window.process.type)
    } catch (error) {
      return false
    }
  }

  /**
   * Obtiene información detallada del sistema
   */
  async getSystemInfo() {
    if (!this.isElectron) {
      // Fallback para entorno web
      return this.getWebSystemInfo()
    }

    try {
      // Solicitar información del sistema al proceso principal
      const systemInfo = await this.ipcRenderer.invoke('get-system-info')
      return systemInfo
    } catch (error) {
      console.error('Error obteniendo información del sistema:', error)
      return this.getWebSystemInfo()
    }
  }

  /**
   * Obtiene información del sistema en entorno web (fallback)
   */
  getWebSystemInfo() {
    const navigator = window.navigator
    const screen = window.screen

    return {
      platform: navigator.platform || 'unknown',
      userAgent: navigator.userAgent || 'unknown',
      language: navigator.language || 'unknown',
      hardwareConcurrency: navigator.hardwareConcurrency || 1,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth || 24,
      pixelDepth: screen.pixelDepth || 24,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
      memory: navigator.deviceMemory || 'unknown',
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    }
  }

  /**
   * Obtiene el ID único de la máquina
   */
  async getMachineId() {
    if (!this.isElectron) {
      // Fallback para entorno web - generar ID basado en características del navegador
      return this.generateWebMachineId()
    }

    try {
      const machineId = await this.ipcRenderer.invoke('get-machine-id')
      return machineId
    } catch (error) {
      console.error('Error obteniendo machine ID:', error)
      return this.generateWebMachineId()
    }
  }

  /**
   * Genera un ID único para entorno web
   */
  async generateWebMachineId() {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 1,
      navigator.maxTouchPoints || 0
    ]

    // Crear hash de los componentes
    const encoder = new TextEncoder()
    const data = encoder.encode(components.join('|'))
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    return hashHex.substring(0, 32) // Tomar primeros 32 caracteres
  }

  /**
   * Obtiene información de red
   */
  async getNetworkInfo() {
    if (!this.isElectron) {
      return this.getWebNetworkInfo()
    }

    try {
      const networkInfo = await this.ipcRenderer.invoke('get-network-info')
      return networkInfo
    } catch (error) {
      console.error('Error obteniendo información de red:', error)
      return this.getWebNetworkInfo()
    }
  }

  /**
   * Obtiene información de red en entorno web
   */
  getWebNetworkInfo() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

    return {
      isOnline: navigator.onLine,
      connection: connection ? {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      } : null,
      timestamp: Date.now()
    }
  }

  /**
   * Verifica si hay conexión a internet
   */
  async checkInternetConnection() {
    try {
      // Intentar hacer una petición a un servicio confiable
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        timeout: 5000
      })
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Obtiene la versión de la aplicación
   */
  async getAppVersion() {
    if (!this.isElectron) {
      // En entorno web, usar la versión del package.json si está disponible
      return process.env.VUE_APP_VERSION || '2.0.0'
    }

    try {
      const version = await this.ipcRenderer.invoke('get-app-version')
      return version
    } catch (error) {
      console.error('Error obteniendo versión de la aplicación:', error)
      return '2.0.0'
    }
  }

  /**
   * Abre una URL en el navegador externo
   */
  async openExternal(url) {
    if (!this.isElectron) {
      window.open(url, '_blank')
      return
    }

    try {
      await this.ipcRenderer.invoke('open-external', url)
    } catch (error) {
      console.error('Error abriendo URL externa:', error)
      window.open(url, '_blank')
    }
  }

  /**
   * Muestra un diálogo de mensaje nativo
   */
  async showMessageDialog(options) {
    if (!this.isElectron) {
      // Fallback para entorno web
      if (options.type === 'error') {
        alert(`Error: ${options.message}`)
      } else {
        alert(options.message)
      }
      return { response: 0 }
    }

    try {
      const result = await this.ipcRenderer.invoke('show-message-dialog', options)
      return result
    } catch (error) {
      console.error('Error mostrando diálogo:', error)
      alert(options.message)
      return { response: 0 }
    }
  }

  /**
   * Obtiene el directorio de datos de la aplicación
   */
  async getAppDataPath() {
    if (!this.isElectron) {
      return null
    }

    try {
      const path = await this.ipcRenderer.invoke('get-app-data-path')
      return path
    } catch (error) {
      console.error('Error obteniendo directorio de datos:', error)
      return null
    }
  }

  /**
   * Escribe un archivo en el sistema
   */
  async writeFile(filePath, content) {
    if (!this.isElectron) {
      // En entorno web, usar localStorage como fallback
      localStorage.setItem(filePath, content)
      return true
    }

    try {
      await this.ipcRenderer.invoke('write-file', filePath, content)
      return true
    } catch (error) {
      console.error('Error escribiendo archivo:', error)
      return false
    }
  }

  /**
   * Lee un archivo del sistema
   */
  async readFile(filePath) {
    if (!this.isElectron) {
      // En entorno web, usar localStorage como fallback
      return localStorage.getItem(filePath)
    }

    try {
      const content = await this.ipcRenderer.invoke('read-file', filePath)
      return content
    } catch (error) {
      console.error('Error leyendo archivo:', error)
      return null
    }
  }

  /**
   * Verifica si un archivo existe
   */
  async fileExists(filePath) {
    if (!this.isElectron) {
      // En entorno web, verificar en localStorage
      return localStorage.getItem(filePath) !== null
    }

    try {
      const exists = await this.ipcRenderer.invoke('file-exists', filePath)
      return exists
    } catch (error) {
      console.error('Error verificando archivo:', error)
      return false
    }
  }

  /**
   * Elimina un archivo del sistema
   */
  async deleteFile(filePath) {
    if (!this.isElectron) {
      // En entorno web, eliminar de localStorage
      localStorage.removeItem(filePath)
      return true
    }

    try {
      await this.ipcRenderer.invoke('delete-file', filePath)
      return true
    } catch (error) {
      console.error('Error eliminando archivo:', error)
      return false
    }
  }

  /**
   * Registra eventos de IPC
   */
  on(channel, callback) {
    if (!this.isElectron) return

    this.ipcRenderer.on(channel, callback)
  }

  /**
   * Elimina listeners de eventos IPC
   */
  removeAllListeners(channel) {
    if (!this.isElectron) return

    this.ipcRenderer.removeAllListeners(channel)
  }
}

// Crear instancia singleton
const electronService = new ElectronService()

export default electronService
