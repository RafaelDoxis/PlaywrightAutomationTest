<script setup>
import { defineProps, defineEmits } from 'vue'

const tabs = ['Home', 'Dashboard', 'Profile']

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const selectTab = (tab) => {
  if (tab !== props.modelValue) {
    emit('update:modelValue', tab)
  }
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar__inner">
      <div class="navbar__brand">Playground</div>

      <ul class="navbar__list" role="tablist" aria-label="Primary navigation">
        <li v-for="tab in tabs" :key="tab" class="navbar__item">
          <button
            type="button"
            class="navbar__tab"
            :class="{ 'navbar__tab--active': tab === modelValue }"
            role="tab"
            :aria-selected="tab === modelValue"
            @click="selectTab(tab)"
          >
            {{ tab }}
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  background: color-mix(in srgb, var(--color-background) 70%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 75%, transparent);
  backdrop-filter: blur(12px);
}

.navbar__inner {
  width: min(1280px, 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.navbar__brand {
  font-weight: 650;
  letter-spacing: 0.2px;
  color: var(--color-heading);
  user-select: none;
}

.navbar__list {
  display: flex;
  gap: 0.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
  background: color-mix(in srgb, var(--color-background-soft) 85%, transparent);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 0.25rem;
}

.navbar__item {
  margin: 0;
}

.navbar__tab {
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.navbar__tab:hover {
  background: color-mix(in srgb, var(--color-background-mute) 70%, transparent);
  border-color: color-mix(in srgb, var(--color-border-hover) 80%, transparent);
}

.navbar__tab--active {
  background: var(--color-primary);
  color: var(--vt-c-white);
  border-color: transparent;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.14);
}

.navbar__tab--active:hover {
  background: var(--color-primary);
}

@media (max-width: 520px) {
  .navbar__brand {
    display: none;
  }

  .navbar__inner {
    justify-content: center;
  }
}
</style>

