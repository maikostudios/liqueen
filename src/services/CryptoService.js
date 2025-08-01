/**
 * 🔐 CryptoService - Cifrado y descifrado de datos
 * Maneja el cifrado AES-256 para proteger datos de licencia locales
 */

import CryptoJS from "crypto-js";

class CryptoService {
  constructor() {
    // Clave base para cifrado (en producción debería ser más compleja)
    this.baseKey = "LIQUEEN_2025_SECURE_LICENSE_KEY";
    this.algorithm = "AES";
  }

  /**
   * 🔑 Genera clave de cifrado única por dispositivo
   */
  generateDeviceKey(hardwareId) {
    // Combinar clave base con hardware ID para mayor seguridad
    const combinedKey = this.baseKey + hardwareId;
    return CryptoJS.SHA256(combinedKey).toString();
  }

  /**
   * 🔑 Genera clave de cifrado para datos generales
   */
  generateEncryptionKey(seed) {
    // Generar clave basada en semilla proporcionada
    const combinedKey = this.baseKey + seed;
    return CryptoJS.SHA256(combinedKey).toString();
  }

  /**
   * 🔐 Genera hash seguro de contraseña
   */
  hashPassword(password) {
    try {
      // Usar SHA-256 con salt para mayor seguridad
      const salt = "LIQUEEN_PASSWORD_SALT_2025";
      const saltedPassword = password + salt;
      return CryptoJS.SHA256(saltedPassword).toString();
    } catch (error) {
      console.error("❌ Error generando hash de contraseña:", error);
      throw error;
    }
  }

  /**
   * 🔒 Cifra datos con AES-256
   */
  encrypt(data, hardwareId) {
    try {
      const key = this.generateDeviceKey(hardwareId);
      const dataString = typeof data === "string" ? data : JSON.stringify(data);

      // Generar IV aleatorio para mayor seguridad
      const iv = CryptoJS.lib.WordArray.random(16);

      // Cifrar datos
      const encrypted = CryptoJS.AES.encrypt(dataString, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Combinar IV + datos cifrados
      const result = {
        iv: iv.toString(),
        data: encrypted.toString(),
        timestamp: Date.now(),
      };

      return JSON.stringify(result);
    } catch (error) {
      console.error("❌ Error cifrando datos:", error);
      throw new Error("Error en cifrado de datos");
    }
  }

  /**
   * 🔓 Descifra datos con AES-256
   */
  decrypt(encryptedData, hardwareId) {
    try {
      const key = this.generateDeviceKey(hardwareId);
      const encryptedObj = JSON.parse(encryptedData);

      // Extraer IV y datos
      const iv = CryptoJS.enc.Hex.parse(encryptedObj.iv);

      // Descifrar datos
      const decrypted = CryptoJS.AES.decrypt(encryptedObj.data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

      if (!decryptedString) {
        throw new Error("Datos corruptos o clave incorrecta");
      }

      // Intentar parsear como JSON, si falla devolver string
      try {
        return JSON.parse(decryptedString);
      } catch {
        return decryptedString;
      }
    } catch (error) {
      console.error("❌ Error descifrando datos:", error);
      throw new Error("Error en descifrado de datos");
    }
  }

  /**
   * 🔐 Cifra archivo de licencia local
   */
  encryptLicenseFile(licenseData, hardwareId) {
    const licenseObject = {
      licenseCode: licenseData.licenseCode,
      expiryDate: licenseData.expiryDate,
      hardwareId: licenseData.hardwareId,
      userId: licenseData.userId,
      activatedOn: licenseData.activatedOn,
      lastValidation: licenseData.lastValidation || Date.now(),
      validationCount: licenseData.validationCount || 0,
      version: "2.1.0",
    };

    return this.encrypt(licenseObject, hardwareId);
  }

  /**
   * 🔓 Descifra archivo de licencia local
   */
  decryptLicenseFile(encryptedLicenseData, hardwareId) {
    try {
      const licenseData = this.decrypt(encryptedLicenseData, hardwareId);

      // Validar estructura de datos
      if (
        !licenseData.licenseCode ||
        !licenseData.expiryDate ||
        !licenseData.hardwareId
      ) {
        throw new Error("Estructura de licencia inválida");
      }

      return licenseData;
    } catch (error) {
      console.error("❌ Error descifrando archivo de licencia:", error);
      throw new Error("Archivo de licencia corrupto o inválido");
    }
  }

  /**
   * 🔑 Genera hash de validación para integridad
   */
  generateValidationHash(data) {
    const dataString = typeof data === "string" ? data : JSON.stringify(data);
    return CryptoJS.SHA256(dataString + this.baseKey).toString();
  }

  /**
   * ✅ Valida integridad de datos
   */
  validateDataIntegrity(data, expectedHash) {
    const currentHash = this.generateValidationHash(data);
    return currentHash === expectedHash;
  }

  /**
   * 🎲 Genera código de licencia único
   * Formato: LIQ-YYYY-XXXX-YYYY-ZZZZ
   * ZZZZ son caracteres aleatorios de "MAIKO", "STUDIOS", "SAEZ", "CONTRERAS"
   */
  generateLicenseCode() {
    const year = new Date().getFullYear();
    const randomPart1 = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();
    const randomPart2 = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();

    // Palabras especiales para el sufijo
    const specialWords = ["MAIKO", "STUDIOS", "SAEZ", "CONTRERAS"];
    const selectedWord =
      specialWords[Math.floor(Math.random() * specialWords.length)];

    // Tomar 4 caracteres aleatorios de la palabra seleccionada
    let suffix = "";
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * selectedWord.length);
      suffix += selectedWord[randomIndex];
    }

    return `LIQ-${year}-${randomPart1}-${randomPart2}-${suffix}`;
  }

  /**
   * 🔍 Valida formato de código de licencia
   * Formato: LIQ-YYYY-XXXX-YYYY-ZZZZ
   */
  validateLicenseCodeFormat(licenseCode) {
    const pattern = /^LIQ-\d{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z]{4}$/;
    return pattern.test(licenseCode);
  }

  /**
   * 🛡️ Genera token de sesión temporal
   */
  generateSessionToken(userId, hardwareId) {
    const sessionData = {
      userId,
      hardwareId,
      timestamp: Date.now(),
      random: Math.random().toString(36),
    };

    return this.encrypt(sessionData, hardwareId);
  }

  /**
   * 🔍 Valida token de sesión
   */
  validateSessionToken(token, hardwareId, maxAge = 24 * 60 * 60 * 1000) {
    // 24 horas por defecto
    try {
      const sessionData = this.decrypt(token, hardwareId);
      const age = Date.now() - sessionData.timestamp;

      return {
        isValid: age <= maxAge,
        userId: sessionData.userId,
        age: age,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
      };
    }
  }

  /**
   * 🔒 Cifra datos usando clave generada
   */
  encryptData(data, encryptionKey) {
    try {
      const dataString = typeof data === "string" ? data : JSON.stringify(data);

      // Generar IV aleatorio
      const iv = CryptoJS.lib.WordArray.random(16);

      // Cifrar datos
      const encrypted = CryptoJS.AES.encrypt(dataString, encryptionKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Combinar IV + datos cifrados
      const result = {
        iv: iv.toString(),
        data: encrypted.toString(),
        timestamp: Date.now(),
      };

      return JSON.stringify(result);
    } catch (error) {
      console.error("❌ Error cifrando datos:", error);
      throw error;
    }
  }

  /**
   * 🔓 Descifra datos usando clave generada
   */
  decryptData(encryptedData, encryptionKey) {
    try {
      const parsed = JSON.parse(encryptedData);
      const iv = CryptoJS.enc.Hex.parse(parsed.iv);

      // Descifrar datos
      const decrypted = CryptoJS.AES.decrypt(parsed.data, encryptionKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

      if (!decryptedString) {
        throw new Error("Error descifrando datos - clave incorrecta");
      }

      // Intentar parsear como JSON, si falla devolver string
      try {
        return JSON.parse(decryptedString);
      } catch {
        return decryptedString;
      }
    } catch (error) {
      console.error("❌ Error descifrando datos:", error);
      throw error;
    }
  }
}

// Singleton
const cryptoService = new CryptoService();
export default cryptoService;
