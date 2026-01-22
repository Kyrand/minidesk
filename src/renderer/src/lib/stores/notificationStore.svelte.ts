export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number;
}

class NotificationStore {
  notifications = $state<Notification[]>([]);
  private nextId = 0;

  /**
   * Show a notification
   * @param message - The notification message
   * @param type - The notification type
   * @param duration - Auto-dismiss duration in milliseconds (default 3000ms)
   */
  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
    const id = `notification-${this.nextId++}`;
    const notification: Notification = { id, message, type, duration };

    this.notifications.push(notification);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  /**
   * Show a success notification
   */
  success(message: string, duration: number = 3000) {
    this.show(message, 'success', duration);
  }

  /**
   * Show an error notification
   */
  error(message: string, duration: number = 5000) {
    this.show(message, 'error', duration);
  }

  /**
   * Show an info notification
   */
  info(message: string, duration: number = 3000) {
    this.show(message, 'info', duration);
  }

  /**
   * Dismiss a notification by ID
   */
  dismiss(id: string) {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
    }
  }
}

export const notificationStore = new NotificationStore();
