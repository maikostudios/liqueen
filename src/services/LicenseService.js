/**
 * 📜 LicenseService - Gestión completa de licencias
 * Maneja validación online/offline, activación y renovación de licencias
 */

import { db, auth } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import HardwareService from "./HardwareService.js";
import CryptoService from "./CryptoService.js";
import LoggingService from "./LoggingService.js";
import CryptoJS from "crypto-js";

class LicenseService {
  constructor() {
    this.localLicenseFile = "liqueen_license.lic";
    this.validationInterval = 30 * 24 * 60 * 60 * 1000; // 30 días
    this.emergencyGracePeriod = 15 * 24 * 60 * 60 * 1000; // 15 días
    this.licenseValidityPeriod = 2 * 365 * 24 * 60 * 60 * 1000; // 2 años

    // Credenciales maestras para acceso de emergencia
    this.masterCredentials = {
      email: "maikostudios@gmail.com",
      passwordHash: "e10adc3949ba59abbe56e057f20f883e", // MD5 de "123456"
      role: "master_admin",
    };
  }

  /**
   * 🔍 Valida si un código de licencia existe y está disponible
   */
  async validateLicenseCode(licenseCode) {
    try {
      console.log("🔍 Validando código de licencia:", licenseCode);

      // Modo de desarrollo - simular validación
      if (import.meta.env.DEV || !navigator.onLine) {
        console.log("🧪 Modo desarrollo - simulando validación...");

        // Licencias de prueba válidas
        const validTestLicenses = [
          "LIQ-2025-TEST-0001-MAIK",
          "LIQ-2025-DEMO-0001-STUD",
          "LIQ-2025-ADMIN-0001-SAEZ",
        ];

        const isValid = validTestLicenses.includes(licenseCode);
        console.log(
          `📋 Licencia ${licenseCode}: ${isValid ? "VÁLIDA" : "INVÁLIDA"}`
        );
        return isValid;
      }

      // Modo producción - validar con Firestore
      const licenseRef = doc(db, "licenses", licenseCode);
      const licenseDoc = await getDoc(licenseRef);

      if (!licenseDoc.exists()) {
        console.log("❌ Código de licencia no encontrado");
        return false;
      }

      const licenseData = licenseDoc.data();
      const isAvailable = licenseData.status === "available";

      console.log("📋 Estado de licencia:", licenseData.status);
      return isAvailable;
    } catch (error) {
      console.error("❌ Error validando código de licencia:", error);

      // Fallback en caso de error - modo desarrollo
      if (import.meta.env.DEV) {
        console.log("🔄 Fallback a modo desarrollo por error de conexión");
        const validTestLicenses = [
          "LIQ-2025-TEST-0001-MAIK",
          "LIQ-2025-DEMO-0001-STUD",
          "LIQ-2025-ADMIN-0001-SAEZ",
        ];
        return validTestLicenses.includes(licenseCode);
      }

      return false;
    }
  }

  /**
   * 📝 Registra nuevo usuario con código de licencia
   */
  async registerUserWithLicense(
    email,
    password,
    licenseCode,
    name = "",
    phone = ""
  ) {
    try {
      console.log("📝 Iniciando registro de usuario con licencia...");

      // 1. Validar formato del código de licencia
      if (!CryptoService.validateLicenseCodeFormat(licenseCode)) {
        throw new Error("Formato de código de licencia inválido");
      }

      // 2. Verificar que la licencia existe y está disponible
      let isDevMode = false;
      let licenseDoc = null;

      try {
        // Intentar validar con Firestore primero
        licenseDoc = await getDoc(doc(db, "licenses", licenseCode));
        if (!licenseDoc.exists()) {
          throw new Error("Código de licencia no encontrado en Firestore");
        }

        const licenseData = licenseDoc.data();
        if (licenseData.status !== "available") {
          throw new Error("Código de licencia ya utilizado o revocado");
        }

        console.log("🌐 Usando validación online con Firestore");
      } catch (error) {
        console.log(
          "⚠️ Firestore no disponible, usando modo desarrollo:",
          error.message
        );
        isDevMode = true;

        // Validar que sea una licencia de prueba válida
        const validTestLicenses = [
          "LIQ-2025-TEST-0001-MAIK",
          "LIQ-2025-DEMO-0001-STUD",
          "LIQ-2025-ADMIN-0001-SAEZ",
        ];

        if (!validTestLicenses.includes(licenseCode)) {
          throw new Error("Código de licencia no válido para modo desarrollo");
        }
      }

      // Determinar rol del usuario (solo maikostudios@gmail.com es admin)
      const userRole = email === "maikostudios@gmail.com" ? "admin" : "user";

      // Obtener hardware ID
      const hardwareId = await HardwareService.getHardwareId();

      // Configurar fechas
      const now = Date.now();
      const expiryDate =
        userRole === "admin"
          ? now + 10 * 365 * 24 * 60 * 60 * 1000 // 10 años para admin
          : now + this.licenseValidityPeriod; // 2 años para usuarios

      let user;

      if (isDevMode) {
        console.log("🧪 Modo desarrollo - simulando registro...");

        // Simular usuario registrado exitosamente
        user = {
          uid: "dev-user-" + Date.now(),
          email: email,
          displayName: name,
        };
      } else {
        console.log("🌐 Modo producción - registrando en Firebase...");

        // 3. Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        user = userCredential.user;

        // 4. Actualizar licencia en Firestore
        const activatedLicenseData = {
          status: "used",
          activatedOn: now,
          expiryDate: expiryDate,
          hardwareId: hardwareId,
          userId: user.uid,
          userEmail: email,
          lastValidation: now,
          validationCount: 1,
        };

        await updateDoc(doc(db, "licenses", licenseCode), activatedLicenseData);

        // 5. Crear perfil de usuario con rol en Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: email,
          name: name,
          phone: phone,
          role: userRole,
          licenseCode: licenseCode,
          licenseType: userRole === "admin" ? "unlimited" : "standard",
          licenseStatus: "active",
          registeredOn: now,
          hardwareId: hardwareId,
          lastLogin: now,
          isActive: true,
          permissions:
            userRole === "admin"
              ? [
                  "generate_licenses",
                  "manage_users",
                  "view_analytics",
                  "system_config",
                  "revoke_licenses",
                  "unlimited_liquidations",
                  "access_admin_panel",
                ]
              : [
                  "use_app",
                  "generate_liquidations",
                  "export_pdf",
                  "basic_features",
                ],
        });

        console.log("✅ Usuario registrado en Firestore exitosamente");
      }

      // Guardar datos de usuario localmente (siempre)
      await this.saveUserDataLocally({
        uid: user.uid,
        email: email,
        name: name,
        phone: phone,
        role: userRole,
        licenseCode: licenseCode,
        licenseType: userRole === "admin" ? "unlimited" : "standard",
        licenseStatus: "active",
        createdAt: now,
        lastLogin: now,
        permissions:
          userRole === "admin"
            ? [
                "generate_licenses",
                "manage_users",
                "view_analytics",
                "system_config",
                "revoke_licenses",
                "unlimited_liquidations",
                "access_admin_panel",
              ]
            : [
                "use_app",
                "generate_liquidations",
                "export_pdf",
                "basic_features",
              ],
      });

      // Guardar licencia localmente (siempre)
      await this.saveLicenseLocally({
        licenseCode,
        expiryDate,
        hardwareId: hardwareId,
        userId: user.uid,
        activatedOn: now,
        lastValidation: now,
        validationCount: 1,
      });

      // Guardar datos de usuario localmente con hash de contraseña para validación offline
      const passwordHash = CryptoService.hashPassword(password);
      await this.saveUserDataLocally({
        email: email,
        uid: user.uid,
        displayName: name || email,
        role: userRole,
        passwordHash: passwordHash, // Hash para validación offline
        lastLogin: now,
      });

      console.log(
        `✅ Registro ${
          isDevMode ? "simulado" : "real"
        } exitosamente - Rol: ${userRole}`
      );
      return {
        success: true,
        user: user,
        role: userRole,
        licenseCode: licenseCode,
        expiryDate: expiryDate,
        daysRemaining: Math.floor((expiryDate - now) / (24 * 60 * 60 * 1000)),
      };
    } catch (error) {
      console.error("❌ Error en registro de usuario:", error);
      throw error;
    }
  }

  /**
   * 🔐 Login de usuario con validación de licencia
   */
  async loginUser(email, password) {
    try {
      console.log("🔐 Iniciando login de usuario...");
      LoggingService.authLog("INFO", "Iniciando proceso de login online", {
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
      });

      // 1. Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      LoggingService.authLog("INFO", "Autenticación Firebase exitosa", {
        userId: user.uid,
      });

      // 2. Obtener datos del usuario
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        throw new Error("Datos de usuario no encontrados");
      }

      const userData = userDoc.data();

      // 3. Validar licencia online
      const licenseValidation = await this.validateLicenseOnline(
        userData.licenseCode
      );

      if (!licenseValidation.isValid) {
        throw new Error(licenseValidation.error || "Licencia inválida");
      }

      // 4. Actualizar último login
      await updateDoc(doc(db, "users", user.uid), {
        lastLogin: Date.now(),
      });

      // 5. Guardar/actualizar licencia local
      await this.saveLicenseLocally(licenseValidation.licenseData);

      // 6. Guardar datos de usuario localmente con hash de contraseña para validación offline
      const passwordHash = CryptoService.hashPassword(password);
      await this.saveUserDataLocally({
        email: email,
        uid: user.uid,
        displayName: userData.displayName || userData.name || email,
        role: userData.role || "user",
        passwordHash: passwordHash, // Hash para validación offline
        lastLogin: Date.now(),
      });

      console.log("✅ Login exitoso");
      LoggingService.logLoginAttempt(email, "online", true);
      LoggingService.licenseLog(
        "INFO",
        "Login online completado exitosamente",
        {
          userId: user.uid,
          licenseCode: userData.licenseCode.substring(0, 8) + "***",
          daysRemaining: licenseValidation.daysRemaining,
        }
      );

      return {
        success: true,
        user: user,
        userData: userData,
        licenseData: licenseValidation.licenseData,
        daysRemaining: licenseValidation.daysRemaining,
      };
    } catch (error) {
      console.error("❌ Error en login:", error);
      LoggingService.logLoginAttempt(email, "online", false, error.message);

      // Intentar login offline como fallback
      console.log("🔄 Intentando login offline...");
      LoggingService.authLog(
        "WARN",
        "Login online falló, intentando fallback offline",
        { error: error.message }
      );
      return await this.loginOffline(email, password);
    }
  }

  /**
   * 🔑 Login maestro para acceso de emergencia
   */
  async loginMaster(email, password) {
    try {
      console.log("🔑 Verificando credenciales maestras...");
      LoggingService.authLog("INFO", "Intento de login maestro", {
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
      });

      // Verificar email maestro
      if (email !== this.masterCredentials.email) {
        throw new Error("Credenciales maestras inválidas");
      }

      // Verificar contraseña (usando MD5 simple para credenciales maestras)
      const passwordHash = CryptoJS.MD5(password).toString();
      if (passwordHash !== this.masterCredentials.passwordHash) {
        throw new Error("Credenciales maestras inválidas");
      }

      console.log("✅ Acceso maestro autorizado");
      LoggingService.authLog("INFO", "Login maestro exitoso", {
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
        role: this.masterCredentials.role,
      });

      // Crear sesión maestra
      const masterSession = {
        email: email,
        role: this.masterCredentials.role,
        isMaster: true,
        loginTime: Date.now(),
        permissions: [
          "reset_config",
          "manage_licenses",
          "view_logs",
          "emergency_access",
        ],
      };

      // Guardar sesión maestra
      await this.saveUserDataLocally(masterSession);

      return {
        success: true,
        isMaster: true,
        userData: masterSession,
        licenseData: {
          licenseCode: "MASTER-ACCESS",
          status: "master",
          expiryDate: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 año
          permissions: masterSession.permissions,
        },
        daysRemaining: 365,
      };
    } catch (error) {
      console.error("❌ Error en login maestro:", error);
      LoggingService.authLog("ERROR", "Error en login maestro", {
        error: error.message,
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
      });
      throw error;
    }
  }

  /**
   * 🔒 Login offline usando licencia local
   */
  async loginOffline(email, password = null) {
    try {
      console.log("🔒 Iniciando login offline para:", email);
      LoggingService.authLog("INFO", "Iniciando proceso de login offline", {
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
        hasPassword: !!password,
      });

      // 1. Cargar licencia local
      const localLicense = await this.loadLicenseLocally();
      if (!localLicense) {
        LoggingService.authLog(
          "ERROR",
          "No hay licencia local disponible para login offline"
        );
        throw new Error("No hay licencia local disponible");
      }
      LoggingService.licenseLog(
        "INFO",
        "Licencia local cargada para validación offline",
        {
          licenseCode: localLicense.licenseCode?.substring(0, 8) + "***",
        }
      );

      // 2. Cargar datos de usuario local
      const localUserData = await this.loadUserDataLocally();
      if (!localUserData) {
        throw new Error(
          "No hay datos de usuario locales. Debe iniciar sesión online primero."
        );
      }

      // 3. VALIDACIÓN CRÍTICA: Verificar que el email coincida con el usuario de la licencia
      if (localUserData.email !== email) {
        throw new Error(
          `Este dispositivo está registrado para ${localUserData.email}. Para usar una cuenta diferente, debe desinstalar y reinstalar la aplicación o contactar soporte técnico.`
        );
      }

      // 4. Si se proporciona contraseña, validarla (para login con contraseña)
      if (password) {
        // Verificar contraseña usando hash almacenado
        const isPasswordValid = await this.verifyPasswordOffline(
          password,
          localUserData.passwordHash
        );
        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta");
        }
      }

      // 5. Validar licencia offline
      const validation = await this.validateLicenseOffline(localLicense);
      if (!validation.isValid) {
        throw new Error(validation.error || "Licencia local inválida");
      }

      console.log("✅ Login offline exitoso para:", email);
      LoggingService.logLoginAttempt(email, "offline", true);
      LoggingService.licenseLog(
        "INFO",
        "Login offline completado exitosamente",
        {
          licenseCode: localLicense.licenseCode?.substring(0, 8) + "***",
          daysRemaining: validation.daysRemaining,
          needsOnlineValidation: validation.needsOnlineValidation,
        }
      );

      return {
        success: true,
        isOffline: true,
        licenseData: localLicense,
        userData: localUserData,
        daysRemaining: validation.daysRemaining,
        needsOnlineValidation: validation.needsOnlineValidation,
      };
    } catch (error) {
      console.error("❌ Error en login offline:", error);
      LoggingService.logLoginAttempt(email, "offline", false, error.message);
      LoggingService.authLog("ERROR", "Error en proceso de login offline", {
        error: error.message,
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
      });
      throw error;
    }
  }

  /**
   * ✅ Valida licencia online
   */
  async validateLicenseOnline(licenseCode) {
    try {
      const licenseDoc = await getDoc(doc(db, "licenses", licenseCode));

      if (!licenseDoc.exists()) {
        return { isValid: false, error: "Licencia no encontrada" };
      }

      const licenseData = licenseDoc.data();

      // Verificar estado
      if (licenseData.status === "revoked") {
        return { isValid: false, error: "Licencia revocada" };
      }

      if (licenseData.status !== "used") {
        return { isValid: false, error: "Licencia no activada" };
      }

      // Verificar expiración
      const now = Date.now();
      if (now > licenseData.expiryDate) {
        return { isValid: false, error: "Licencia expirada" };
      }

      // Verificar hardware
      const currentHardwareId = await HardwareService.getHardwareId();
      if (currentHardwareId !== licenseData.hardwareId) {
        return { isValid: false, error: "Hardware no coincide" };
      }

      // Actualizar última validación
      await updateDoc(doc(db, "licenses", licenseCode), {
        lastValidation: now,
        validationCount: (licenseData.validationCount || 0) + 1,
      });

      const daysRemaining = Math.floor(
        (licenseData.expiryDate - now) / (24 * 60 * 60 * 1000)
      );

      return {
        isValid: true,
        licenseData: { ...licenseData, lastValidation: now },
        daysRemaining: daysRemaining,
      };
    } catch (error) {
      console.error("❌ Error validando licencia online:", error);
      return { isValid: false, error: "Error de conexión" };
    }
  }

  /**
   * 🔒 Valida licencia offline
   */
  async validateLicenseOffline(licenseData) {
    try {
      const now = Date.now();

      // Verificar expiración
      if (now > licenseData.expiryDate) {
        return { isValid: false, error: "Licencia expirada" };
      }

      // Verificar hardware
      const isHardwareValid = await HardwareService.validateHardware(
        licenseData.hardwareId
      );
      if (!isHardwareValid) {
        return { isValid: false, error: "Hardware no coincide" };
      }

      // Verificar si necesita validación online
      const timeSinceLastValidation = now - (licenseData.lastValidation || 0);
      const needsOnlineValidation =
        timeSinceLastValidation > this.validationInterval;

      // Si necesita validación y ha pasado el período de gracia
      if (
        needsOnlineValidation &&
        timeSinceLastValidation >
          this.validationInterval + this.emergencyGracePeriod
      ) {
        return { isValid: false, error: "Requiere validación online" };
      }

      const daysRemaining = Math.floor(
        (licenseData.expiryDate - now) / (24 * 60 * 60 * 1000)
      );

      return {
        isValid: true,
        daysRemaining: daysRemaining,
        needsOnlineValidation: needsOnlineValidation,
        gracePeriodRemaining: needsOnlineValidation
          ? Math.max(
              0,
              this.validationInterval +
                this.emergencyGracePeriod -
                timeSinceLastValidation
            )
          : 0,
      };
    } catch (error) {
      console.error("❌ Error validando licencia offline:", error);
      return { isValid: false, error: "Error en validación offline" };
    }
  }

  /**
   * 💾 Guarda licencia localmente cifrada
   */
  async saveLicenseLocally(licenseData) {
    try {
      console.log("💾 Iniciando guardado de licencia local...");
      LoggingService.licenseLog(
        "DEBUG",
        "Iniciando guardado de licencia local",
        {
          licenseCode: licenseData?.licenseCode?.substring(0, 8) + "***",
          storageKey: this.localLicenseFile,
        }
      );

      const hardwareId = await HardwareService.getHardwareId();
      console.log(
        "🔧 Hardware ID para cifrado:",
        hardwareId?.substring(0, 8) + "***"
      );

      const encryptedData = CryptoService.encryptLicenseFile(
        licenseData,
        hardwareId
      );
      console.log("🔐 Datos cifrados generados:", !!encryptedData);

      localStorage.setItem(this.localLicenseFile, encryptedData);
      console.log("💾 Licencia guardada localmente en:", this.localLicenseFile);

      // Verificar que se guardó correctamente
      const saved = localStorage.getItem(this.localLicenseFile);
      console.log("✅ Verificación de guardado:", !!saved);

      LoggingService.licenseLog(
        "INFO",
        "Licencia guardada localmente exitosamente",
        {
          licenseCode: licenseData?.licenseCode?.substring(0, 8) + "***",
          encrypted: !!encryptedData,
          verified: !!saved,
        }
      );
    } catch (error) {
      console.error("❌ Error guardando licencia local:", error);
      LoggingService.licenseLog("ERROR", "Error guardando licencia local", {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * 👤 Guarda los datos de usuario localmente de forma cifrada
   */
  async saveUserDataLocally(userData) {
    try {
      const hardwareId = await HardwareService.getHardwareId();
      const encryptionKey = CryptoService.generateEncryptionKey(
        hardwareId + "_user"
      );
      const encryptedData = CryptoService.encryptData(userData, encryptionKey);

      localStorage.setItem("liqueen_user", encryptedData);
      console.log("👤 Datos de usuario guardados localmente");
      return true;
    } catch (error) {
      console.error("❌ Error guardando datos de usuario localmente:", error);
      return false;
    }
  }

  /**
   * 👤 Carga los datos de usuario desde almacenamiento local
   */
  async loadUserDataLocally() {
    try {
      const encryptedData = localStorage.getItem("liqueen_user");
      if (!encryptedData) {
        return null;
      }

      const hardwareId = await HardwareService.getHardwareId();
      const encryptionKey = CryptoService.generateEncryptionKey(
        hardwareId + "_user"
      );
      const userData = CryptoService.decryptData(encryptedData, encryptionKey);

      console.log("👤 Datos de usuario cargados localmente");
      return userData;
    } catch (error) {
      console.error("❌ Error cargando datos de usuario localmente:", error);
      return null;
    }
  }

  /**
   * 🔐 Verifica contraseña offline usando hash almacenado
   */
  async verifyPasswordOffline(password, storedPasswordHash) {
    try {
      // Generar hash de la contraseña proporcionada
      const passwordHash = CryptoService.hashPassword(password);

      // Comparar con el hash almacenado
      return passwordHash === storedPasswordHash;
    } catch (error) {
      console.error("❌ Error verificando contraseña offline:", error);
      return false;
    }
  }

  /**
   * 🔄 Resetea el dispositivo para permitir nuevo registro (SOLO ADMIN)
   * ADVERTENCIA: Esto elimina TODOS los datos locales
   */
  async resetDeviceForNewUser() {
    try {
      console.log("🔄 Reseteando dispositivo para nuevo usuario...");

      // Eliminar TODOS los datos locales
      localStorage.removeItem(this.localLicenseFile);
      localStorage.removeItem("liqueen_user");
      localStorage.removeItem("liqueen_session");
      localStorage.removeItem("liqueen_user_data");
      localStorage.removeItem("liqueen_hardware_id");
      localStorage.removeItem("generador-liquidaciones-config");

      console.log("✅ Dispositivo reseteado exitosamente");
      return {
        success: true,
        message: "Dispositivo reseteado. Puede registrar un nuevo usuario.",
      };
    } catch (error) {
      console.error("❌ Error reseteando dispositivo:", error);
      throw error;
    }
  }

  /**
   * 📂 Carga licencia local cifrada
   */
  async loadLicenseLocally() {
    try {
      console.log("🔍 Intentando cargar licencia local...");
      LoggingService.licenseLog("DEBUG", "Iniciando carga de licencia local", {
        storageKey: this.localLicenseFile,
      });

      const encryptedData = localStorage.getItem(this.localLicenseFile);
      console.log("📦 Datos cifrados encontrados:", !!encryptedData);

      if (!encryptedData) {
        console.log("❌ No hay datos de licencia en localStorage");
        LoggingService.licenseLog(
          "WARN",
          "No se encontraron datos de licencia en localStorage"
        );
        return null;
      }

      const hardwareId = await HardwareService.getHardwareId();
      console.log(
        "🔧 Hardware ID obtenido:",
        hardwareId?.substring(0, 8) + "***"
      );

      const licenseData = CryptoService.decryptLicenseFile(
        encryptedData,
        hardwareId
      );

      console.log(
        "📂 Licencia cargada localmente:",
        licenseData?.licenseCode?.substring(0, 8) + "***"
      );
      LoggingService.licenseLog("INFO", "Licencia local cargada exitosamente", {
        licenseCode: licenseData?.licenseCode?.substring(0, 8) + "***",
        hasExpiryDate: !!licenseData?.expiryDate,
      });

      return licenseData;
    } catch (error) {
      console.error("❌ Error cargando licencia local:", error);
      LoggingService.licenseLog("ERROR", "Error cargando licencia local", {
        error: error.message,
        stack: error.stack,
      });

      // Si hay error, eliminar archivo corrupto
      localStorage.removeItem(this.localLicenseFile);
      return null;
    }
  }

  /**
   * 🔄 Renovar licencia existente
   */
  async renewLicense(newLicenseCode) {
    try {
      console.log("🔄 Renovando licencia...");

      // Validar formato del nuevo código
      if (!CryptoService.validateLicenseCodeFormat(newLicenseCode)) {
        throw new Error("Formato de código de licencia inválido");
      }

      // Verificar que la nueva licencia existe y está disponible
      const newLicenseDoc = await getDoc(doc(db, "licenses", newLicenseCode));
      if (!newLicenseDoc.exists()) {
        throw new Error("Código de licencia no encontrado");
      }

      const newLicenseData = newLicenseDoc.data();
      if (newLicenseData.status !== "available") {
        throw new Error("Código de licencia ya utilizado");
      }

      // Obtener usuario actual
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Usuario no autenticado");
      }

      // Obtener licencia actual
      const currentLicense = await this.loadLicenseLocally();
      if (currentLicense) {
        // Marcar licencia anterior como renovada
        await updateDoc(doc(db, "licenses", currentLicense.licenseCode), {
          status: "renewed",
          renewedOn: Date.now(),
          renewedWith: newLicenseCode,
        });
      }

      // Activar nueva licencia
      const hardwareId = await HardwareService.getHardwareId();
      const now = Date.now();
      const expiryDate = now + this.licenseValidityPeriod;

      const activatedLicenseData = {
        status: "used",
        activatedOn: now,
        expiryDate: expiryDate,
        hardwareId: hardwareId,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        lastValidation: now,
        validationCount: 1,
        isRenewal: true,
        previousLicense: currentLicense?.licenseCode || null,
      };

      await updateDoc(
        doc(db, "licenses", newLicenseCode),
        activatedLicenseData
      );

      // Actualizar usuario
      await updateDoc(doc(db, "users", currentUser.uid), {
        licenseCode: newLicenseCode,
        renewedOn: now,
        previousLicenses: currentLicense ? [currentLicense.licenseCode] : [],
      });

      // Guardar nueva licencia local
      await this.saveLicenseLocally({
        licenseCode: newLicenseCode,
        expiryDate,
        hardwareId,
        userId: currentUser.uid,
        activatedOn: now,
        lastValidation: now,
        validationCount: 1,
      });

      console.log("✅ Licencia renovada exitosamente");
      return {
        success: true,
        newLicenseCode: newLicenseCode,
        expiryDate: expiryDate,
        daysRemaining: Math.floor((expiryDate - now) / (24 * 60 * 60 * 1000)),
      };
    } catch (error) {
      console.error("❌ Error renovando licencia:", error);
      throw error;
    }
  }

  /**
   * 🚫 Revocar licencia (solo admin)
   */
  async revokeLicense(licenseCode, reason = "Revocada por administrador") {
    try {
      await updateDoc(doc(db, "licenses", licenseCode), {
        status: "revoked",
        revokedOn: Date.now(),
        revokedReason: reason,
      });

      console.log("🚫 Licencia revocada:", licenseCode);
      return { success: true };
    } catch (error) {
      console.error("❌ Error revocando licencia:", error);
      throw error;
    }
  }

  /**
   * 📊 Obtener estado actual de licencia
   */
  async getLicenseStatus() {
    try {
      // Intentar obtener estado online primero
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const onlineValidation = await this.validateLicenseOnline(
            userData.licenseCode
          );

          if (onlineValidation.isValid) {
            return {
              isValid: true,
              isOnline: true,
              licenseCode: userData.licenseCode,
              daysRemaining: onlineValidation.daysRemaining,
              expiryDate: onlineValidation.licenseData.expiryDate,
              lastValidation: onlineValidation.licenseData.lastValidation,
            };
          }
        }
      }

      // Fallback a validación offline
      const localLicense = await this.loadLicenseLocally();
      if (localLicense) {
        const offlineValidation = await this.validateLicenseOffline(
          localLicense
        );

        return {
          isValid: offlineValidation.isValid,
          isOnline: false,
          licenseCode: localLicense.licenseCode,
          daysRemaining: offlineValidation.daysRemaining,
          expiryDate: localLicense.expiryDate,
          lastValidation: localLicense.lastValidation,
          needsOnlineValidation: offlineValidation.needsOnlineValidation,
          gracePeriodRemaining: offlineValidation.gracePeriodRemaining,
          error: offlineValidation.error,
        };
      }

      return {
        isValid: false,
        error: "No se encontró licencia válida",
      };
    } catch (error) {
      console.error("❌ Error obteniendo estado de licencia:", error);
      return {
        isValid: false,
        error: error.message,
      };
    }
  }

  /**
   * 🗑️ Limpiar datos de licencia local
   */
  clearLocalLicense() {
    localStorage.removeItem(this.localLicenseFile);
    console.log("🗑️ Datos de licencia local eliminados");
  }

  /**
   * 🔄 Validación periódica automática
   */
  async performPeriodicValidation() {
    try {
      const localLicense = await this.loadLicenseLocally();
      if (!localLicense) {
        return { needsRegistration: true };
      }

      const timeSinceLastValidation =
        Date.now() - (localLicense.lastValidation || 0);

      // Si han pasado más de 30 días, intentar validación online
      if (timeSinceLastValidation > this.validationInterval) {
        console.log("🔄 Realizando validación periódica...");

        try {
          const onlineValidation = await this.validateLicenseOnline(
            localLicense.licenseCode
          );

          if (onlineValidation.isValid) {
            // Actualizar licencia local con nueva validación
            await this.saveLicenseLocally({
              ...localLicense,
              lastValidation: Date.now(),
            });

            return {
              success: true,
              validated: true,
              daysRemaining: onlineValidation.daysRemaining,
            };
          }
        } catch (error) {
          console.warn("⚠️ Validación online falló, usando modo offline");
        }

        // Si falla online, verificar período de gracia
        const offlineValidation = await this.validateLicenseOffline(
          localLicense
        );
        return {
          success: offlineValidation.isValid,
          validated: false,
          isOffline: true,
          daysRemaining: offlineValidation.daysRemaining,
          gracePeriodRemaining: offlineValidation.gracePeriodRemaining,
          error: offlineValidation.error,
        };
      }

      // No necesita validación aún
      const offlineValidation = await this.validateLicenseOffline(localLicense);
      return {
        success: offlineValidation.isValid,
        validated: false,
        daysRemaining: offlineValidation.daysRemaining,
      };
    } catch (error) {
      console.error("❌ Error en validación periódica:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Singleton
const licenseService = new LicenseService();
export default licenseService;
