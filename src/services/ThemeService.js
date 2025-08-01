/**
 * 🎨 ThemeService - Gestión de temas claro/oscuro
 * Maneja el cambio entre modo día y noche con persistencia local
 */

class ThemeService {
  constructor() {
    this.storageKey = 'liqueen_theme'
    this.currentTheme = this.loadTheme()
    this.observers = []
    
    // Aplicar tema inicial
    this.applyTheme(this.currentTheme)
  }

  /**
   * 📂 Cargar tema guardado o detectar preferencia del sistema
   */
  loadTheme() {
    try {
      const savedTheme = localStorage.getItem(this.storageKey)
      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        return savedTheme
      }
      
      // Detectar preferencia del sistema
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
      
      return 'light'
    } catch (error) {
      console.warn('Error cargando tema:', error)
      return 'light'
    }
  }

  /**
   * 💾 Guardar tema en localStorage
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(this.storageKey, theme)
    } catch (error) {
      console.warn('Error guardando tema:', error)
    }
  }

  /**
   * 🎨 Aplicar tema al documento
   */
  applyTheme(theme) {
    const root = document.documentElement
    
    // Remover clases de tema anteriores
    root.classList.remove('theme-light', 'theme-dark')
    
    // Agregar nueva clase de tema
    root.classList.add(`theme-${theme}`)
    
    // Actualizar atributo data-theme para CSS
    root.setAttribute('data-theme', theme)
    
    console.log(`🎨 Tema aplicado: ${theme}`)
  }

  /**
   * 🔄 Alternar entre tema claro y oscuro
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light'
    this.setTheme(newTheme)
    return newTheme
  }

  /**
   * 🎯 Establecer tema específico
   */
  setTheme(theme) {
    if (!['light', 'dark'].includes(theme)) {
      console.warn('Tema inválido:', theme)
      return
    }

    this.currentTheme = theme
    this.applyTheme(theme)
    this.saveTheme(theme)
    
    // Notificar a observadores
    this.notifyObservers(theme)
  }

  /**
   * 📊 Obtener tema actual
   */
  getCurrentTheme() {
    return this.currentTheme
  }

  /**
   * 🌓 Verificar si está en modo oscuro
   */
  isDarkMode() {
    return this.currentTheme === 'dark'
  }

  /**
   * ☀️ Verificar si está en modo claro
   */
  isLightMode() {
    return this.currentTheme === 'light'
  }

  /**
   * 👁️ Agregar observador para cambios de tema
   */
  addObserver(callback) {
    if (typeof callback === 'function') {
      this.observers.push(callback)
    }
  }

  /**
   * 🚫 Remover observador
   */
  removeObserver(callback) {
    this.observers = this.observers.filter(obs => obs !== callback)
  }

  /**
   * 📢 Notificar a todos los observadores
   */
  notifyObservers(theme) {
    this.observers.forEach(callback => {
      try {
        callback(theme)
      } catch (error) {
        console.warn('Error en observador de tema:', error)
      }
    })
  }

  /**
   * 🎨 Obtener información del tema actual
   */
  getThemeInfo() {
    return {
      current: this.currentTheme,
      isDark: this.isDarkMode(),
      isLight: this.isLightMode(),
      icon: this.isDarkMode() ? '🌙' : '☀️',
      label: this.isDarkMode() ? 'Modo Oscuro' : 'Modo Claro',
      toggleLabel: this.isDarkMode() ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'
    }
  }

  /**
   * 🔧 Inicializar escucha de cambios del sistema
   */
  initSystemThemeListener() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      mediaQuery.addEventListener('change', (e) => {
        // Solo cambiar si no hay tema guardado manualmente
        const savedTheme = localStorage.getItem(this.storageKey)
        if (!savedTheme) {
          const systemTheme = e.matches ? 'dark' : 'light'
          this.setTheme(systemTheme)
        }
      })
    }
  }
}

// Crear instancia singleton
const themeService = new ThemeService()

// Inicializar escucha del sistema
themeService.initSystemThemeListener()

export default themeService
