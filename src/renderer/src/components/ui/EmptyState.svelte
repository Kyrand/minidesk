<script lang="ts">
  interface Props {
    title: string;
    description: string;
    actionText?: string;
    onAction?: () => void;
  }

  let { title, description, actionText, onAction }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center h-full p-8 text-center">
  <svg
    class="w-24 h-24 mb-4 text-base-300"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>

  <h3 class="text-2xl font-bold mb-2">{title}</h3>
  <p class="text-base-content/70 mb-6 max-w-md">{description}</p>

  {#if actionText && onAction}
    <button class="btn btn-primary" onclick={onAction}>
      {actionText}
    </button>
  {/if}
</div>
