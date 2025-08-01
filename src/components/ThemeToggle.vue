<template>
  <button 
    @click="toggleTheme"
    class="theme-toggle"
    :title="themeInfo.toggleLabel"
    :aria-label="themeInfo.toggleLabel"
  >
    <span class="theme-icon">{{ themeInfo.icon }}</span>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ThemeService from '../services/ThemeService.js'

// Estado reactivo del tema
const themeInfo = ref(ThemeService.getThemeInfo())

// Función para alternar tema
const toggleTheme = () => {
  const newTheme = ThemeService.toggleTheme()
  themeInfo.value = ThemeService.getThemeInfo()
  
  console.log(`🎨 Tema cambiado a: ${newTheme}`)
}

// Observador para cambios de tema
const themeObserver = (newTheme) => {
  themeInfo.value = ThemeService.getThemeInfo()
}

// Ciclo de vida
onMounted(() => {
  // Agregar observador
  ThemeService.addObserver(themeObserver)
  
  // Actualizar estado inicial
  themeInfo.value = ThemeService.getThemeInfo()
})

onUnmounted(() => {
  // Remover observador
  ThemeService.removeObserver(themeObserver)
})
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px var(--shadow-color);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px var(--shadow-color);
  background: var(--bg-tertiary);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-icon {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.theme-toggle:hover .theme-icon {
  transform: rotate(15deg);
}

/* Animación de entrada */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.theme-toggle {
  animation: fadeInScale 0.3s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
  .theme-toggle {
    top: 15px;
    right: 15px;
    width: 45px;
    height: 45px;
  }
  
  .theme-icon {
    font-size: 1.3rem;
  }
}
</style>
