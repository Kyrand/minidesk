<script lang="ts">
  import { onMount } from 'svelte';
  import { documentStore } from './lib/stores/documentStore.svelte';

  onMount(async () => {
    await documentStore.loadRecent(20);
  });
</script>

<div class="flex h-screen items-center justify-center">
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-4">MiniDesk</h1>
    <p class="text-lg mb-4">Lightweight P2P Collaboration Suite</p>

    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Phase 1.2 Complete!</h2>
        <p>Database Layer Initialized</p>

        {#if documentStore.error}
          <div class="alert alert-error mt-4">
            <span>{documentStore.error}</span>
          </div>
        {/if}

        {#if documentStore.loading}
          <div class="mt-4">
            <span class="loading loading-spinner loading-lg"></span>
          </div>
        {:else}
          <div class="mt-4 text-sm">
            <p>✓ Electron 28+</p>
            <p>✓ Svelte 5 with Runes</p>
            <p>✓ Vite</p>
            <p>✓ Tailwind CSS + DaisyUI</p>
            <p>✓ TypeScript</p>
            <p>✓ SQLite Database (better-sqlite3)</p>
            <p>✓ Documents: {documentStore.documents.length}</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
