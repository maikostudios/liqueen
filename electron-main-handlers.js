/**
 * Manejadores IPC para el proceso principal de Electron
 * Proporciona acceso a APIs del sistema operativo desde el renderer
 */

const { ipcMain, shell, dialog, app } = require('electron')
const os = require('os')
const fs = require('fs').promises
const path = require('path')
const { machineId } = require('node-machine-id')

/**
 * Registra todos los manejadores IPC
 */
function registerIpcHandlers() {
  // Obtener información del sistema
  ipcMain.handle('get-system-info', async () => {
    try {
      const networkInterfaces = os.networkInterfaces()
      const cpus = os.cpus()
      
      return {
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        type: os.type(),
        release: os.release(),
        version: os.version(),
        userInfo: os.userInfo(),
        uptime: os.uptime(),
        loadavg: os.loadavg(),
        totalmem: os.totalmem(),
        freemem: os.freemem(),
        cpus: cpus.map(cpu => ({
          model: cpu.model,
          speed: cpu.speed,
          times: cpu.times
        })),
        networkInterfaces: Object.keys(networkInterfaces).map(name => ({
          name,
          addresses: networkInterfaces[name].map(addr => ({
            address: addr.address,
            netmask: addr.netmask,
            family: addr.family,
            mac: addr.mac,
            internal: addr.internal
          }))
        })),
        endianness: os.endianness(),
        homedir: os.homedir(),
        tmpdir: os.tmpdir()
      }
    } catch (error) {
      console.error('Error obteniendo información del sistema:', error)
      throw error
    }
  })

  // Obtener machine ID
  ipcMain.handle('get-machine-id', async () => {
    try {
      return await machineId()
    } catch (error) {
      console.error('Error obteniendo machine ID:', error)
      throw error
    }
  })

  // Obtener información de red
  ipcMain.handle('get-network-info', async () => {
    try {
      const networkInterfaces = os.networkInterfaces()
      const interfaces = []
      
      for (const [name, addresses] of Object.entries(networkInterfaces)) {
        for (const addr of addresses) {
          if (!addr.internal && addr.family === 'IPv4') {
            interfaces.push({
              name,
              address: addr.address,
              mac: addr.mac,
              netmask: addr.netmask
            })
          }
        }
      }
      
      return {
        interfaces,
        hostname: os.hostname(),
        platform: os.platform(),
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('Error obteniendo información de red:', error)
      throw error
    }
  })

  // Obtener versión de la aplicación
  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })

  // Abrir URL externa
  ipcMain.handle('open-external', async (event, url) => {
    try {
      await shell.openExternal(url)
    } catch (error) {
      console.error('Error abriendo URL externa:', error)
      throw error
    }
  })

  // Mostrar diálogo de mensaje
  ipcMain.handle('show-message-dialog', async (event, options) => {
    try {
      const result = await dialog.showMessageBox(options)
      return result
    } catch (error) {
      console.error('Error mostrando diálogo:', error)
      throw error
    }
  })

  // Obtener directorio de datos de la aplicación
  ipcMain.handle('get-app-data-path', () => {
    return app.getPath('userData')
  })

  // Escribir archivo
  ipcMain.handle('write-file', async (event, filePath, content) => {
    try {
      // Si es una ruta relativa, usar el directorio de datos de la app
      if (!path.isAbsolute(filePath)) {
        filePath = path.join(app.getPath('userData'), filePath)
      }
      
      // Crear directorio si no existe
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      
      // Escribir archivo
      await fs.writeFile(filePath, content, 'utf8')
      return true
    } catch (error) {
      console.error('Error escribiendo archivo:', error)
      throw error
    }
  })

  // Leer archivo
  ipcMain.handle('read-file', async (event, filePath) => {
    try {
      // Si es una ruta relativa, usar el directorio de datos de la app
      if (!path.isAbsolute(filePath)) {
        filePath = path.join(app.getPath('userData'), filePath)
      }
      
      const content = await fs.readFile(filePath, 'utf8')
      return content
    } catch (error) {
      console.error('Error leyendo archivo:', error)
      throw error
    }
  })

  // Verificar si archivo existe
  ipcMain.handle('file-exists', async (event, filePath) => {
    try {
      // Si es una ruta relativa, usar el directorio de datos de la app
      if (!path.isAbsolute(filePath)) {
        filePath = path.join(app.getPath('userData'), filePath)
      }
      
      await fs.access(filePath)
      return true
    } catch (error) {
      return false
    }
  })

  // Eliminar archivo
  ipcMain.handle('delete-file', async (event, filePath) => {
    try {
      // Si es una ruta relativa, usar el directorio de datos de la app
      if (!path.isAbsolute(filePath)) {
        filePath = path.join(app.getPath('userData'), filePath)
      }
      
      await fs.unlink(filePath)
      return true
    } catch (error) {
      console.error('Error eliminando archivo:', error)
      throw error
    }
  })

  // Obtener estadísticas del sistema
  ipcMain.handle('get-system-stats', () => {
    try {
      return {
        uptime: os.uptime(),
        loadavg: os.loadavg(),
        totalmem: os.totalmem(),
        freemem: os.freemem(),
        cpuUsage: process.cpuUsage(),
        memoryUsage: process.memoryUsage(),
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas del sistema:', error)
      throw error
    }
  })

  // Obtener información de la aplicación
  ipcMain.handle('get-app-info', () => {
    try {
      return {
        name: app.getName(),
        version: app.getVersion(),
        path: app.getAppPath(),
        userDataPath: app.getPath('userData'),
        tempPath: app.getPath('temp'),
        documentsPath: app.getPath('documents'),
        downloadsPath: app.getPath('downloads'),
        isPackaged: app.isPackaged,
        locale: app.getLocale(),
        systemLocale: app.getSystemLocale()
      }
    } catch (error) {
      console.error('Error obteniendo información de la aplicación:', error)
      throw error
    }
  })

  // Reiniciar aplicación
  ipcMain.handle('restart-app', () => {
    app.relaunch()
    app.exit()
  })

  // Salir de la aplicación
  ipcMain.handle('quit-app', () => {
    app.quit()
  })

  console.log('✅ Manejadores IPC registrados correctamente')
}

/**
 * Limpia todos los manejadores IPC
 */
function unregisterIpcHandlers() {
  const handlers = [
    'get-system-info',
    'get-machine-id',
    'get-network-info',
    'get-app-version',
    'open-external',
    'show-message-dialog',
    'get-app-data-path',
    'write-file',
    'read-file',
    'file-exists',
    'delete-file',
    'get-system-stats',
    'get-app-info',
    'restart-app',
    'quit-app'
  ]

  handlers.forEach(handler => {
    ipcMain.removeHandler(handler)
  })

  console.log('🧹 Manejadores IPC limpiados')
}

module.exports = {
  registerIpcHandlers,
  unregisterIpcHandlers
}
