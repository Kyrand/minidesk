<script lang="ts">
  import { onMount } from 'svelte';
  import { documentStore } from './lib/stores/documentStore.svelte';
  import Header from './components/layout/Header.svelte';
  import Sidebar from './components/layout/Sidebar.svelte';
  import DocumentEditor from './components/document/DocumentEditor.svelte';
  import EmptyState from './components/ui/EmptyState.svelte';
  import Toast from './components/ui/Toast.svelte';

  onMount(async () => {
    // Load recent documents on app startup
    await documentStore.loadRecent(20);
  });

  async function createFirstDocument() {
    const doc = await documentStore.create();
    if (doc) {
      documentStore.currentDocument = doc;
    }
  }
</script>

<div class="flex flex-col h-screen">
  <!-- Header -->
  <Header />

  <!-- Main content area -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main content -->
    <main class="flex-1 overflow-hidden">
      {#if documentStore.currentDocument}
        <DocumentEditor />
      {:else}
        <EmptyState
          title="Select a document"
          description="Choose a document from the sidebar to view and edit it, or create a new one."
          actionText="Create New Document"
          onAction={createFirstDocument}
        />
      {/if}
    </main>
  </div>

  <!-- Toast notifications -->
  <Toast />
</div>
