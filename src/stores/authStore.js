import { ref, reactive, computed } from "vue";
import { simpleAuthService as authService } from "../services/firebaseSimple.js";

// Estado global de autenticación
const user = ref(null);
const isAuthenticated = ref(false);
const isLoading = ref(true);
const userData = ref(null);
const licenseStatus = ref("inactive");
const isOnline = ref(navigator.onLine);
const lastSyncTime = ref(null);

// Configuración del usuario
const userSettings = reactive({
  darkMode: false,
  notifications: true,
  autoSave: true,
  language: "es",
});

// Estadísticas de uso
const usageStats = reactive({
  liquidationsGenerated: 0,
  lastUsed: null,
  totalSessions: 0,
});

// Estado de la licencia
const licenseInfo = reactive({
  type: "trial",
  expiryDate: null,
  daysRemaining: 0,
  isActive: false,
  lastValidation: null,
  offlineGracePeriod: 15,
  offlineDaysUsed: 0,
});

// Computadas
const isLicenseActive = computed(() => {
  return licenseInfo.isActive && licenseInfo.daysRemaining > 0;
});

const canUseOffline = computed(() => {
  return licenseInfo.offlineDaysUsed < licenseInfo.offlineGracePeriod;
});

const needsLicenseValidation = computed(() => {
  if (!licenseInfo.lastValidation) return true;

  const daysSinceValidation = Math.floor(
    (Date.now() - licenseInfo.lastValidation) / (1000 * 60 * 60 * 24)
  );

  return daysSinceValidation >= 30; // Validación mensual
});

// Clase para manejar el estado de autenticación
class AuthStore {
  constructor() {
    this.initializeAuth();
    this.setupConnectionMonitoring();
  }

  // Inicializar autenticación
  async initializeAuth() {
    isLoading.value = true;

    try {
      // Configurar listener de cambios de autenticación
      authService.onAuthStateChange(async (firebaseUser) => {
        if (firebaseUser) {
          await this.setUser(firebaseUser);
        } else {
          this.clearUser();
        }
        isLoading.value = false;
      });

      // Cargar configuración local
      this.loadLocalSettings();
    } catch (error) {
      console.error("Error initializing auth:", error);
      isLoading.value = false;
    }
  }

  // Establecer usuario autenticado
  async setUser(firebaseUser) {
    user.value = firebaseUser;
    isAuthenticated.value = true;

    try {
      // Crear datos básicos del usuario desde Firebase Auth
      userData.value = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName:
          firebaseUser.displayName || firebaseUser.email.split("@")[0],
        plan: "trial",
        licenseStatus: "active", // Simplificado para el servicio básico
      };

      // Cargar configuración local si existe
      this.loadLocalSettings();

      // Establecer licencia como activa para el servicio simplificado
      licenseInfo.isActive = true;
      licenseInfo.type = "trial";
      licenseInfo.daysRemaining = 30; // 30 días de prueba
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }

  // Limpiar datos del usuario
  clearUser() {
    user.value = null;
    isAuthenticated.value = false;
    userData.value = null;
    licenseStatus.value = "inactive";

    // Resetear configuración a valores por defecto
    Object.assign(userSettings, {
      darkMode: false,
      notifications: true,
      autoSave: true,
      language: "es",
    });

    // Resetear estadísticas
    Object.assign(usageStats, {
      liquidationsGenerated: 0,
      lastUsed: null,
      totalSessions: 0,
    });

    // Resetear información de licencia
    Object.assign(licenseInfo, {
      type: "trial",
      expiryDate: null,
      daysRemaining: 0,
      isActive: false,
      lastValidation: null,
      offlineGracePeriod: 15,
      offlineDaysUsed: 0,
    });
  }

  // Actualizar información de licencia
  updateLicenseInfo(userDoc) {
    if (userDoc.license) {
      Object.assign(licenseInfo, {
        type: userDoc.license.type || "trial",
        expiryDate: userDoc.license.expiryDate,
        isActive: userDoc.license.isActive || false,
        lastValidation: userDoc.license.lastValidation,
        offlineDaysUsed: userDoc.license.offlineDaysUsed || 0,
      });

      // Calcular días restantes
      if (licenseInfo.expiryDate) {
        const now = new Date();
        const expiry = new Date(licenseInfo.expiryDate.seconds * 1000);
        const diffTime = expiry - now;
        licenseInfo.daysRemaining = Math.max(
          0,
          Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        );
      }
    }
  }

  // Actualizar configuración del usuario
  updateUserSettings(settings) {
    Object.assign(userSettings, {
      darkMode: settings.darkMode || false,
      notifications: settings.notifications !== false,
      autoSave: settings.autoSave !== false,
      language: settings.language || "es",
    });

    // Aplicar tema oscuro
    this.applyDarkMode(userSettings.darkMode);
  }

  // Actualizar estadísticas de uso
  updateUsageStats(usage) {
    Object.assign(usageStats, {
      liquidationsGenerated: usage.liquidationsGenerated || 0,
      lastUsed: usage.lastUsed,
      totalSessions: usage.totalSessions || 0,
    });
  }

  // Sincronizar datos con el servidor
  async syncUserData() {
    if (!user.value || !isOnline.value) return;

    try {
      // Para el servicio simplificado, solo guardamos localmente
      // En el futuro, cuando Firestore esté disponible, se sincronizará con el servidor
      this.saveLocalSettings();
      lastSyncTime.value = new Date();
      console.log("Datos sincronizados localmente");
    } catch (error) {
      console.error("Error syncing user data:", error);
    }
  }

  // Guardar configuración localmente
  saveLocalSettings() {
    try {
      const localData = {
        settings: userSettings,
        usage: usageStats,
        license: licenseInfo,
      };

      localStorage.setItem(
        "generador-liquidaciones-config",
        JSON.stringify(localData)
      );
    } catch (error) {
      console.error("Error saving local settings:", error);
    }
  }

  // Cargar configuración local
  loadLocalSettings() {
    try {
      const localData = localStorage.getItem("generador-liquidaciones-config");
      if (localData) {
        const parsed = JSON.parse(localData);

        if (parsed.settings) {
          this.updateUserSettings(parsed.settings);
        }

        if (parsed.usage) {
          this.updateUsageStats(parsed.usage);
        }

        if (parsed.license) {
          Object.assign(licenseInfo, parsed.license);
        }
      }
    } catch (error) {
      console.error("Error loading local settings:", error);
    }
  }

  // Aplicar modo oscuro
  applyDarkMode(isDark) {
    if (isDark) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }

  // Alternar modo oscuro
  async toggleDarkMode() {
    userSettings.darkMode = !userSettings.darkMode;
    this.applyDarkMode(userSettings.darkMode);
    this.saveLocalSettings();

    if (isAuthenticated.value && isOnline.value) {
      await this.syncUserData();
    }
  }

  // Actualizar configuración
  async updateSetting(key, value) {
    userSettings[key] = value;
    this.saveLocalSettings();

    if (isAuthenticated.value && isOnline.value) {
      await this.syncUserData();
    }
  }

  // Incrementar contador de liquidaciones
  async incrementLiquidationCount() {
    usageStats.liquidationsGenerated++;
    usageStats.lastUsed = new Date();
    this.saveLocalSettings();

    if (isAuthenticated.value && isOnline.value) {
      await this.syncUserData();
    }
  }

  // Validar licencia
  async validateLicense() {
    if (!isAuthenticated.value) return false;

    try {
      if (isOnline.value) {
        // Validación online
        const result = await this.performOnlineLicenseValidation();
        if (result.success) {
          licenseInfo.lastValidation = Date.now();
          licenseInfo.isActive = result.isActive;
          licenseInfo.offlineDaysUsed = 0;
          this.saveLocalSettings();
        }
        return result.isActive;
      } else {
        // Validación offline
        return this.performOfflineLicenseValidation();
      }
    } catch (error) {
      console.error("Error validating license:", error);
      return false;
    }
  }

  // Validación online de licencia
  async performOnlineLicenseValidation() {
    // Implementar validación con servidor
    // Por ahora, simulamos la validación
    return {
      success: true,
      isActive: licenseInfo.type !== "trial" || licenseInfo.daysRemaining > 0,
    };
  }

  // Validación offline de licencia
  performOfflineLicenseValidation() {
    if (!canUseOffline.value) {
      return false;
    }

    // Incrementar días offline usados
    licenseInfo.offlineDaysUsed++;
    this.saveLocalSettings();

    return licenseInfo.isActive && licenseInfo.daysRemaining > 0;
  }

  // Configurar monitoreo de conexión
  setupConnectionMonitoring() {
    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine;

      if (isOnline.value && isAuthenticated.value) {
        // Sincronizar cuando vuelva la conexión
        this.syncUserData();
      }
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
  }

  // Método de login con Firebase Authentication
  async login(email, password, rememberMe = false) {
    try {
      isLoading.value = true;

      // Intentar login con Firebase
      const result = await authService.login(email, password);

      if (result.success) {
        await this.setUser(result.user);

        // Configurar persistencia si se solicita
        if (rememberMe) {
          localStorage.setItem("rememberUser", "true");
          localStorage.setItem("userEmail", email);
          this.saveLocalSettings();
        }

        // Incrementar contador de sesiones
        usageStats.totalSessions++;
        await this.syncUserData();

        return {
          success: true,
          user: result.user,
          message: "Sesión iniciada exitosamente",
        };
      } else {
        return {
          success: false,
          error: result.error || "auth/invalid-credential",
          message: result.message || "Credenciales inválidas",
        };
      }
    } catch (error) {
      console.error("Error en login:", error);
      return {
        success: false,
        error: error.code || "auth/unknown-error",
        message: error.message || "Error desconocido durante el login",
      };
    } finally {
      isLoading.value = false;
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      await authService.logout();
      this.clearUser();

      // Limpiar datos locales sensibles pero mantener configuración básica
      const basicSettings = {
        darkMode: userSettings.darkMode,
        language: userSettings.language,
      };

      localStorage.setItem(
        "generador-liquidaciones-config",
        JSON.stringify({
          settings: basicSettings,
        })
      );

      return { success: true };
    } catch (error) {
      console.error("Error during logout:", error);
      return { success: false, error: error.message };
    }
  }
}

// Instancia singleton del store
export const authStore = new AuthStore();

// Exportar estado reactivo
export {
  user,
  isAuthenticated,
  isLoading,
  userData,
  licenseStatus,
  isOnline,
  lastSyncTime,
  userSettings,
  usageStats,
  licenseInfo,
  isLicenseActive,
  canUseOffline,
  needsLicenseValidation,
};
