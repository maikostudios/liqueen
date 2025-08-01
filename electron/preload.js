const { contextBridge, ipcRenderer } = require("electron");

// Exponer APIs seguras al contexto del renderer
contextBridge.exposeInMainWorld("electronAPI", {
  // Información de la aplicación
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  // Diálogos del sistema
  showSaveDialog: (options) => ipcRenderer.invoke("show-save-dialog", options),
  showOpenDialog: (options) => ipcRenderer.invoke("show-open-dialog", options),
  showMessageBox: (options) => ipcRenderer.invoke("show-message-box", options),

  // Eventos del menú
  onMenuNewFile: (callback) => ipcRenderer.on("menu-new-file", callback),
  onMenuOpenFile: (callback) => ipcRenderer.on("menu-open-file", callback),

  // Remover listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

  // Sistema de archivos (para futuras funcionalidades)
  readFile: (filePath) => ipcRenderer.invoke("read-file", filePath),
  writeFile: (filePath, data) =>
    ipcRenderer.invoke("write-file", filePath, data),

  // Licencias y autenticación (para futuras implementaciones)
  validateLicense: (licenseData) =>
    ipcRenderer.invoke("validate-license", licenseData),
  getHardwareId: () => ipcRenderer.invoke("get-hardware-id"),

  // Configuración de la aplicación
  getConfig: (key) => ipcRenderer.invoke("get-config", key),
  setConfig: (key, value) => ipcRenderer.invoke("set-config", key, value),

  // Notificaciones del sistema
  showNotification: (title, body) =>
    ipcRenderer.invoke("show-notification", { title, body }),

  // Utilidades del sistema
  openExternal: (url) => ipcRenderer.invoke("open-external", url),
  getPath: (name) => ipcRenderer.invoke("get-path", name),

  // Modo oscuro
  toggleDarkMode: () => ipcRenderer.invoke("toggle-dark-mode"),
  getDarkMode: () => ipcRenderer.invoke("get-dark-mode"),

  // Excel/Google Sheets integration (para futuras implementaciones)
  importExcel: (filePath) => ipcRenderer.invoke("import-excel", filePath),
  exportExcel: (data, filePath) =>
    ipcRenderer.invoke("export-excel", data, filePath),

  // Seguridad y cifrado
  encryptData: (data, key) => ipcRenderer.invoke("encrypt-data", data, key),
  decryptData: (encryptedData, key) =>
    ipcRenderer.invoke("decrypt-data", encryptedData, key),

  // Base de datos local (para cache offline)
  dbGet: (key) => ipcRenderer.invoke("db-get", key),
  dbSet: (key, value) => ipcRenderer.invoke("db-set", key, value),
  dbDelete: (key) => ipcRenderer.invoke("db-delete", key),
  dbClear: () => ipcRenderer.invoke("db-clear"),

  // Eventos de la aplicación
  onAppReady: (callback) => ipcRenderer.on("app-ready", callback),
  onAppUpdate: (callback) => ipcRenderer.on("app-update", callback),
  onLicenseExpired: (callback) => ipcRenderer.on("license-expired", callback),

  // Logging y debugging
  log: (level, message, data) =>
    ipcRenderer.invoke("log", level, message, data),

  // PDF Generation
  savePDF: (options) => ipcRenderer.invoke("save-pdf", options),

  // Plataforma y sistema
  platform: process.platform,
  isWindows: process.platform === "win32",
  isMac: process.platform === "darwin",
  isLinux: process.platform === "linux",
});

// Exponer constantes útiles
contextBridge.exposeInMainWorld("electronConstants", {
  APP_NAME: "Generador de Liquidaciones",
  APP_VERSION: "2.0.0",
  SUPPORTED_FILE_TYPES: {
    JSON: [".json"],
    EXCEL: [".xlsx", ".xls"],
    PDF: [".pdf"],
  },
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_WORKERS: 10,
  LICENSE_DURATION_YEARS: 2,
  OFFLINE_GRACE_PERIOD_DAYS: 15,
});

// Configuración de seguridad adicional
window.addEventListener("DOMContentLoaded", () => {
  // Prevenir drag & drop de archivos no autorizados
  document.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  // Prevenir menú contextual en producción
  if (process.env.NODE_ENV === "production") {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }

  // Prevenir selección de texto en elementos de UI
  document.addEventListener("selectstart", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return;
    }
    if (e.target.contentEditable === "true") {
      return;
    }
    e.preventDefault();
  });
});

// Manejo de errores globales
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
  ipcRenderer.invoke("log", "error", "Global error", {
    message: event.error.message,
    stack: event.error.stack,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  ipcRenderer.invoke("log", "error", "Unhandled promise rejection", {
    reason: event.reason,
    promise: event.promise,
  });
});

// Configuración de desarrollo
if (process.env.NODE_ENV === "development") {
  // Habilitar herramientas de desarrollo
  contextBridge.exposeInMainWorld("electronDev", {
    openDevTools: () => ipcRenderer.invoke("open-dev-tools"),
    reloadApp: () => ipcRenderer.invoke("reload-app"),
    clearCache: () => ipcRenderer.invoke("clear-cache"),
  });
}
