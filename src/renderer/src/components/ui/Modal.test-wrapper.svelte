<script lang="ts">
  import Modal from './Modal.svelte';

  let { open = $bindable(false), title, content, ...rest } = $props();
</script>

<Modal bind:open {title} {...rest}>
  {content}
</Modal>
