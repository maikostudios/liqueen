import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/styles/main.css";
import LicenseService from "./services/LicenseService.js";
import UpdateService from "./services/UpdateService.js";
import FirestoreSetup from "./services/FirestoreSetup.js";

const app = createApp(App);
app.use(router);

// Exponer LicenseService globalmente para acceso desde Electron
window.LicenseService = LicenseService;

// Inicializar servicios de licencia y actualizaciones
const initializeServices = async () => {
  try {
    // Inicializar configuración de Firestore
    console.log("🔧 Inicializando base de datos...");
    const firestoreInitialized = await FirestoreSetup.initialize();

    if (!firestoreInitialized) {
      console.log("🧪 Continuando en modo desarrollo sin Firestore");
    }

    // Verificar estado de licencia al iniciar
    console.log("🔍 Verificando estado de licencia...");
    const licenseStatus = await LicenseService.getLicenseStatus();

    if (licenseStatus.isValid) {
      console.log("✅ Licencia válida encontrada");

      // Programar verificaciones periódicas de actualización
      UpdateService.schedulePeriodicCheck((updateInfo) => {
        if (updateInfo.hasUpdate) {
          console.log(
            "🆕 Nueva actualización disponible:",
            updateInfo.latestVersion
          );

          // Mostrar notificación de actualización (opcional)
          if (UpdateService.getUpdateNotificationPreference()) {
            // En una implementación real, mostrar una notificación toast
            console.log("📢 Notificación de actualización habilitada");
          }
        }
      });
    } else {
      console.log("⚠️ No se encontró licencia válida");
    }
  } catch (error) {
    console.log("ℹ️ No hay licencia configurada, redirigiendo a registro");
  }
};

// Montar la aplicación
app.mount("#app");

// Inicializar servicios después del montaje
initializeServices();
