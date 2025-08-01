import {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  dialog,
  shell,
  nativeTheme,
  globalShortcut,
} from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync, writeFileSync } from "fs";
import * as machineId from "node-machine-id";
import CryptoJS from "crypto-js";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de la aplicación
const isDev = process.env.NODE_ENV === "development";
const isProduction = !isDev;

let mainWindow;

// Configuración de seguridad
app.whenReady().then(() => {
  createMainWindow();

  // Configurar menú de la aplicación
  createApplicationMenu();

  // Registrar atajos globales para herramientas de desarrollador
  registerDevToolsShortcuts();

  // Manejar activación en macOS
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Salir cuando todas las ventanas estén cerradas
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Función para crear la ventana principal
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: join(__dirname, "preload.js"),
      webSecurity: true,
    },
    icon: join(__dirname, "../build/icon.ico"),
    show: false,
    titleBarStyle: "default",
    autoHideMenuBar: false,
  });

  // Cargar la aplicación
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, "../dist/index.html"));
  }

  // Mostrar ventana cuando esté lista
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Manejar enlaces externos
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Prevenir navegación no autorizada
  mainWindow.webContents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (
      parsedUrl.origin !== "http://localhost:5173" &&
      parsedUrl.origin !== "file://"
    ) {
      event.preventDefault();
    }
  });
}

// Crear menú de la aplicación
function createApplicationMenu() {
  const template = [
    {
      label: "Archivo",
      submenu: [
        {
          label: "Nuevo",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            mainWindow.webContents.send("menu-new-file");
          },
        },
        {
          label: "Abrir",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ["openFile"],
              filters: [
                { name: "JSON Files", extensions: ["json"] },
                { name: "Excel Files", extensions: ["xlsx", "xls"] },
                { name: "All Files", extensions: ["*"] },
              ],
            });

            if (!result.canceled) {
              mainWindow.webContents.send(
                "menu-open-file",
                result.filePaths[0]
              );
            }
          },
        },
        { type: "separator" },
        {
          label: "Salir",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Editar",
      submenu: [
        { role: "undo", label: "Deshacer" },
        { role: "redo", label: "Rehacer" },
        { type: "separator" },
        { role: "cut", label: "Cortar" },
        { role: "copy", label: "Copiar" },
        { role: "paste", label: "Pegar" },
        { role: "selectall", label: "Seleccionar todo" },
      ],
    },
    {
      label: "Ver",
      submenu: [
        { role: "reload", label: "Recargar" },
        { role: "forceReload", label: "Forzar recarga" },
        { type: "separator" },
        { role: "resetZoom", label: "Zoom normal" },
        { role: "zoomIn", label: "Acercar" },
        { role: "zoomOut", label: "Alejar" },
        { type: "separator" },
        { role: "togglefullscreen", label: "Pantalla completa" },
      ],
    },
    {
      label: "Ventana",
      submenu: [
        { role: "minimize", label: "Minimizar" },
        { role: "close", label: "Cerrar" },
      ],
    },
    {
      label: "Ayuda",
      submenu: [
        {
          label: "Acerca de",
          click: async () => {
            // Obtener información de licencia
            try {
              const licenseInfo = await mainWindow.webContents
                .executeJavaScript(`
                (async () => {
                  try {
                    const LicenseService = window.LicenseService;
                    if (LicenseService) {
                      const status = await LicenseService.getLicenseStatus();
                      const userData = await LicenseService.loadUserDataLocally();
                      return {
                        licenseCode: status?.licenseCode || 'No disponible',
                        daysRemaining: status?.daysRemaining || 0,
                        isValid: status?.isValid || false,
                        userEmail: userData?.email || 'No disponible',
                        userRole: userData?.role || 'user'
                      };
                    }
                    return null;
                  } catch (error) {
                    return null;
                  }
                })()
              `);

              let detail =
                "🚀 Liqueen - Generador Profesional de Liquidaciones\n\n";
              detail += "📋 Versión: 2.1.0\n";
              detail += "🏢 Desarrollado por: Maiko Studios SPA\n\n";

              if (licenseInfo) {
                detail += "📜 INFORMACIÓN DE LICENCIA:\n";
                detail += `   • Código: ${licenseInfo.licenseCode}\n`;
                detail += `   • Estado: ${
                  licenseInfo.isValid ? "✅ Válida" : "❌ Inválida"
                }\n`;
                detail += `   • Días restantes: ${licenseInfo.daysRemaining}\n`;
                detail += `   • Usuario: ${licenseInfo.userEmail}\n`;
                detail += `   • Rol: ${
                  licenseInfo.userRole === "admin"
                    ? "👑 Administrador"
                    : "👤 Usuario"
                }\n\n`;
              }

              detail += "🛠️ Tecnologías: Electron + Vue.js 3 + Firebase\n";
              detail += "📧 Soporte: contacto@maikostudios.com";

              dialog.showMessageBox(mainWindow, {
                type: "info",
                title: "Acerca de Liqueen",
                message: "Liqueen v2.1.0",
                detail: detail,
                buttons: ["Cerrar"],
                defaultId: 0,
              });
            } catch (error) {
              // Fallback si no se puede obtener información de licencia
              dialog.showMessageBox(mainWindow, {
                type: "info",
                title: "Acerca de Liqueen",
                message: "Liqueen v2.1.0",
                detail:
                  "🚀 Liqueen - Generador Profesional de Liquidaciones\n\n📋 Versión: 2.1.0\n🏢 Desarrollado por: Maiko Studios SPA\n\n🛠️ Tecnologías: Electron + Vue.js 3 + Firebase\n📧 Soporte: contacto@maikostudios.com",
                buttons: ["Cerrar"],
                defaultId: 0,
              });
            }
          },
        },
        {
          label: "Contacto Soporte",
          click: () => {
            dialog
              .showMessageBox(mainWindow, {
                type: "info",
                title: "Contacto Soporte - Maiko Studios",
                message: "📞 Información de Contacto",
                detail:
                  "🏢 Maiko Studios SPA\n\n📧 Email: contacto@maikostudios.com\n🌐 Sitio web: https://maikostudios.com\n\n💼 Servicios:\n   • Desarrollo de software personalizado\n   • Consultoría tecnológica\n   • Soporte técnico especializado\n   • Soluciones empresariales\n\n¡Contáctanos para solicitudes especiales o desarrollos personalizados!",
                buttons: ["Cerrar", "Abrir sitio web"],
                defaultId: 0,
              })
              .then((result) => {
                if (result.response === 1) {
                  // Abrir sitio web
                  shell.openExternal("https://maikostudios.com");
                }
              });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers para comunicación con el renderer
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("show-save-dialog", async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle("show-open-dialog", async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle("show-message-box", async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});

// Handlers para autenticación y hardware
ipcMain.handle("get-hardware-id", async () => {
  try {
    const machineIdValue = machineId.machineIdSync();
    const platform = os.platform();
    const arch = os.arch();
    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model : "unknown";

    // Crear un ID único basado en hardware
    const hardwareString = `${machineIdValue}-${platform}-${arch}-${cpuModel}`;
    const hardwareId = CryptoJS.SHA256(hardwareString).toString();

    return hardwareId;
  } catch (error) {
    console.error("Error getting hardware ID:", error);
    return "fallback-" + Date.now();
  }
});

// Handlers para configuración
ipcMain.handle("get-config", async (event, key) => {
  try {
    const configPath = join(app.getPath("userData"), "config.json");
    if (existsSync(configPath)) {
      const config = JSON.parse(readFileSync(configPath, "utf8"));
      return config[key];
    }
    return null;
  } catch (error) {
    console.error("Error getting config:", error);
    return null;
  }
});

ipcMain.handle("set-config", async (event, key, value) => {
  try {
    const configPath = join(app.getPath("userData"), "config.json");
    let config = {};

    if (existsSync(configPath)) {
      config = JSON.parse(readFileSync(configPath, "utf8"));
    }

    config[key] = value;
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error("Error setting config:", error);
    return false;
  }
});

// Handlers para modo oscuro
ipcMain.handle("toggle-dark-mode", () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = "light";
  } else {
    nativeTheme.themeSource = "dark";
  }
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle("get-dark-mode", () => {
  return nativeTheme.shouldUseDarkColors;
});

// Handlers para cifrado
ipcMain.handle("encrypt-data", async (event, data, key) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      key
    ).toString();
    return encrypted;
  } catch (error) {
    console.error("Error encrypting data:", error);
    return null;
  }
});

ipcMain.handle("decrypt-data", async (event, encryptedData, key) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null;
  }
});

// Handlers para base de datos local (usando archivos JSON)
ipcMain.handle("db-get", async (event, key) => {
  try {
    const dbPath = join(app.getPath("userData"), "local-db.json");
    if (existsSync(dbPath)) {
      const db = JSON.parse(readFileSync(dbPath, "utf8"));
      return db[key];
    }
    return null;
  } catch (error) {
    console.error("Error getting from local DB:", error);
    return null;
  }
});

ipcMain.handle("db-set", async (event, key, value) => {
  try {
    const dbPath = join(app.getPath("userData"), "local-db.json");
    let db = {};

    if (existsSync(dbPath)) {
      db = JSON.parse(readFileSync(dbPath, "utf8"));
    }

    db[key] = value;
    writeFileSync(dbPath, JSON.stringify(db, null, 2));
    return true;
  } catch (error) {
    console.error("Error setting to local DB:", error);
    return false;
  }
});

ipcMain.handle("db-delete", async (event, key) => {
  try {
    const dbPath = join(app.getPath("userData"), "local-db.json");
    if (existsSync(dbPath)) {
      const db = JSON.parse(readFileSync(dbPath, "utf8"));
      delete db[key];
      writeFileSync(dbPath, JSON.stringify(db, null, 2));
    }
    return true;
  } catch (error) {
    console.error("Error deleting from local DB:", error);
    return false;
  }
});

ipcMain.handle("db-clear", async () => {
  try {
    const dbPath = join(app.getPath("userData"), "local-db.json");
    writeFileSync(dbPath, "{}");
    return true;
  } catch (error) {
    console.error("Error clearing local DB:", error);
    return false;
  }
});

// Handlers para logging
ipcMain.handle("log", async (event, level, message, data) => {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, level, message, data };

  console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, data || "");

  return true;
});

// Handlers para utilidades del sistema
ipcMain.handle("open-external", async (event, url) => {
  try {
    await shell.openExternal(url);
    return true;
  } catch (error) {
    console.error("Error opening external URL:", error);
    return false;
  }
});

ipcMain.handle("get-path", async (event, name) => {
  try {
    return app.getPath(name);
  } catch (error) {
    console.error("Error getting path:", error);
    return null;
  }
});

// Handler para guardar PDF
ipcMain.handle("save-pdf", async (event, options) => {
  try {
    const { html, folderPath, fileName, pdfOptions } = options;

    console.log("📄 [ELECTRON] Iniciando generación de PDF:", {
      folderPath,
      fileName,
      htmlLength: html?.length || 0,
    });

    // Crear una ventana invisible para generar el PDF
    const pdfWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    // Cargar el HTML en la ventana usando setContent
    console.log("🌐 [ELECTRON] Cargando HTML en ventana PDF");
    console.log("📏 [ELECTRON] Tamaño del HTML:", html.length, "caracteres");

    // Usar loadURL con about:blank y luego setContent
    await pdfWindow.loadURL("about:blank");
    await pdfWindow.webContents.executeJavaScript(`
      document.documentElement.innerHTML = ${JSON.stringify(html)};
    `);

    // Configuración por defecto para PDF
    const defaultOptions = {
      format: "A4",
      printBackground: true,
      margin: {
        top: "1cm",
        bottom: "1cm",
        left: "1cm",
        right: "1cm",
      },
    };

    const finalOptions = { ...defaultOptions, ...pdfOptions };

    // Generar PDF
    const pdfBuffer = await pdfWindow.webContents.printToPDF(finalOptions);

    // Determinar ruta de guardado
    let savePath;
    if (folderPath && fileName) {
      console.log("📁 [ELECTRON] Creando carpeta si no existe:", folderPath);
      // Asegurar que la carpeta existe
      if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true });
        console.log("✅ [ELECTRON] Carpeta creada:", folderPath);
      } else {
        console.log("✅ [ELECTRON] Carpeta ya existe:", folderPath);
      }
      savePath = join(folderPath, fileName);
      console.log("📄 [ELECTRON] Ruta completa del archivo:", savePath);
    } else {
      // Mostrar diálogo de guardado
      const result = await dialog.showSaveDialog(mainWindow, {
        title: "Guardar Liquidación",
        defaultPath: fileName || "liquidacion.pdf",
        filters: [{ name: "PDF Files", extensions: ["pdf"] }],
      });

      if (result.canceled) {
        pdfWindow.close();
        return {
          success: false,
          error: "Guardado cancelado por el usuario",
        };
      }

      savePath = result.filePath;
    }

    // Guardar el archivo
    console.log("💾 [ELECTRON] Guardando archivo PDF:", savePath);
    writeFileSync(savePath, pdfBuffer);
    console.log("✅ [ELECTRON] Archivo PDF guardado exitosamente");

    // Cerrar ventana temporal
    pdfWindow.close();

    const result = {
      success: true,
      path: savePath,
      fileName: fileName,
      message: `PDF guardado exitosamente en: ${savePath}`,
    };

    console.log("🎉 [ELECTRON] Resultado final:", result);
    return result;
  } catch (error) {
    console.error("Error saving PDF:", error);
    return {
      success: false,
      error: error.message,
    };
  }
});

// Función para registrar atajos de herramientas de desarrollador
function registerDevToolsShortcuts() {
  try {
    // Registrar Ctrl+Shift+I para abrir/cerrar DevTools
    globalShortcut.register("CommandOrControl+Shift+I", () => {
      if (mainWindow && mainWindow.webContents) {
        if (mainWindow.webContents.isDevToolsOpened()) {
          mainWindow.webContents.closeDevTools();
        } else {
          mainWindow.webContents.openDevTools();
        }
      }
    });

    // Registrar F12 como alternativa
    globalShortcut.register("F12", () => {
      if (mainWindow && mainWindow.webContents) {
        if (mainWindow.webContents.isDevToolsOpened()) {
          mainWindow.webContents.closeDevTools();
        } else {
          mainWindow.webContents.openDevTools();
        }
      }
    });

    console.log("✅ Atajos de herramientas de desarrollador registrados");
  } catch (error) {
    console.error("❌ Error registrando atajos de desarrollador:", error);
  }
}

// Limpiar atajos globales al salir
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

// Manejar errores no capturados
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
