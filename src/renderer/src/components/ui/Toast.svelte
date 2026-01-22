<script lang="ts">
  import { notificationStore } from '../../lib/stores/notificationStore.svelte';

  function getAlertClass(type: 'success' | 'error' | 'info'): string {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      case 'info':
        return 'alert-info';
      default:
        return 'alert-info';
    }
  }
</script>

<div class="toast toast-end toast-bottom z-50">
  {#each notificationStore.notifications as notification (notification.id)}
    <div class="alert {getAlertClass(notification.type)} shadow-lg">
      <span>{notification.message}</span>
      <button
        class="btn btn-sm btn-circle btn-ghost"
        onclick={() => notificationStore.dismiss(notification.id)}
      >
        ✕
      </button>
    </div>
  {/each}
</div>
