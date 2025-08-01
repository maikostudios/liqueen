<template>
  <div :class="['status-indicator', `status-${type}`, { 'status-pulse': pulse }]">
    <div class="status-icon">
      <!-- Success Icon -->
      <svg v-if="type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20,6 9,17 4,12"/>
      </svg>
      
      <!-- Error Icon -->
      <svg v-else-if="type === 'error'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      
      <!-- Warning Icon -->
      <svg v-else-if="type === 'warning'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      
      <!-- Loading Icon -->
      <svg v-else-if="type === 'loading'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
      
      <!-- Info Icon -->
      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    </div>
    
    <span v-if="label" class="status-label">{{ label }}</span>
    
    <div v-if="showDot" class="status-dot"></div>
  </div>
</template>

<script>
export default {
  name: 'StatusIndicator',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'loading', 'info'].includes(value)
    },
    label: {
      type: String,
      default: ''
    },
    pulse: {
      type: Boolean,
      default: false
    },
    showDot: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-fast);
  position: relative;
}

/* Tipos de estado */
.status-success {
  background: rgba(34, 197, 94, 0.1);
  color: var(--secondary-700);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-700);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.status-warning {
  background: rgba(245, 158, 11, 0.1);
  color: var(--accent-700);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.status-loading {
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary-700);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.status-info {
  background: rgba(107, 114, 128, 0.1);
  color: var(--gray-700);
  border: 1px solid rgba(107, 114, 128, 0.2);
}

/* Iconos */
.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-label {
  white-space: nowrap;
}

/* Punto indicador */
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-success .status-dot {
  background: var(--secondary-500);
}

.status-error .status-dot {
  background: var(--danger-500);
}

.status-warning .status-dot {
  background: var(--accent-500);
}

.status-loading .status-dot {
  background: var(--primary-500);
}

.status-info .status-dot {
  background: var(--gray-500);
}

/* Animación de pulso */
.status-pulse {
  animation: statusPulse 2s infinite;
}

@keyframes statusPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Animación de spin para loading */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Variantes de tamaño */
.status-indicator.size-sm {
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
}

.status-indicator.size-sm .status-icon svg {
  width: 12px;
  height: 12px;
}

.status-indicator.size-sm .status-dot {
  width: 6px;
  height: 6px;
}

.status-indicator.size-lg {
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
}

.status-indicator.size-lg .status-icon svg {
  width: 20px;
  height: 20px;
}

.status-indicator.size-lg .status-dot {
  width: 10px;
  height: 10px;
}

/* Hover effects */
.status-indicator:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Responsive */
@media (max-width: 768px) {
  .status-indicator {
    padding: var(--space-1) var(--space-2);
    font-size: var(--font-size-xs);
  }
  
  .status-icon svg {
    width: 14px;
    height: 14px;
  }
}
</style>
