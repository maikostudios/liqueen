#!/usr/bin/env node

// Test simple de conectividad con Firestore
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

// Configuración de Firebase
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
const db = getFirestore(app);

async function testFirestoreConnection() {
  console.log("🔥 Probando conexión con Firestore...");
  
  try {
    // Test 1: Escribir un documento simple
    console.log("📝 Test 1: Escribiendo documento de prueba...");
    const testRef = doc(db, "test", "connection");
    await setDoc(testRef, {
      message: "Conexión exitosa",
      timestamp: Date.now(),
      test: true
    });
    console.log("✅ Escritura exitosa");

    // Test 2: Leer el documento
    console.log("📖 Test 2: Leyendo documento de prueba...");
    const testDoc = await getDoc(testRef);
    
    if (testDoc.exists()) {
      console.log("✅ Lectura exitosa:", testDoc.data());
    } else {
      console.log("❌ Documento no encontrado");
    }

    // Test 3: Crear estructura básica
    console.log("🏗️ Test 3: Creando estructura básica...");
    
    // Crear configuración básica
    await setDoc(doc(db, "app-config", "test"), {
      version: "2.1.0",
      created: Date.now(),
      status: "testing"
    });
    
    console.log("✅ Estructura básica creada");
    
    console.log("🎉 ¡Todos los tests pasaron! Firestore está funcionando correctamente.");
    return true;
    
  } catch (error) {
    console.error("❌ Error en test de Firestore:");
    console.error("Código:", error.code);
    console.error("Mensaje:", error.message);
    
    if (error.code === 'permission-denied') {
      console.log("\n🔧 SOLUCIÓN:");
      console.log("1. Ve a Firebase Console → Firestore → Reglas");
      console.log("2. Cambia las reglas a:");
      console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
      `);
      console.log("3. Haz clic en 'Publicar' y espera 2-3 minutos");
      console.log("4. Ejecuta este test nuevamente");
    }
    
    return false;
  }
}

// Ejecutar test
testFirestoreConnection()
  .then((success) => {
    if (success) {
      console.log("\n🚀 Firestore está listo para usar!");
      console.log("Ahora puedes ejecutar: node setup-firestore.js");
    } else {
      console.log("\n⚠️ Firestore no está listo. Revisa las reglas de seguridad.");
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("💥 Error inesperado:", error);
    process.exit(1);
  });
