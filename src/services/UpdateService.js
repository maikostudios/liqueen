/**
 * 🔄 UpdateService - Canal de actualizaciones automáticas
 * Gestiona verificación y notificación de nuevas versiones
 */

import { db } from './firebase.js'
import { doc, getDoc } from 'firebase/firestore'

class UpdateService {
  constructor() {
    this.currentVersion = '2.1.0' // Versión actual de la app
    this.updateCheckInterval = 24 * 60 * 60 * 1000 // 24 horas
    this.lastUpdateCheck = null
  }

  /**
   * 📦 Obtiene la versión actual desde package.json
   */
  getCurrentVersion() {
    return this.currentVersion
  }

  /**
   * 🔍 Verifica si hay actualizaciones disponibles
   */
  async checkForUpdates() {
    try {
      console.log('🔍 Verificando actualizaciones...')

      // Obtener información de la última versión desde Firestore
      const updateDoc = await getDoc(doc(db, 'app_config', 'updates'))
      
      if (!updateDoc.exists()) {
        console.log('📋 No hay configuración de actualizaciones')
        return {
          hasUpdate: false,
          error: 'Configuración de actualizaciones no encontrada'
        }
      }

      const updateData = updateDoc.data()
      const latestVersion = updateData.latestVersion
      const currentVersion = this.getCurrentVersion()

      // Comparar versiones
      const hasUpdate = this.compareVersions(latestVersion, currentVersion) > 0

      this.lastUpdateCheck = Date.now()
      localStorage.setItem('liqueen_last_update_check', this.lastUpdateCheck.toString())

      if (hasUpdate) {
        console.log('🆕 Nueva actualización disponible:', latestVersion)
        return {
          hasUpdate: true,
          currentVersion: currentVersion,
          latestVersion: latestVersion,
          updateInfo: {
            version: latestVersion,
            releaseDate: updateData.releaseDate,
            downloadUrl: updateData.downloadUrl,
            changelog: updateData.changelog || [],
            isRequired: updateData.isRequired || false,
            minRequiredVersion: updateData.minRequiredVersion,
            fileSize: updateData.fileSize,
            checksum: updateData.checksum
          }
        }
      } else {
        console.log('✅ Aplicación actualizada')
        return {
          hasUpdate: false,
          currentVersion: currentVersion,
          latestVersion: latestVersion,
          message: 'La aplicación está actualizada'
        }
      }

    } catch (error) {
      console.error('❌ Error verificando actualizaciones:', error)
      return {
        hasUpdate: false,
        error: error.message
      }
    }
  }

  /**
   * 🔢 Compara dos versiones (formato semver)
   * Retorna: 1 si v1 > v2, -1 si v1 < v2, 0 si son iguales
   */
  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number)
    const parts2 = v2.split('.').map(Number)

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0
      const part2 = parts2[i] || 0

      if (part1 > part2) return 1
      if (part1 < part2) return -1
    }

    return 0
  }

  /**
   * ⏰ Verifica si es necesario comprobar actualizaciones
   */
  shouldCheckForUpdates() {
    const lastCheck = localStorage.getItem('liqueen_last_update_check')
    
    if (!lastCheck) {
      return true
    }

    const timeSinceLastCheck = Date.now() - parseInt(lastCheck)
    return timeSinceLastCheck > this.updateCheckInterval
  }

  /**
   * 🚀 Verificación automática de actualizaciones
   */
  async autoCheckForUpdates() {
    if (!this.shouldCheckForUpdates()) {
      console.log('⏭️ Verificación de actualizaciones no necesaria aún')
      return null
    }

    return await this.checkForUpdates()
  }

  /**
   * 📥 Obtiene información de descarga
   */
  async getDownloadInfo(version) {
    try {
      const updateDoc = await getDoc(doc(db, 'app_config', 'updates'))
      
      if (!updateDoc.exists()) {
        throw new Error('Información de descarga no disponible')
      }

      const updateData = updateDoc.data()
      
      if (updateData.latestVersion !== version) {
        throw new Error('Versión solicitada no coincide con la última disponible')
      }

      return {
        downloadUrl: updateData.downloadUrl,
        fileSize: updateData.fileSize,
        checksum: updateData.checksum,
        releaseNotes: updateData.changelog || []
      }

    } catch (error) {
      console.error('❌ Error obteniendo información de descarga:', error)
      throw error
    }
  }

  /**
   * 📋 Obtiene el changelog completo
   */
  async getChangelog() {
    try {
      const changelogDoc = await getDoc(doc(db, 'app_config', 'changelog'))
      
      if (!changelogDoc.exists()) {
        return []
      }

      return changelogDoc.data().versions || []

    } catch (error) {
      console.error('❌ Error obteniendo changelog:', error)
      return []
    }
  }

  /**
   * ⚠️ Verifica si la versión actual es compatible
   */
  async checkVersionCompatibility() {
    try {
      const updateDoc = await getDoc(doc(db, 'app_config', 'updates'))
      
      if (!updateDoc.exists()) {
        return { isCompatible: true }
      }

      const updateData = updateDoc.data()
      const minRequiredVersion = updateData.minRequiredVersion
      const currentVersion = this.getCurrentVersion()

      if (minRequiredVersion) {
        const isCompatible = this.compareVersions(currentVersion, minRequiredVersion) >= 0
        
        return {
          isCompatible: isCompatible,
          minRequiredVersion: minRequiredVersion,
          currentVersion: currentVersion,
          mustUpdate: !isCompatible
        }
      }

      return { isCompatible: true }

    } catch (error) {
      console.error('❌ Error verificando compatibilidad:', error)
      return { isCompatible: true, error: error.message }
    }
  }

  /**
   * 🔔 Configura notificaciones de actualización
   */
  setUpdateNotificationPreference(enabled) {
    localStorage.setItem('liqueen_update_notifications', enabled.toString())
  }

  /**
   * 🔔 Obtiene preferencia de notificaciones
   */
  getUpdateNotificationPreference() {
    const preference = localStorage.getItem('liqueen_update_notifications')
    return preference !== 'false' // Por defecto habilitado
  }

  /**
   * ⏰ Programa verificación periódica
   */
  schedulePeriodicCheck(callback) {
    // Verificar inmediatamente
    this.autoCheckForUpdates().then(result => {
      if (result && callback) {
        callback(result)
      }
    })

    // Programar verificaciones periódicas
    setInterval(async () => {
      try {
        const result = await this.autoCheckForUpdates()
        if (result && result.hasUpdate && callback) {
          callback(result)
        }
      } catch (error) {
        console.error('❌ Error en verificación periódica:', error)
      }
    }, this.updateCheckInterval)
  }

  /**
   * 📊 Obtiene estadísticas de actualización
   */
  getUpdateStats() {
    return {
      currentVersion: this.getCurrentVersion(),
      lastUpdateCheck: this.lastUpdateCheck || parseInt(localStorage.getItem('liqueen_last_update_check') || '0'),
      updateNotificationsEnabled: this.getUpdateNotificationPreference(),
      checkInterval: this.updateCheckInterval
    }
  }

  /**
   * 🔄 Reinicia configuración de actualizaciones
   */
  resetUpdateSettings() {
    localStorage.removeItem('liqueen_last_update_check')
    localStorage.removeItem('liqueen_update_notifications')
    this.lastUpdateCheck = null
    console.log('🔄 Configuración de actualizaciones reiniciada')
  }
}

// Singleton
const updateService = new UpdateService()
export default updateService
