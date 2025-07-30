<template>
  <div ref="containerRef" class="viz-container"></div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { viz } from './viz'; // Imports the D3 visualization logic

const containerRef = ref(null);
// Use reactive for the state object to make it deeply reactive.
// This state will be passed to the D3 visualization.
const vueState = reactive({});

// Wrapper for setState that will be passed to the D3 visualization.
// This function updates the reactive `vueState` object.
const setStateWrapper = (updaterFn) => {
  const newState = updaterFn(vueState); // Calculate the new state based on the current

  // Update properties of the reactive vueState object to match newState
  // First, remove keys from vueState that are not in newState
  for (const key in vueState) {
    if (!(key in newState)) {
      delete vueState[key];
    }
  }
  // Then, add/update keys from newState to vueState
  for (const key in newState) {
    vueState[key] = newState[key];
  }
  // The `watch` below will detect these changes and call `main` again.
};

onMounted(() => {
  // Initial call to render the D3 visualization when the component mounts
  // and the container div (containerRef.value) is available.
  if (containerRef.value) {
    viz(containerRef.value, {
      state: vueState,
      setState: setStateWrapper,
    });
  }
});

// Watch for changes in `vueState` and re-render the D3 visualization.
// `deep: true` ensures that changes to nested properties of `vueState` are also detected.
watch(
  vueState,
  () => {
    if (containerRef.value) {
      viz(containerRef.value, {
        state: vueState,
        setState: setStateWrapper,
      });
    }
  },
  { deep: true },
);
</script>

<style scoped>
/* Scoped styles for App.vue */
.viz-container {
  height: 100vh;
  width: 100vw; /* Ensure it takes full width */
  display: block; /* Ensure it behaves as a block element */
}
</style>
