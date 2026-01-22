<script lang="ts">
  import type { Document } from '../../lib/types';
  import { formatDate } from '../../lib/utils/formatDate';
  import { truncateText } from '../../lib/utils/truncateText';

  interface Props {
    document: Document;
    selected?: boolean;
    onClick: () => void;
  }

  let { document, selected = false, onClick }: Props = $props();

  // Extract excerpt from content (first 100 chars)
  const excerpt = $derived(truncateText(document.content || 'No content yet...', 100));
  const formattedDate = $derived(formatDate(document.updatedAt));
</script>

<button
  class="card card-compact bg-base-100 hover:bg-base-200 transition-colors cursor-pointer text-left w-full border border-base-300 {selected
    ? 'ring-2 ring-primary'
    : ''}"
  onclick={onClick}
>
  <div class="card-body">
    <div class="flex items-start justify-between gap-2">
      <h3 class="card-title text-base line-clamp-1">{document.title || 'Untitled'}</h3>
      {#if document.isShared}
        <span class="badge badge-primary badge-sm">Shared</span>
      {/if}
    </div>
    <p class="text-sm text-base-content/70 line-clamp-2">{excerpt}</p>
    <div class="text-xs text-base-content/50 mt-1">{formattedDate}</div>
  </div>
</button>
