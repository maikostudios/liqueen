/**
 * ConnectivityService - Servicio para detectar conectividad a internet
 * Maneja la detección automática de conexión online/offline
 */

class ConnectivityService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.listeners = [];
    this.setupEventListeners();
  }

  /**
   * Configurar listeners para cambios de conectividad
   */
  setupEventListeners() {
    window.addEventListener('online', () => {
      console.log('🌐 Conexión a internet detectada');
      this.isOnline = true;
      this.notifyListeners(true);
    });

    window.addEventListener('offline', () => {
      console.log('📡 Conexión a internet perdida');
      this.isOnline = false;
      this.notifyListeners(false);
    });
  }

  /**
   * Verificar conectividad con ping a servidor confiable
   * @returns {Promise<boolean>}
   */
  async checkInternetConnectivity() {
    try {
      console.log('🔍 Verificando conectividad a internet...');
      
      // Intentar múltiples endpoints para mayor confiabilidad
      const endpoints = [
        'https://www.google.com/favicon.ico',
        'https://www.cloudflare.com/favicon.ico',
        'https://httpbin.org/status/200'
      ];

      for (const endpoint of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout

          const response = await fetch(endpoint, {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal,
            cache: 'no-cache'
          });

          clearTimeout(timeoutId);
          
          if (response.type === 'opaque' || response.ok) {
            console.log('✅ Conectividad confirmada via:', endpoint);
            this.isOnline = true;
            return true;
          }
        } catch (error) {
          console.log(`⚠️ Fallo en endpoint ${endpoint}:`, error.message);
          continue;
        }
      }

      console.log('❌ Sin conectividad a internet');
      this.isOnline = false;
      return false;
    } catch (error) {
      console.error('❌ Error verificando conectividad:', error);
      this.isOnline = false;
      return false;
    }
  }

  /**
   * Verificar conectividad específica a Firebase
   * @returns {Promise<boolean>}
   */
  async checkFirebaseConnectivity() {
    try {
      console.log('🔥 Verificando conectividad a Firebase...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos para Firebase

      const response = await fetch('https://firebase.googleapis.com/', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache'
      });

      clearTimeout(timeoutId);
      
      if (response.ok || response.status === 404) { // 404 es normal para este endpoint
        console.log('✅ Firebase accesible');
        return true;
      }

      console.log('⚠️ Firebase no accesible, status:', response.status);
      return false;
    } catch (error) {
      console.log('❌ Error conectando a Firebase:', error.message);
      return false;
    }
  }

  /**
   * Verificación completa de conectividad
   * @returns {Promise<{hasInternet: boolean, hasFirebase: boolean, recommendedMode: string}>}
   */
  async performFullConnectivityCheck() {
    console.log('🔍 Iniciando verificación completa de conectividad...');
    
    const startTime = Date.now();
    
    // Verificar conectividad básica primero
    const hasInternet = await this.checkInternetConnectivity();
    
    let hasFirebase = false;
    if (hasInternet) {
      hasFirebase = await this.checkFirebaseConnectivity();
    }

    const duration = Date.now() - startTime;
    console.log(`⏱️ Verificación completada en ${duration}ms`);

    const result = {
      hasInternet,
      hasFirebase,
      recommendedMode: this.getRecommendedMode(hasInternet, hasFirebase),
      timestamp: new Date().toISOString(),
      duration
    };

    console.log('📊 Resultado de conectividad:', result);
    return result;
  }

  /**
   * Determinar modo recomendado basado en conectividad
   * @param {boolean} hasInternet 
   * @param {boolean} hasFirebase 
   * @returns {string}
   */
  getRecommendedMode(hasInternet, hasFirebase) {
    if (hasInternet && hasFirebase) {
      return 'online';
    } else if (hasInternet && !hasFirebase) {
      return 'online-limited'; // Internet pero sin Firebase
    } else {
      return 'offline';
    }
  }

  /**
   * Obtener estado actual de conectividad
   * @returns {boolean}
   */
  getOnlineStatus() {
    return this.isOnline;
  }

  /**
   * Agregar listener para cambios de conectividad
   * @param {Function} callback 
   */
  addConnectivityListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remover listener
   * @param {Function} callback 
   */
  removeConnectivityListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  /**
   * Notificar a todos los listeners
   * @param {boolean} isOnline 
   */
  notifyListeners(isOnline) {
    this.listeners.forEach(callback => {
      try {
        callback(isOnline);
      } catch (error) {
        console.error('Error en connectivity listener:', error);
      }
    });
  }

  /**
   * Verificación rápida para UI
   * @returns {Promise<boolean>}
   */
  async quickConnectivityCheck() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 segundos rápido

      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
        cache: 'no-cache'
      });

      clearTimeout(timeoutId);
      return response.type === 'opaque' || response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Crear instancia singleton
const connectivityService = new ConnectivityService();

export default connectivityService;
