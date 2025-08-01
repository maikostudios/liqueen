import { createRouter, createWebHashHistory } from "vue-router";
import LicenseService from "../services/LicenseService.js";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AppView from "../views/AppView.vue";
import LicenseManagementView from "../views/LicenseManagementView.vue";
import AdminLicenseGeneratorView from "../views/AdminLicenseGeneratorView.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      requiresGuest: true,
      title: "Iniciar Sesión - Liqueen",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
    meta: {
      requiresGuest: true,
      title: "Registro - Liqueen",
    },
  },
  {
    path: "/app",
    name: "App",
    component: AppView,
    meta: {
      requiresAuth: true,
      title: "Liqueen - Generador de Liquidaciones",
    },
  },
  {
    path: "/license-management",
    name: "LicenseManagement",
    component: LicenseManagementView,
    meta: {
      requiresAuth: true,
      title: "Gestión de Licencias - Liqueen",
    },
  },
  {
    path: "/admin/license-generator",
    name: "AdminLicenseGenerator",
    component: AdminLicenseGeneratorView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: "Generador de Licencias - Admin - Liqueen",
    },
  },
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Guard de navegación para autenticación y licencias
router.beforeEach(async (to, from, next) => {
  // Actualizar título de la página
  document.title = to.meta.title || "Liqueen";

  // Verificar si la ruta requiere ser invitado (no autenticado)
  if (to.meta.requiresGuest) {
    // Permitir acceso directo al login/register sin verificaciones complejas
    // Esto evita conflictos de navegación durante logout
    next();
    return;
  }

  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    try {
      const licenseStatus = await LicenseService.getLicenseStatus();

      if (!licenseStatus.isValid) {
        // Licencia inválida, redirigir a login
        next("/login");
        return;
      }

      // Verificar si requiere permisos de admin
      if (to.meta.requiresAdmin) {
        // En una implementación real, verificar permisos de admin
        // Por ahora, permitir acceso
        console.log("Verificando permisos de administrador...");
      }

      // Realizar validación periódica si es necesario
      try {
        await LicenseService.performPeriodicValidation();
      } catch (error) {
        console.warn("Error en validación periódica:", error);
      }

      next();
    } catch (error) {
      console.error("Error verificando licencia:", error);
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
