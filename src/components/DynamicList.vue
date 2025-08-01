<template>
  <div class="form-section">
    <h4>{{ title }}</h4>
    <div class="dynamic-list">
      <div class="dynamic-list-header">
        <span>Conceptos e Importes</span>
        <button type="button" class="btn-small btn-add" @click="$emit('add-item')">
          ➕ Agregar
        </button>
      </div>
      <div 
        v-for="(item, index) in items" 
        :key="index" 
        class="dynamic-list-item"
      >
        <input 
          type="text" 
          v-model="item.concepto" 
          placeholder="Concepto" 
          class="concept-input"
        >
        <input 
          type="number" 
          v-model.number="item.monto" 
          placeholder="0" 
          min="0" 
          step="1000" 
          class="amount-input"
        >
        <button 
          type="button" 
          class="btn-small btn-remove" 
          @click="$emit('remove-item', index)"
          :disabled="items.length <= 1"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
})

// Emits
defineEmits(['add-item', 'remove-item'])
</script>

<style scoped>
.btn-add {
  background-color: #4CAF50;
  color: white;
}

.btn-remove {
  background-color: #f44336;
  color: white;
}

.btn-remove:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-add:hover {
  background-color: #45a049;
}

.btn-remove:hover:not(:disabled) {
  background-color: #da190b;
}
</style>
