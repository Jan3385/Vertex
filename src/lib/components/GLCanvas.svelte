<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let { sketch } = $props<{
    sketch: (canvas: HTMLCanvasElement) => (() => void) | void;
  }>();

  let canvas: HTMLCanvasElement;
  let cleanup: (() => void) | void;

  onMount(() => {
    cleanup = sketch(canvas);
  });

  onDestroy(() => {
    cleanup?.();
  });
</script>

<div style="width: 100px;">
  <canvas bind:this={canvas} width="100" height="100"></canvas>
</div>