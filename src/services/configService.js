export class ConfigService {
  /**
   * Obtener configuración desde Electron o localStorage
   * @param {string} key - Clave de configuración
   * @returns {Promise<any>} - Valor de configuración
   */
  static async getConfig(key) {
    try {
      if (window.electronAPI) {
        const value = await window.electronAPI.getConfig(key);
        console.log(`🔍 ConfigService.getConfig(${key}) - Electron:`, value);
        return value;
      } else {
        // Fallback para desarrollo web
        const config = JSON.parse(localStorage.getItem("app-config") || "{}");
        const value = config[key];
        console.log(
          `🔍 ConfigService.getConfig(${key}) - localStorage:`,
          value
        );
        return value;
      }
    } catch (error) {
      console.error("Error getting config:", error);
      return null;
    }
  }

  /**
   * Guardar configuración en Electron o localStorage
   * @param {string} key - Clave de configuración
   * @param {any} value - Valor a guardar
   * @returns {Promise<boolean>} - Éxito de la operación
   */
  static async setConfig(key, value) {
    try {
      if (window.electronAPI) {
        return await window.electronAPI.setConfig(key, value);
      } else {
        // Fallback para desarrollo web
        const config = JSON.parse(localStorage.getItem("app-config") || "{}");
        config[key] = value;
        localStorage.setItem("app-config", JSON.stringify(config));
        return true;
      }
    } catch (error) {
      console.error("Error setting config:", error);
      return false;
    }
  }

  /**
   * Obtener ruta por defecto para guardar PDFs
   * @returns {Promise<string>} - Ruta por defecto
   */
  static async getDefaultPdfPath() {
    try {
      let defaultPath = await this.getConfig("defaultPdfPath");
      console.log(
        "🔍 ConfigService.getDefaultPdfPath - Ruta obtenida:",
        defaultPath
      );

      if (!defaultPath) {
        if (window.electronAPI) {
          // Obtener carpeta de documentos del usuario
          const documentsPath = await window.electronAPI.getPath("documents");
          defaultPath = `${documentsPath}/Liquidaciones`;
          console.log(
            "🔍 ConfigService.getDefaultPdfPath - Ruta generada automáticamente:",
            defaultPath
          );
        } else {
          // Fallback para desarrollo web
          defaultPath = "Descargas/Liquidaciones";
        }

        // Guardar la ruta por defecto
        await this.setConfig("defaultPdfPath", defaultPath);
      }

      console.log(
        "🔍 ConfigService.getDefaultPdfPath - Ruta final:",
        defaultPath
      );
      return defaultPath;
    } catch (error) {
      console.error("Error getting default PDF path:", error);
      return "Liquidaciones";
    }
  }

  /**
   * Establecer nueva ruta por defecto para PDFs
   * @param {string} path - Nueva ruta
   * @returns {Promise<boolean>} - Éxito de la operación
   */
  static async setDefaultPdfPath(path) {
    return await this.setConfig("defaultPdfPath", path);
  }

  /**
   * Seleccionar carpeta usando diálogo del sistema
   * @returns {Promise<string|null>} - Ruta seleccionada o null si se canceló
   */
  static async selectFolder() {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.showOpenDialog({
          properties: ["openDirectory"],
          title: "Seleccionar carpeta para guardar liquidaciones",
        });

        if (!result.canceled && result.filePaths.length > 0) {
          return result.filePaths[0];
        }
      } else {
        // En desarrollo web, mostrar prompt
        const path = prompt(
          "Ingrese la ruta donde desea guardar las liquidaciones:"
        );
        return path;
      }

      return null;
    } catch (error) {
      console.error("Error selecting folder:", error);
      return null;
    }
  }

  /**
   * Generar nombre de archivo para liquidación
   * @param {Object} liquidacion - Datos de la liquidación
   * @returns {string} - Nombre del archivo
   */
  static generateFileName(liquidacion) {
    try {
      const { trabajador, periodo } = liquidacion;

      // Obtener mes y año
      const mes = String(periodo.mes).padStart(2, "0");
      const año = periodo.año;

      // Limpiar RUT (solo números y dígito verificador)
      const rutLimpio = trabajador.rut
        .replace(/[^\dkK-]/g, "")
        .replace(/-/g, "");

      // Limpiar nombre (solo letras, números y espacios, luego reemplazar espacios por guiones)
      let nombreLimpio = trabajador.nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remover acentos
        .replace(/[^\w\s]/g, "") // Solo letras, números y espacios
        .replace(/\s+/g, "-") // Reemplazar espacios por guiones
        .toLowerCase();

      // Limitar longitud del nombre para evitar nombres muy largos
      if (nombreLimpio.length > 20) {
        nombreLimpio = nombreLimpio.substring(0, 20);
      }

      // Construir nombre del archivo
      const fileName = `liq-${mes}-${año}-${rutLimpio}-${nombreLimpio}.pdf`;

      // Validar longitud total (máximo 100 caracteres para compatibilidad)
      if (fileName.length > 100) {
        // Recortar nombre si es muy largo
        const maxNombreLength =
          100 - `liq-${mes}-${año}-${rutLimpio}-.pdf`.length;
        const nombreRecortado = nombreLimpio.substring(
          0,
          Math.max(5, maxNombreLength)
        );
        return `liq-${mes}-${año}-${rutLimpio}-${nombreRecortado}.pdf`;
      }

      return fileName;
    } catch (error) {
      console.error("Error generating file name:", error);
      // Nombre de fallback
      const timestamp = Date.now();
      return `liquidacion-${timestamp}.pdf`;
    }
  }

  /**
   * Validar nombre de archivo
   * @param {string} fileName - Nombre del archivo
   * @returns {Object} - Resultado de validación
   */
  static validateFileName(fileName) {
    const maxLength = 100;
    const invalidChars = /[<>:"/\\|?*]/g;

    const issues = [];

    if (fileName.length > maxLength) {
      issues.push(
        `El nombre es muy largo (${fileName.length} caracteres, máximo ${maxLength})`
      );
    }

    if (invalidChars.test(fileName)) {
      issues.push(
        'El nombre contiene caracteres no válidos: < > : " / \\ | ? *'
      );
    }

    if (fileName.trim() === "") {
      issues.push("El nombre no puede estar vacío");
    }

    return {
      isValid: issues.length === 0,
      issues,
      fileName: fileName.replace(invalidChars, "-"), // Versión corregida
    };
  }

  /**
   * Obtener configuración completa de la aplicación
   * @returns {Promise<Object>} - Configuración completa
   */
  static async getAllConfig() {
    try {
      const config = {
        defaultPdfPath: await this.getDefaultPdfPath(),
        autoSave: (await this.getConfig("autoSave")) ?? true,
        showNotifications: (await this.getConfig("showNotifications")) ?? true,
        darkMode: (await this.getConfig("darkMode")) ?? false,
        language: (await this.getConfig("language")) ?? "es",
        maxLiquidaciones: (await this.getConfig("maxLiquidaciones")) ?? 10,
        autoOpenPdf: (await this.getConfig("autoOpenPdf")) ?? true,
      };

      return config;
    } catch (error) {
      console.error("Error getting all config:", error);
      return {};
    }
  }

  /**
   * Guardar configuración completa
   * @param {Object} config - Configuración a guardar
   * @returns {Promise<boolean>} - Éxito de la operación
   */
  static async saveAllConfig(config) {
    try {
      const promises = Object.entries(config).map(([key, value]) =>
        this.setConfig(key, value)
      );

      const results = await Promise.all(promises);
      return results.every((result) => result === true);
    } catch (error) {
      console.error("Error saving all config:", error);
      return false;
    }
  }

  /**
   * Resetear configuración a valores por defecto
   * @returns {Promise<boolean>} - Éxito de la operación
   */
  static async resetConfig() {
    try {
      const defaultConfig = {
        autoSave: true,
        showNotifications: true,
        darkMode: false,
        language: "es",
        maxLiquidaciones: 10,
        autoOpenPdf: true,
      };

      // Mantener la ruta de PDFs si existe
      const currentPdfPath = await this.getConfig("defaultPdfPath");
      if (currentPdfPath) {
        defaultConfig.defaultPdfPath = currentPdfPath;
      }

      return await this.saveAllConfig(defaultConfig);
    } catch (error) {
      console.error("Error resetting config:", error);
      return false;
    }
  }

  /**
   * Crear carpeta si no existe (solo en Electron)
   * @param {string} path - Ruta de la carpeta
   * @returns {Promise<boolean>} - Éxito de la operación
   */
  static async ensureDirectoryExists(path) {
    try {
      if (window.electronAPI) {
        // En Electron, podríamos agregar un handler para crear directorios
        // Por ahora, asumimos que el directorio existe o se creará al guardar
        return true;
      }
      return true;
    } catch (error) {
      console.error("Error ensuring directory exists:", error);
      return false;
    }
  }

  /**
   * Obtener información del sistema de archivos
   * @returns {Promise<Object>} - Información del sistema
   */
  static async getSystemInfo() {
    try {
      if (window.electronAPI) {
        const userDataPath = await window.electronAPI.getPath("userData");
        const documentsPath = await window.electronAPI.getPath("documents");
        const desktopPath = await window.electronAPI.getPath("desktop");

        return {
          userDataPath,
          documentsPath,
          desktopPath,
          isElectron: true,
        };
      } else {
        return {
          userDataPath: "userData",
          documentsPath: "Documentos",
          desktopPath: "Escritorio",
          isElectron: false,
        };
      }
    } catch (error) {
      console.error("Error getting system info:", error);
      return {
        isElectron: false,
      };
    }
  }
}
