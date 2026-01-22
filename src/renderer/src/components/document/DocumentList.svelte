<script lang="ts">
  import { documentStore } from '../../lib/stores/documentStore.svelte';
  import { debounce } from '../../lib/utils/debounce';
  import DocumentCard from './DocumentCard.svelte';
  import EmptyState from '../ui/EmptyState.svelte';

  let searchQuery = $state('');

  // Debounced search function
  const debouncedSearch = debounce((query: string) => {
    if (query.trim()) {
      documentStore.search(query);
    } else {
      documentStore.loadRecent(20);
    }
  }, 300);

  // Trigger search when query changes
  $effect(() => {
    debouncedSearch(searchQuery);
  });

  function handleDocumentClick(documentId: string) {
    const doc = documentStore.documents.find((d) => d.id === documentId);
    if (doc) {
      documentStore.currentDocument = doc;
    }
  }

  async function createFirstDocument() {
    const doc = await documentStore.create();
    if (doc) {
      documentStore.currentDocument = doc;
    }
  }
</script>

<div class="flex flex-col h-full">
  <!-- Search input -->
  <div class="p-4 border-b border-base-300">
    <input
      type="text"
      placeholder="Search documents..."
      class="input input-bordered w-full"
      bind:value={searchQuery}
    />
  </div>

  <!-- Document list -->
  <div class="flex-1 overflow-y-auto p-4 space-y-2">
    {#if documentStore.loading}
      <div class="flex justify-center p-8">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {:else if documentStore.documents.length === 0}
      <EmptyState
        title="No documents yet"
        description="Create your first document to get started with MiniDesk."
        actionText="Create Your First Document"
        onAction={createFirstDocument}
      />
    {:else}
      {#each documentStore.documents as document (document.id)}
        <DocumentCard
          {document}
          selected={documentStore.currentDocument?.id === document.id}
          onClick={() => handleDocumentClick(document.id)}
        />
      {/each}
    {/if}
  </div>
</div>
