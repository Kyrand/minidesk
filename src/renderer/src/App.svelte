<script lang="ts">
  let count = $state(0);

  function increment() {
    count++;
  }
</script>

<div class="flex h-screen items-center justify-center">
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-4">MiniDesk</h1>
    <p class="text-lg mb-4">Lightweight P2P Collaboration Suite</p>

    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Project Initialized!</h2>
        <p>Phase 1.1 Complete - Electron + Vite + Svelte 5</p>

        <div class="mt-4">
          <button class="btn btn-primary" onclick={increment}>
            Count is {count}
          </button>
        </div>

        <div class="mt-4 text-sm">
          <p>✓ Electron 28+</p>
          <p>✓ Svelte 5 with Runes</p>
          <p>✓ Vite</p>
          <p>✓ Tailwind CSS + DaisyUI</p>
          <p>✓ TypeScript</p>
        </div>
      </div>
    </div>
  </div>
</div>
