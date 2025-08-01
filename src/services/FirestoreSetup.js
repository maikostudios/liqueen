/**
 * Configuración y estructura de Firestore para el sistema de licencias
 * Este archivo define la estructura de las colecciones y documentos
 */

import { db } from "./firebase.js";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Estructura de colecciones en Firestore:
 *
 * /licenses/{licenseCode}
 * {
 *   code: string,           // Código de licencia (LIQ-YYYY-XXXX-YYYY)
 *   type: string,           // 'standard', 'trial', 'extended'
 *   status: string,         // 'available', 'used', 'expired', 'revoked'
 *   createdAt: timestamp,   // Fecha de creación
 *   expiryDate: timestamp,  // Fecha de expiración
 *   activatedOn: timestamp, // Fecha de activación (cuando se usa)
 *   userId: string,         // ID del usuario que activó la licencia
 *   userEmail: string,      // Email del usuario
 *   hardwareId: string,     // ID único del hardware
 *   description: string,    // Descripción opcional
 *   generatedBy: string,    // ID del admin que generó la licencia
 *   validationCount: number,// Número de validaciones realizadas
 *   lastValidation: timestamp, // Última validación online
 *   revokedAt: timestamp,   // Fecha de revocación (si aplica)
 *   revokedBy: string       // ID del admin que revocó
 * }
 *
 * /users/{userId}
 * {
 *   email: string,
 *   licenseCode: string,
 *   registeredAt: timestamp,
 *   lastLogin: timestamp,
 *   hardwareId: string,
 *   sessionToken: string,
 *   isActive: boolean
 * }
 *
 * /app-config/version
 * {
 *   currentVersion: string,
 *   latestVersion: string,
 *   updateInfo: {
 *     releaseDate: timestamp,
 *     changelog: array,
 *     downloadUrl: string,
 *     isRequired: boolean,
 *     minCompatibleVersion: string
 *   }
 * }
 *
 * /app-config/settings
 * {
 *   licenseValidationInterval: number, // días
 *   gracePeriodsEnabled: boolean,
 *   gracePeriodDays: number,
 *   maxOfflineDays: number,
 *   updateCheckInterval: number, // horas
 *   maintenanceMode: boolean
 * }
 */

export class FirestoreSetup {
  /**
   * Inicializa la configuración básica de la aplicación
   */
  static async initializeAppConfig() {
    try {
      // Configurar versión inicial
      const versionRef = doc(db, "app-config", "version");
      const versionDoc = await getDoc(versionRef);

      if (!versionDoc.exists()) {
        await setDoc(versionRef, {
          currentVersion: "2.0.0",
          latestVersion: "2.0.0",
          updateInfo: {
            releaseDate: Date.now(),
            changelog: [
              "Sistema de licencias implementado",
              "Autenticación basada en códigos de licencia",
              "Validación online/offline",
              "Gestión de actualizaciones automáticas",
            ],
            downloadUrl: "https://github.com/tu-repo/releases/latest",
            isRequired: false,
            minCompatibleVersion: "2.0.0",
          },
        });
        console.log("✅ Configuración de versión inicializada");
      }

      // Configurar ajustes de la aplicación
      const settingsRef = doc(db, "app-config", "settings");
      const settingsDoc = await getDoc(settingsRef);

      if (!settingsDoc.exists()) {
        await setDoc(settingsRef, {
          licenseValidationInterval: 30, // 30 días
          gracePeriodsEnabled: true,
          gracePeriodDays: 15,
          maxOfflineDays: 45, // 30 días + 15 días de gracia
          updateCheckInterval: 24, // 24 horas
          maintenanceMode: false,
        });
        console.log("✅ Configuración de ajustes inicializada");
      }

      return true;
    } catch (error) {
      console.error("❌ Error inicializando configuración:", error);
      return false;
    }
  }

  /**
   * Crea licencias de ejemplo para testing
   */
  static async createSampleLicenses() {
    try {
      const sampleLicenses = [
        {
          code: "LIQ-2025-TEST-0001-MAIK",
          type: "trial",
          status: "available",
          createdAt: Date.now(),
          expiryDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 días
          description: "Licencia de prueba para testing",
          generatedBy: "system",
          validationCount: 0,
        },
        {
          code: "LIQ-2025-DEMO-0001-STUD",
          type: "standard",
          status: "available",
          createdAt: Date.now(),
          expiryDate: Date.now() + 2 * 365 * 24 * 60 * 60 * 1000, // 2 años
          description: "Licencia estándar para demostración",
          generatedBy: "system",
          validationCount: 0,
        },
        {
          code: "LIQ-2025-ADMIN-0001-SAEZ",
          type: "extended",
          status: "available",
          createdAt: Date.now(),
          expiryDate: Date.now() + 5 * 365 * 24 * 60 * 60 * 1000, // 5 años
          description: "Licencia extendida para administradores",
          generatedBy: "system",
          validationCount: 0,
        },
      ];

      for (const license of sampleLicenses) {
        const licenseRef = doc(db, "licenses", license.code);
        const licenseDoc = await getDoc(licenseRef);

        if (!licenseDoc.exists()) {
          await setDoc(licenseRef, license);
          console.log(`✅ Licencia de ejemplo creada: ${license.code}`);
        }
      }

      return true;
    } catch (error) {
      console.error("❌ Error creando licencias de ejemplo:", error);
      return false;
    }
  }

  /**
   * Verifica la integridad de la base de datos
   */
  static async verifyDatabaseIntegrity() {
    try {
      // Verificar configuración de versión
      const versionRef = doc(db, "app-config", "version");
      const versionDoc = await getDoc(versionRef);

      if (!versionDoc.exists()) {
        console.warn("⚠️ Configuración de versión no encontrada");
        return false;
      }

      // Verificar configuración de ajustes
      const settingsRef = doc(db, "app-config", "settings");
      const settingsDoc = await getDoc(settingsRef);

      if (!settingsDoc.exists()) {
        console.warn("⚠️ Configuración de ajustes no encontrada");
        return false;
      }

      console.log("✅ Integridad de base de datos verificada");
      return true;
    } catch (error) {
      console.error("❌ Error verificando integridad:", error);
      return false;
    }
  }

  /**
   * Inicializa toda la configuración de Firestore
   */
  static async initialize() {
    console.log("🔧 Inicializando configuración de Firestore...");

    try {
      // Verificar integridad primero
      const isIntegrityOk = await this.verifyDatabaseIntegrity();

      if (!isIntegrityOk) {
        console.log("🔧 Configurando base de datos por primera vez...");

        // Inicializar configuración
        await this.initializeAppConfig();

        // Crear licencias de ejemplo (solo en desarrollo)
        if (process.env.NODE_ENV === "development") {
          await this.createSampleLicenses();
        }
      }

      console.log("✅ Configuración de Firestore completada");
      return true;
    } catch (error) {
      console.error("❌ Error en inicialización de Firestore:", error);
      console.log("🧪 Continuando en modo desarrollo sin Firestore...");
      return false; // Permitir continuar sin Firestore
      return false;
    }
  }

  /**
   * Obtiene la configuración actual de la aplicación
   */
  static async getAppConfig() {
    try {
      const versionRef = doc(db, "app-config", "version");
      const settingsRef = doc(db, "app-config", "settings");

      const [versionDoc, settingsDoc] = await Promise.all([
        getDoc(versionRef),
        getDoc(settingsRef),
      ]);

      return {
        version: versionDoc.exists() ? versionDoc.data() : null,
        settings: settingsDoc.exists() ? settingsDoc.data() : null,
      };
    } catch (error) {
      console.error("❌ Error obteniendo configuración:", error);
      return null;
    }
  }

  /**
   * Actualiza la configuración de versión
   */
  static async updateVersionConfig(versionData) {
    try {
      const versionRef = doc(db, "app-config", "version");
      await setDoc(versionRef, versionData, { merge: true });
      console.log("✅ Configuración de versión actualizada");
      return true;
    } catch (error) {
      console.error("❌ Error actualizando versión:", error);
      return false;
    }
  }

  /**
   * Actualiza la configuración de ajustes
   */
  static async updateSettingsConfig(settingsData) {
    try {
      const settingsRef = doc(db, "app-config", "settings");
      await setDoc(settingsRef, settingsData, { merge: true });
      console.log("✅ Configuración de ajustes actualizada");
      return true;
    } catch (error) {
      console.error("❌ Error actualizando ajustes:", error);
      return false;
    }
  }
}

export default FirestoreSetup;
