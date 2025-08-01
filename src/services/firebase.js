import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  enableNetwork,
  disableNetwork,
  connectFirestoreEmulator,
} from "firebase/firestore";

// Configuración de Firebase - Proyecto Liqueen
const firebaseConfig = {
  apiKey: "AIzaSyBqgFkuQzU8TLgBbXCKcKenwQKDke4VYeA",
  authDomain: "liqueen.firebaseapp.com",
  projectId: "liqueen",
  storageBucket: "liqueen.firebasestorage.app",
  messagingSenderId: "369721543995",
  appId: "1:369721543995:web:faa51f6bfaab56cdbf3b1e",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configurar persistencia
setPersistence(auth, browserLocalPersistence);

// Configuración especial para Electron
if (
  typeof window !== "undefined" &&
  window.process &&
  window.process.type === "renderer"
) {
  console.log("Configurando Firebase para Electron...");
}

// Estado de conexión
let isOnline = navigator.onLine;
let offlineMode = false;

// Monitorear estado de conexión
window.addEventListener("online", () => {
  isOnline = true;
  if (!offlineMode) {
    enableNetwork(db);
  }
});

window.addEventListener("offline", () => {
  isOnline = false;
  disableNetwork(db);
});

// Clase para manejar autenticación
export class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
    this.setupAuthStateListener();
  }

  // Configurar listener del estado de autenticación
  setupAuthStateListener() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.authStateListeners.forEach((callback) => callback(user));

      if (user) {
        this.syncUserData(user);
      }
    });
  }

  // Agregar listener para cambios de estado
  onAuthStateChange(callback) {
    this.authStateListeners.push(callback);
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  // Registrar nuevo usuario
  async register(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Actualizar perfil
      await updateProfile(user, {
        displayName: userData.displayName || userData.nombre,
      });

      // Crear documento de usuario en Firestore
      await this.createUserDocument(user, userData);

      return {
        success: true,
        user: user,
        message: "Usuario registrado exitosamente",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  // Iniciar sesión
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Intentar actualizar última conexión (no crítico si falla)
      try {
        await this.updateLastLogin(user.uid);
      } catch (firestoreError) {
        console.warn(
          "No se pudo actualizar última conexión en Firestore:",
          firestoreError
        );
        // Continuar sin error - la autenticación fue exitosa
      }

      return {
        success: true,
        user: user,
        message: "Sesión iniciada exitosamente",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      await signOut(auth);
      return {
        success: true,
        message: "Sesión cerrada exitosamente",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  // Recuperar contraseña
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: "Correo de recuperación enviado",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  // Crear documento de usuario en Firestore
  async createUserDocument(user, userData) {
    const userRef = doc(db, "users", user.uid);

    const userDoc = {
      uid: user.uid,
      email: user.email,
      displayName: userData.displayName || userData.nombre,
      empresa: userData.empresa || "",
      telefono: userData.telefono || "",
      plan: "trial",
      licenseStatus: "inactive",
      licenseExpiry: null,
      hardwareId: await this.getHardwareId(),
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      settings: {
        darkMode: false,
        notifications: true,
        autoSave: true,
      },
    };

    await setDoc(userRef, userDoc);
    return userDoc;
  }

  // Sincronizar datos del usuario
  async syncUserData(user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Crear documento si no existe
        await this.createUserDocument(user, {
          displayName: user.displayName || user.email.split("@")[0],
        });
      }
    } catch (error) {
      console.warn(
        "No se pudo sincronizar datos del usuario con Firestore:",
        error
      );
      // No lanzar error - permitir que la aplicación continúe funcionando
      // Los datos se sincronizarán cuando la conexión se restablezca
    }
  }

  // Actualizar última conexión
  async updateLastLogin(uid) {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating last login:", error);
    }
  }

  // Obtener datos del usuario
  async getUserData(uid) {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }

  // Actualizar datos del usuario
  async updateUserData(uid, data) {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating user data:", error);
      return { success: false, error: error.message };
    }
  }

  // Obtener ID de hardware (placeholder - se implementará con node-machine-id)
  async getHardwareId() {
    try {
      // En el contexto de Electron, esto se manejará desde el proceso principal
      if (window.electronAPI) {
        return await window.electronAPI.getHardwareId();
      }
      // Fallback para desarrollo web
      return "web-" + Date.now();
    } catch (error) {
      console.error("Error getting hardware ID:", error);
      return "unknown-" + Date.now();
    }
  }

  // Verificar estado de conexión
  isOnline() {
    return isOnline;
  }

  // Habilitar modo offline
  enableOfflineMode() {
    offlineMode = true;
    disableNetwork(db);
  }

  // Deshabilitar modo offline
  disableOfflineMode() {
    offlineMode = false;
    if (isOnline) {
      enableNetwork(db);
    }
  }

  // Obtener mensajes de error en español
  getErrorMessage(errorCode) {
    const errorMessages = {
      "auth/user-not-found": "Usuario no encontrado",
      "auth/wrong-password": "Contraseña incorrecta",
      "auth/email-already-in-use": "El correo electrónico ya está en uso",
      "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
      "auth/invalid-email": "Correo electrónico inválido",
      "auth/user-disabled": "Usuario deshabilitado",
      "auth/too-many-requests": "Demasiados intentos. Intenta más tarde",
      "auth/network-request-failed": "Error de conexión. Verifica tu internet",
      "auth/invalid-credential": "Credenciales inválidas",
    };

    return errorMessages[errorCode] || "Error desconocido. Intenta nuevamente";
  }
}

// Instancia singleton del servicio de autenticación
export const authService = new AuthService();
