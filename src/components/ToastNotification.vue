<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
          @click="removeToast(toast.id)"
        >
          <div class="toast-icon">
            <svg v-if="toast.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
            
            <svg v-else-if="toast.type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            
            <svg v-else-if="toast.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          
          <div class="toast-content">
            <div class="toast-title" v-if="toast.title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
          
          <button class="toast-close" @click.stop="removeToast(toast.id)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          
          <div class="toast-progress" :style="{ animationDuration: `${toast.duration}ms` }"></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ToastNotification',
  setup() {
    const toasts = ref([])
    let toastId = 0
    
    const addToast = (options) => {
      const toast = {
        id: ++toastId,
        type: options.type || 'info',
        title: options.title || '',
        message: options.message || '',
        duration: options.duration || 5000,
        persistent: options.persistent || false
      }
      
      toasts.value.push(toast)
      
      if (!toast.persistent) {
        setTimeout(() => {
          removeToast(toast.id)
        }, toast.duration)
      }
      
      return toast.id
    }
    
    const removeToast = (id) => {
      const index = toasts.value.findIndex(toast => toast.id === id)
      if (index > -1) {
        toasts.value.splice(index, 1)
      }
    }
    
    const clearAll = () => {
      toasts.value = []
    }
    
    // Métodos de conveniencia
    const success = (message, options = {}) => {
      return addToast({ ...options, type: 'success', message })
    }
    
    const error = (message, options = {}) => {
      return addToast({ ...options, type: 'error', message })
    }
    
    const warning = (message, options = {}) => {
      return addToast({ ...options, type: 'warning', message })
    }
    
    const info = (message, options = {}) => {
      return addToast({ ...options, type: 'info', message })
    }
    
    // Exponer métodos globalmente
    onMounted(() => {
      window.$toast = {
        success,
        error,
        warning,
        info,
        add: addToast,
        remove: removeToast,
        clear: clearAll
      }
    })
    
    return {
      toasts,
      removeToast,
      addToast,
      success,
      error,
      warning,
      info
    }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 400px;
  width: 100%;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-height: 60px;
  backdrop-filter: blur(10px);
}

.toast-success {
  border-left: 4px solid #22c55e;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.toast-error {
  border-left: 4px solid #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}

.toast-warning {
  border-left: 4px solid #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.toast-info {
  border-left: 4px solid #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: var(--space-1);
}

.toast-success .toast-icon {
  color: #16a34a;
}

.toast-error .toast-icon {
  color: #dc2626;
}

.toast-warning .toast-icon {
  color: #d97706;
}

.toast-info .toast-icon {
  color: #2563eb;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.toast-message {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.4;
  word-wrap: break-word;
  font-weight: 500;
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: var(--gray-400);
  cursor: pointer;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.toast-close:hover {
  background: var(--gray-100);
  color: var(--gray-600);
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  width: 100%;
  transform-origin: left;
  animation: progress linear;
}

.toast-success .toast-progress {
  background: #22c55e;
}

.toast-error .toast-progress {
  background: #ef4444;
}

.toast-warning .toast-progress {
  background: #f59e0b;
}

.toast-info .toast-progress {
  background: #3b82f6;
}

@keyframes progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* Transiciones */
.toast-enter-active {
  transition: all var(--transition-normal);
}

.toast-leave-active {
  transition: all var(--transition-fast);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform var(--transition-normal);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .toast-container {
    top: var(--space-4);
    right: var(--space-4);
    left: var(--space-4);
    max-width: none;
  }
  
  .toast {
    padding: var(--space-3);
  }
  
  .toast-title {
    font-size: var(--font-size-xs);
  }
  
  .toast-message {
    font-size: var(--font-size-xs);
  }
}
</style>
