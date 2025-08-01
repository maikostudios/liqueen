#!/usr/bin/env node

// Script para configurar Firestore con la estructura de licencias
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
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

async function setupFirestore() {
  console.log("🚀 Iniciando configuración de Firestore...");

  try {
    // 1. Configurar aplicación
    console.log("📋 Configurando aplicación...");
    await setDoc(doc(db, "app-config", "version"), {
      currentVersion: "2.1.0",
      latestVersion: "2.1.0",
      updateUrl: "https://github.com/tu-usuario/liqueen/releases/latest",
      updateAvailable: false,
      releaseNotes: "Sistema de licencias implementado",
      lastChecked: Date.now(),
      minimumVersion: "2.0.0",
      forceUpdate: false,
    });

    await setDoc(doc(db, "app-config", "settings"), {
      licenseValidationInterval: 30, // días
      gracePeriodDays: 15,
      maxOfflineDays: 45,
      enableAutoUpdates: true,
      maintenanceMode: false,
      supportEmail: "soporte@liqueen.com",
    });

    // Configurar roles y permisos
    await setDoc(doc(db, "app-config", "roles"), {
      admin: {
        name: "Administrador",
        permissions: [
          "generate_licenses",
          "manage_users",
          "view_analytics",
          "system_config",
          "revoke_licenses",
          "unlimited_liquidations",
          "access_admin_panel",
        ],
        description: "Acceso completo al sistema",
        licenseValidityYears: "unlimited",
      },
      user: {
        name: "Usuario",
        permissions: [
          "use_app",
          "generate_liquidations",
          "export_pdf",
          "basic_features",
        ],
        limitations: {
          maxLiquidationsPerMonth: 100,
          licenseValidityYears: 2,
          maxDevices: 1,
        },
        description: "Usuario estándar con licencia de 2 años",
      },
      lastUpdated: Date.now(),
    });

    console.log("✅ Configuración de roles creada");

    // 2. Crear usuario administrador
    console.log("👤 Creando usuario administrador...");
    await setDoc(doc(db, "users", "maikostudios@gmail.com"), {
      email: "maikostudios@gmail.com",
      role: "admin",
      name: "Maiko Studios",
      phone: "+56912345678",
      createdAt: Date.now(),
      lastLogin: null,
      isActive: true,
      licenseCode: "ADMIN-UNLIMITED-ACCESS",
      licenseType: "unlimited",
      licenseStatus: "active",
      permissions: [
        "generate_licenses",
        "manage_users",
        "view_analytics",
        "system_config",
        "revoke_licenses",
        "unlimited_liquidations",
        "access_admin_panel",
      ],
    });

    console.log("✅ Usuario administrador creado");

    // 3. Crear licencias de ejemplo
    console.log("🎫 Creando licencias de ejemplo...");
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
        console.log(`  ✅ Licencia creada: ${license.code}`);
      } else {
        console.log(`  ⚠️  Licencia ya existe: ${license.code}`);
      }
    }

    console.log("✅ Configuración de Firestore completada exitosamente!");
    console.log("");
    console.log("📋 Licencias de prueba disponibles:");
    console.log("  - LIQ-2025-TEST-0001-MAIK (Trial - 30 días)");
    console.log("  - LIQ-2025-DEMO-0001-STUD (Standard - 2 años)");
    console.log("  - LIQ-2025-ADMIN-0001-SAEZ (Extended - 5 años)");
    console.log("");
    console.log(
      "🎯 Puedes usar estas licencias para probar el sistema de registro."
    );
  } catch (error) {
    console.error("❌ Error configurando Firestore:", error);
    process.exit(1);
  }
}

// Ejecutar setup
setupFirestore();
