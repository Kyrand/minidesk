<script lang="ts">
  import { documentStore } from '../../lib/stores/documentStore.svelte';
  import { notificationStore } from '../../lib/stores/notificationStore.svelte';
  import { debounce } from '../../lib/utils/debounce';
  import MilkdownEditor from './MilkdownEditor.svelte';
  import Modal from '../ui/Modal.svelte';

  // Local state for editing
  let titleInput = $state('');
  let isShared = $state(false);
  let contentBuffer = $state('');
  let hasUnsavedChanges = $state(false);
  let isSaving = $state(false);
  let showDeleteModal = $state(false);

  // Sync local state with current document
  $effect(() => {
    if (documentStore.currentDocument) {
      titleInput = documentStore.currentDocument.title;
      isShared = documentStore.currentDocument.isShared;
      contentBuffer = documentStore.currentDocument.content;
      hasUnsavedChanges = false;
    }
  });

  // Debounced save function
  const debouncedSave = debounce(async () => {
    if (!documentStore.currentDocument || isSaving) return;

    isSaving = true;
    hasUnsavedChanges = false;

    try {
      const success = await documentStore.update(documentStore.currentDocument.id, {
        title: titleInput,
        content: contentBuffer,
        isShared: isShared
      });

      if (success) {
        // Update current document reference
        const updated = documentStore.documents.find(
          (d) => d.id === documentStore.currentDocument?.id
        );
        if (updated) {
          documentStore.currentDocument = updated;
        }
      } else {
        notificationStore.error('Failed to save document');
      }
    } catch (error) {
      console.error('Error saving document:', error);
      notificationStore.error('Failed to save document');
    } finally {
      isSaving = false;
    }
  }, 1000);

  // Handle title change
  function handleTitleChange() {
    hasUnsavedChanges = true;
    debouncedSave();
  }

  // Handle content change from Milkdown
  function handleContentChange(newContent: string) {
    contentBuffer = newContent;
    hasUnsavedChanges = true;
    debouncedSave();
  }

  // Handle share toggle
  function handleShareToggle() {
    hasUnsavedChanges = true;
    debouncedSave();
  }

  // Handle back button
  function handleBack() {
    documentStore.currentDocument = null;
  }

  // Handle delete
  async function handleDelete() {
    if (!documentStore.currentDocument) return;

    try {
      const success = await documentStore.delete(documentStore.currentDocument.id);
      if (success) {
        notificationStore.success('Document deleted');
        documentStore.currentDocument = null;
      } else {
        notificationStore.error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      notificationStore.error('Failed to delete document');
    }
  }

  // Save status text
  const saveStatus = $derived.by(() => {
    if (isSaving) return 'Saving...';
    if (hasUnsavedChanges) return 'Unsaved changes';
    return 'All changes saved';
  });
</script>

{#if documentStore.currentDocument}
  <div class="flex flex-col h-full">
    <!-- Toolbar -->
    <div class="bg-base-200 border-b border-base-300 p-4 flex items-center gap-4">
      <!-- Back button -->
      <button class="btn btn-ghost btn-sm" onclick={handleBack}>
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      <!-- Title input -->
      <input
        type="text"
        class="input input-bordered flex-1"
        placeholder="Document title..."
        bind:value={titleInput}
        oninput={handleTitleChange}
      />

      <!-- Share toggle -->
      <label class="flex items-center gap-2 cursor-pointer">
        <span class="text-sm">Share</span>
        <input
          type="checkbox"
          class="toggle toggle-primary"
          bind:checked={isShared}
          onchange={handleShareToggle}
        />
      </label>

      <!-- Delete button -->
      <button class="btn btn-error btn-sm" onclick={() => (showDeleteModal = true)}>
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Delete
      </button>

      <!-- Save status -->
      <div class="text-sm text-base-content/70 whitespace-nowrap">
        {saveStatus}
      </div>
    </div>

    <!-- Editor -->
    <div class="flex-1 overflow-y-auto bg-base-100">
      <MilkdownEditor content={contentBuffer} onChange={handleContentChange} />
    </div>
  </div>

  <!-- Delete confirmation modal -->
  <Modal
    bind:open={showDeleteModal}
    title="Delete Document"
    confirmText="Delete"
    cancelText="Cancel"
    destructive={true}
    onConfirm={handleDelete}
    onCancel={() => {}}
  >
    <p class="text-base-content/70">
      Are you sure you want to delete
      <strong>{documentStore.currentDocument.title || 'Untitled'}</strong>?
    </p>
    <p class="text-error mt-2">This action cannot be undone.</p>
  </Modal>
{/if}
