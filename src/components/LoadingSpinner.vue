<template>
  <div class="loading-container" :class="{ 'overlay': overlay }">
    <div class="loading-spinner" :class="sizeClass">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    </div>
    
    <div v-if="message" class="loading-message">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    message: {
      type: String,
      default: ''
    },
    overlay: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const sizeClass = computed(() => `spinner-${props.size}`)
    
    return {
      sizeClass
    }
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
}

.loading-container.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  z-index: 9999;
}

.loading-spinner {
  position: relative;
  display: inline-block;
}

.spinner-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top: 2px solid var(--primary-500);
  animation: spin 1.2s linear infinite;
}

.spinner-ring:nth-child(1) {
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.4s;
  border-top-color: var(--secondary-500);
}

.spinner-ring:nth-child(3) {
  animation-delay: -0.8s;
  border-top-color: var(--accent-500);
}

/* Tamaños */
.spinner-small .spinner-ring {
  width: 20px;
  height: 20px;
}

.spinner-medium .spinner-ring {
  width: 40px;
  height: 40px;
}

.spinner-large .spinner-ring {
  width: 60px;
  height: 60px;
}

.loading-message {
  color: var(--gray-600);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-align: center;
  animation: pulse 2s infinite;
}

@keyframes spin {
  0% { 
    transform: rotate(0deg);
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% { 
    transform: rotate(360deg);
    opacity: 1;
  }
}

/* Variantes de color */
.spinner-primary .spinner-ring {
  border-top-color: var(--primary-500);
}

.spinner-secondary .spinner-ring {
  border-top-color: var(--secondary-500);
}

.spinner-accent .spinner-ring {
  border-top-color: var(--accent-500);
}
</style>
