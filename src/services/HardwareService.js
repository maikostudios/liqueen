/**
 * 🔧 HardwareService - Identificación única de hardware
 * Genera un hash único basado en características del hardware
 * para validación de licencias por dispositivo
 */

import CryptoJS from "crypto-js";
import ElectronService from "./ElectronService.js";

class HardwareService {
  constructor() {
    this.hardwareId = null;
    this.isElectron = typeof window !== "undefined" && window.electronAPI;
  }

  /**
   * 🆔 Genera ID único de hardware
   * Combina múltiples características del sistema
   */
  async generateHardwareId() {
    try {
      let hardwareData = [];

      // 1. Machine ID (más confiable)
      try {
        const machineIdValue = await ElectronService.getMachineId();
        hardwareData.push(machineIdValue);
      } catch (error) {
        console.warn("⚠️ No se pudo obtener machine ID:", error.message);
      }

      // 2. Información del sistema
      try {
        const systemInfo = await ElectronService.getSystemInfo();
        hardwareData.push(systemInfo.platform);
        hardwareData.push(systemInfo.userAgent);
        hardwareData.push(systemInfo.hardwareConcurrency || "unknown-cores");
        hardwareData.push(systemInfo.screenResolution);
        hardwareData.push(systemInfo.timezone);
      } catch (error) {
        console.warn("⚠️ No se pudo obtener info del sistema:", error.message);
      }

      // 3. Información del navegador como fallback
      if (typeof navigator !== "undefined") {
        hardwareData.push(navigator.userAgent);
        hardwareData.push(navigator.platform);
        hardwareData.push(navigator.hardwareConcurrency || "unknown-cores");
        hardwareData.push(screen.width + "x" + screen.height);
      }

      // 4. Timestamp de instalación (para mayor unicidad)
      const installationId = localStorage.getItem("liqueen_installation_id");
      if (!installationId) {
        const newInstallationId = Date.now().toString();
        localStorage.setItem("liqueen_installation_id", newInstallationId);
        hardwareData.push(newInstallationId);
      } else {
        hardwareData.push(installationId);
      }

      // Generar hash único
      const combinedData = hardwareData.join("|");
      this.hardwareId = CryptoJS.SHA256(combinedData).toString();

      console.log(
        "🔧 Hardware ID generado:",
        this.hardwareId.substring(0, 16) + "..."
      );
      return this.hardwareId;
    } catch (error) {
      console.error("❌ Error generando Hardware ID:", error);
      // Fallback: generar ID basado en timestamp y random
      const fallbackData = Date.now() + Math.random().toString();
      this.hardwareId = CryptoJS.SHA256(fallbackData).toString();
      return this.hardwareId;
    }
  }

  /**
   * 🔍 Obtiene el Hardware ID actual
   */
  async getHardwareId() {
    if (!this.hardwareId) {
      await this.generateHardwareId();
    }
    return this.hardwareId;
  }

  /**
   * ✅ Valida si el hardware actual coincide con el registrado
   */
  async validateHardware(registeredHardwareId) {
    const currentHardwareId = await this.getHardwareId();
    const isValid = currentHardwareId === registeredHardwareId;

    console.log("🔍 Validación de hardware:", {
      current: currentHardwareId.substring(0, 16) + "...",
      registered: registeredHardwareId.substring(0, 16) + "...",
      isValid,
    });

    return isValid;
  }

  /**
   * 📊 Obtiene información del sistema para diagnóstico
   */
  async getSystemInfo() {
    const info = {
      hardwareId: await this.getHardwareId(),
      timestamp: new Date().toISOString(),
      userAgent: navigator?.userAgent || "unknown",
      platform: navigator?.platform || "unknown",
      language: navigator?.language || "unknown",
      screenResolution:
        typeof screen !== "undefined"
          ? `${screen.width}x${screen.height}`
          : "unknown",
    };

    if (this.isElectron && window.electronAPI.getSystemInfo) {
      try {
        const electronInfo = await window.electronAPI.getSystemInfo();
        info.electronInfo = electronInfo;
      } catch (error) {
        console.warn("⚠️ No se pudo obtener info de Electron:", error.message);
      }
    }

    return info;
  }

  /**
   * 🔄 Regenera Hardware ID (solo para casos especiales)
   */
  async regenerateHardwareId() {
    this.hardwareId = null;
    localStorage.removeItem("liqueen_installation_id");
    return await this.generateHardwareId();
  }
}

// Singleton
const hardwareService = new HardwareService();
export default hardwareService;
