/**
 * LoggingService - Servicio centralizado de logging para Liqueen
 * Maneja logs de validación, errores y eventos del sistema
 */

class LoggingService {
  constructor() {
    this.logs = []
    this.maxLogs = 1000 // Máximo número de logs en memoria
    this.logLevel = 'INFO' // DEBUG, INFO, WARN, ERROR
    this.enableConsole = true
    this.enableStorage = true
  }

  /**
   * Configurar nivel de logging
   * @param {string} level - DEBUG, INFO, WARN, ERROR
   */
  setLogLevel(level) {
    this.logLevel = level
    console.log(`📝 Nivel de logging configurado a: ${level}`)
  }

  /**
   * Log genérico
   * @param {string} level 
   * @param {string} category 
   * @param {string} message 
   * @param {object} data 
   */
  log(level, category, message, data = null) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      category,
      message,
      data,
      id: this.generateLogId()
    }

    // Agregar a memoria
    this.logs.push(logEntry)
    
    // Mantener límite de logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Log a consola si está habilitado
    if (this.enableConsole && this.shouldLog(level)) {
      this.logToConsole(logEntry)
    }

    // Guardar en localStorage si está habilitado
    if (this.enableStorage) {
      this.saveToStorage(logEntry)
    }
  }

  /**
   * Verificar si debe loggear según el nivel
   * @param {string} level 
   * @returns {boolean}
   */
  shouldLog(level) {
    const levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 }
    return levels[level] >= levels[this.logLevel]
  }

  /**
   * Log a consola con formato
   * @param {object} logEntry 
   */
  logToConsole(logEntry) {
    const { timestamp, level, category, message, data } = logEntry
    const timeStr = new Date(timestamp).toLocaleTimeString()
    
    const prefix = this.getLogPrefix(level, category)
    const fullMessage = `${prefix} [${timeStr}] ${message}`

    switch (level) {
      case 'DEBUG':
        console.debug(fullMessage, data || '')
        break
      case 'INFO':
        console.info(fullMessage, data || '')
        break
      case 'WARN':
        console.warn(fullMessage, data || '')
        break
      case 'ERROR':
        console.error(fullMessage, data || '')
        break
      default:
        console.log(fullMessage, data || '')
    }
  }

  /**
   * Obtener prefijo visual para logs
   * @param {string} level 
   * @param {string} category 
   * @returns {string}
   */
  getLogPrefix(level, category) {
    const levelIcons = {
      DEBUG: '🔍',
      INFO: 'ℹ️',
      WARN: '⚠️',
      ERROR: '❌'
    }

    const categoryIcons = {
      AUTH: '🔐',
      LICENSE: '📄',
      CONNECTIVITY: '🌐',
      VALIDATION: '✅',
      SYSTEM: '⚙️',
      UI: '🎨',
      DATABASE: '🗄️'
    }

    return `${levelIcons[level] || '📝'} ${categoryIcons[category] || '📋'}`
  }

  /**
   * Generar ID único para log
   * @returns {string}
   */
  generateLogId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  /**
   * Guardar log en localStorage
   * @param {object} logEntry 
   */
  saveToStorage(logEntry) {
    try {
      const storageKey = 'liqueen_logs'
      const existingLogs = JSON.parse(localStorage.getItem(storageKey) || '[]')
      
      existingLogs.push(logEntry)
      
      // Mantener solo los últimos 500 logs en storage
      if (existingLogs.length > 500) {
        existingLogs.splice(0, existingLogs.length - 500)
      }
      
      localStorage.setItem(storageKey, JSON.stringify(existingLogs))
    } catch (error) {
      console.error('Error guardando log en storage:', error)
    }
  }

  // Métodos de conveniencia para diferentes niveles
  debug(category, message, data) {
    this.log('DEBUG', category, message, data)
  }

  info(category, message, data) {
    this.log('INFO', category, message, data)
  }

  warn(category, message, data) {
    this.log('WARN', category, message, data)
  }

  error(category, message, data) {
    this.log('ERROR', category, message, data)
  }

  // Métodos específicos para categorías comunes
  authLog(level, message, data) {
    this.log(level, 'AUTH', message, data)
  }

  licenseLog(level, message, data) {
    this.log(level, 'LICENSE', message, data)
  }

  connectivityLog(level, message, data) {
    this.log(level, 'CONNECTIVITY', message, data)
  }

  validationLog(level, message, data) {
    this.log(level, 'VALIDATION', message, data)
  }

  systemLog(level, message, data) {
    this.log(level, 'SYSTEM', message, data)
  }

  /**
   * Obtener logs filtrados
   * @param {object} filters 
   * @returns {array}
   */
  getLogs(filters = {}) {
    let filteredLogs = [...this.logs]

    if (filters.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filters.level)
    }

    if (filters.category) {
      filteredLogs = filteredLogs.filter(log => log.category === filters.category)
    }

    if (filters.since) {
      const sinceDate = new Date(filters.since)
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= sinceDate)
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(searchTerm) ||
        (log.data && JSON.stringify(log.data).toLowerCase().includes(searchTerm))
      )
    }

    return filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  /**
   * Obtener logs desde localStorage
   * @returns {array}
   */
  getStoredLogs() {
    try {
      const storageKey = 'liqueen_logs'
      return JSON.parse(localStorage.getItem(storageKey) || '[]')
    } catch (error) {
      console.error('Error cargando logs desde storage:', error)
      return []
    }
  }

  /**
   * Limpiar logs
   */
  clearLogs() {
    this.logs = []
    localStorage.removeItem('liqueen_logs')
    console.log('🧹 Logs limpiados')
  }

  /**
   * Exportar logs como texto
   * @returns {string}
   */
  exportLogs() {
    const allLogs = [...this.getStoredLogs(), ...this.logs]
    const sortedLogs = allLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    
    let exportText = `LIQUEEN - LOGS DE SISTEMA\n`
    exportText += `Generado: ${new Date().toISOString()}\n`
    exportText += `Total de logs: ${sortedLogs.length}\n`
    exportText += `${'='.repeat(50)}\n\n`

    sortedLogs.forEach(log => {
      exportText += `[${log.timestamp}] ${log.level} - ${log.category}\n`
      exportText += `${log.message}\n`
      if (log.data) {
        exportText += `Datos: ${JSON.stringify(log.data, null, 2)}\n`
      }
      exportText += `${'-'.repeat(30)}\n`
    })

    return exportText
  }

  /**
   * Log de inicio de sesión
   * @param {string} email 
   * @param {string} method 
   * @param {boolean} success 
   * @param {string} error 
   */
  logLoginAttempt(email, method, success, error = null) {
    const data = {
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Ofuscar email
      method,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      success
    }

    if (error) {
      data.error = error
    }

    this.authLog(success ? 'INFO' : 'ERROR', 
      `Intento de login ${success ? 'exitoso' : 'fallido'} - ${method}`, 
      data
    )
  }

  /**
   * Log de validación de licencia
   * @param {string} licenseCode 
   * @param {boolean} isValid 
   * @param {string} reason 
   */
  logLicenseValidation(licenseCode, isValid, reason) {
    const data = {
      licenseCode: licenseCode ? licenseCode.substring(0, 8) + '***' : 'N/A',
      isValid,
      reason,
      timestamp: new Date().toISOString()
    }

    this.licenseLog(isValid ? 'INFO' : 'WARN', 
      `Validación de licencia: ${isValid ? 'válida' : 'inválida'}`, 
      data
    )
  }
}

// Crear instancia singleton
const loggingService = new LoggingService()

// Configurar nivel según entorno
if (process.env.NODE_ENV === 'development') {
  loggingService.setLogLevel('DEBUG')
} else {
  loggingService.setLogLevel('INFO')
}

export default loggingService
