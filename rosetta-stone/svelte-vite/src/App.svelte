<script>
  import { onMount } from 'svelte';
  import { main } from './viz'; // Imports the D3 visualization logic
  let containerElement;
  let svelteState = {}; // This will hold the state for the visualization

  // Wrapper for setState that will be passed to the D3 visualization
  // This ensures that when the D3 code calls setState, Svelte's reactivity is triggered.
  const setStateWrapper = (updaterFn) => {
    svelteState = updaterFn(svelteState);
    // The reactive block below ( $: ) will automatically call `main` again due to `svelteState` changing.
  };

  // This is a reactive statement. It re-runs whenever `svelteState` or `containerElement` changes.
  // It ensures the D3 visualization is updated when the state changes.
  $: if (containerElement && typeof main === 'function') {
    main(containerElement, { state: svelteState, setState: setStateWrapper });
  }

  onMount(() => {
    // Initial call to render the D3 visualization when the component mounts
    // and the container div is available.
    if (containerElement) {
      main(containerElement, { state: svelteState, setState: setStateWrapper });
    }
  });
</script>

<div bind:this={containerElement} class="viz-container"></div>

<style>
  .viz-container {
    height: 100vh;
    width: 100vw; /* Ensure it takes full width */
    display: block; /* Ensure it behaves as a block element */
  }
</style>
