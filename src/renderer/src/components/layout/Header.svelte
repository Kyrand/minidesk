<script lang="ts">
  import { documentStore } from '../../lib/stores/documentStore.svelte';
  import { notificationStore } from '../../lib/stores/notificationStore.svelte';
  import ThemeToggle from '../ui/ThemeToggle.svelte';

  async function handleNewDocument() {
    try {
      const doc = await documentStore.create();
      if (doc) {
        documentStore.currentDocument = doc;
        notificationStore.success('New document created');
      } else {
        notificationStore.error('Failed to create document');
      }
    } catch (error) {
      console.error('Error creating document:', error);
      notificationStore.error('Failed to create document');
    }
  }
</script>

<header class="navbar bg-base-100 border-b border-base-300 px-4">
  <div class="flex-1">
    <span class="text-xl font-bold">MiniDesk</span>
  </div>
  <div class="flex-none gap-2">
    <button class="btn btn-primary" onclick={handleNewDocument}>
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
      New Document
    </button>
    <ThemeToggle />
  </div>
</header>
