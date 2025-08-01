<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <div class="modal-icon" :class="`icon-${type}`">
              <!-- Success Icon -->
              <svg v-if="type === 'success'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
              
              <!-- Warning Icon -->
              <svg v-else-if="type === 'warning'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              
              <!-- Danger Icon -->
              <svg v-else-if="type === 'danger'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              
              <!-- Info Icon -->
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>
            
            <div class="modal-title-section">
              <h3 class="modal-title">{{ title }}</h3>
              <p v-if="message" class="modal-message">{{ message }}</p>
            </div>
            
            <button v-if="showCloseButton" class="modal-close" @click="handleCancel">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div v-if="$slots.default" class="modal-content">
            <slot></slot>
          </div>
          
          <div class="modal-actions">
            <button
              v-if="showCancelButton"
              class="btn btn-secondary"
              @click="handleCancel"
              :disabled="loading"
            >
              {{ cancelText }}
            </button>
            
            <button
              class="btn"
              :class="confirmButtonClass"
              @click="handleConfirm"
              :disabled="loading"
            >
              <span v-if="!loading">{{ confirmText }}</span>
              <div v-else class="btn-loading">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                {{ loadingText }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ConfirmModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'warning', 'danger', 'info'].includes(value)
    },
    confirmText: {
      type: String,
      default: 'Confirmar'
    },
    cancelText: {
      type: String,
      default: 'Cancelar'
    },
    loadingText: {
      type: String,
      default: 'Procesando...'
    },
    showCancelButton: {
      type: Boolean,
      default: true
    },
    showCloseButton: {
      type: Boolean,
      default: true
    },
    closeOnOverlay: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'confirm', 'cancel'],
  setup(props, { emit }) {
    const isVisible = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })
    
    const confirmButtonClass = computed(() => {
      const baseClass = 'btn-primary'
      switch (props.type) {
        case 'danger':
          return 'btn-danger'
        case 'warning':
          return 'btn-warning'
        case 'success':
          return 'btn-success'
        default:
          return baseClass
      }
    })
    
    const handleConfirm = () => {
      emit('confirm')
    }
    
    const handleCancel = () => {
      emit('cancel')
      isVisible.value = false
    }
    
    const handleOverlayClick = () => {
      if (props.closeOnOverlay && !props.loading) {
        handleCancel()
      }
    }
    
    return {
      isVisible,
      confirmButtonClass,
      handleConfirm,
      handleCancel,
      handleOverlayClick
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: var(--space-4);
}

.modal-container {
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-6);
  border-bottom: 1px solid var(--gray-200);
}

.modal-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-success {
  background: rgba(34, 197, 94, 0.1);
  color: var(--secondary-600);
}

.icon-warning {
  background: rgba(245, 158, 11, 0.1);
  color: var(--accent-600);
}

.icon-danger {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-600);
}

.icon-info {
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary-600);
}

.modal-title-section {
  flex: 1;
  min-width: 0;
}

.modal-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0 0 var(--space-2) 0;
}

.modal-message {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  line-height: 1.5;
  margin: 0;
}

.modal-close {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
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

.modal-close:hover {
  background: var(--gray-100);
  color: var(--gray-600);
}

.modal-content {
  padding: var(--space-6);
  border-bottom: 1px solid var(--gray-200);
}

.modal-actions {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-6);
  justify-content: flex-end;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Transiciones */
.modal-enter-active,
.modal-leave-active {
  transition: all var(--transition-normal);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--space-2);
  }
  
  .modal-header {
    padding: var(--space-4);
  }
  
  .modal-content {
    padding: var(--space-4);
  }
  
  .modal-actions {
    padding: var(--space-4);
    flex-direction: column-reverse;
  }
  
  .modal-actions .btn {
    width: 100%;
  }
}
</style>
