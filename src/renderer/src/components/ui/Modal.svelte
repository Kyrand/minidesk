<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open?: boolean;
    title: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
    children: Snippet;
  }

  let {
    open = $bindable(false),
    title,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    destructive = false,
    children
  }: Props = $props();

  function handleConfirm() {
    onConfirm();
    open = false;
  }

  function handleCancel() {
    onCancel();
    open = false;
  }
</script>

<dialog class="modal" class:modal-open={open}>
  <div class="modal-box">
    <h3 class="font-bold text-lg">{title}</h3>
    <div class="py-4">
      {@render children()}
    </div>
    <div class="modal-action">
      <button class="btn" onclick={handleCancel}>{cancelText}</button>
      <button
        class="btn {destructive ? 'btn-error' : 'btn-primary'}"
        onclick={handleConfirm}
      >
        {confirmText}
      </button>
    </div>
  </div>
  <button
    type="button"
    class="modal-backdrop"
    onclick={handleCancel}
    aria-label="Close modal"
  >
  </button>
</dialog>
