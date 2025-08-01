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

// Configurar persistencia
setPersistence(auth, browserLocalPersistence);

// Clase simplificada para manejar autenticación (solo Firebase Auth)
export class SimpleAuthService {
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
        console.log("Usuario autenticado:", user.email);
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

  // Obtener usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Verificar si hay usuario autenticado
  isAuthenticated() {
    return !!this.currentUser;
  }
}

// Instancia singleton del servicio de autenticación simplificado
export const simpleAuthService = new SimpleAuthService();
