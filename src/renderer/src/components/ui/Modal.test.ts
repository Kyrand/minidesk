import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ModalTestWrapper from './Modal.test-wrapper.svelte';

describe('Modal.svelte', () => {
  describe('Rendering', () => {
    it('renders with title and children content', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      render(ModalTestWrapper, {
        props: {
          open: true,
          title: 'Test Modal',
          onConfirm,
          onCancel,
          content: 'This is test content'
        }
      });

      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('This is test content')).toBeInTheDocument();
    });

    it('does not render when open is false', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      const { container } = render(ModalTestWrapper, {
        props: {
          open: false,
          title: 'Test Modal',
          onConfirm,
          onCancel,
          content: 'This is test content'
        }
      });

      const dialog = container.querySelector('.modal');
      expect(dialog).not.toHaveClass('modal-open');
    });

    it('renders when open is true', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      const { container } = render(ModalTestWrapper, {
        props: {
          open: true,
          title: 'Test Modal',
          onConfirm,
          onCancel,
          content: 'This is test content'
        }
      });

      const dialog = container.querySelector('.modal');
      expect(dialog).toHaveClass('modal-open');
    });

    it('renders custom confirm/cancel button text', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      render(ModalTestWrapper, {
        props: {
          open: true,
          title: 'Test Modal',
          onConfirm,
          onCancel,
          content: 'Test',
          confirmText: 'Yes',
          cancelText: 'No'
        }
      });

      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('applies destructive styling when destructive=true', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      render(ModalTestWrapper, {
        props: {
          open: true,
          title: 'Delete Item',
          onConfirm,
          onCancel,
          content: 'Are you sure?',
          destructive: true
        }
      });

      const confirmButton = screen.getByText('Confirm');
      expect(confirmButton).toHaveClass('btn-error');
    });
  });

  describe('User Interactions', () => {
    it('calls onConfirm and closes modal when confirm button clicked', async () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      const { container, component } = render(ModalTestWrapper, {
        props: {
          open: true,
          title: 'Test Modal',
          onConfirm,
          onCancel,
          content: 'Test'
        }
      });

      const confirmButton = screen.getByText('Confirm');
      await fireEvent.click(confirmButton);

      expect(onConfirm).toHaveBeenCalledTimes(1);

      // Check that modal is closed (wait for reactivity)
      await new Promise(resolve => setTimeout(resolve, 0));
      const dialog = container.querySelector('.modal');
      expect(dialog).not.toHaveClass('modal-open');
    });

    it('calls onCancel and closes modal when cancel button clicked', async () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      const { container } = render(ModalTestWrapper, {
        props: {
          open: true,
          title: 'Test Modal',
          onConfirm,
          onCancel,
          content: 'Test'
        }
      });

      const cancelButton = screen.getByText('Cancel');
      await fireEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);

      // Check that modal is closed (wait for reactivity)
      await new Promise(resolve => setTimeout(resolve, 0));
      const dialog = container.querySelector('.modal');
      expect(dialog).not.toHaveClass('modal-open');
    });

    it('calls onCancel and closes when backdrop clicked', async () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      const { container } = render(ModalTestWrapper, {
        props: {
          open: true,
          title: 'Test Modal',
          onConfirm,
          onCancel,
          content: 'Test'
        }
      });

      const backdrop = container.querySelector('.modal-backdrop') as HTMLElement;
      expect(backdrop).toBeInTheDocument();

      await fireEvent.click(backdrop);

      expect(onCancel).toHaveBeenCalledTimes(1);

      // Check that modal is closed (wait for reactivity)
      await new Promise(resolve => setTimeout(resolve, 0));
      const dialog = container.querySelector('.modal');
      expect(dialog).not.toHaveClass('modal-open');
    });

    it('backdrop has aria-label for accessibility', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      const { container } = render(ModalTestWrapper, {
        props: {
          open: true,
          title: 'Test Modal',
          onConfirm,
          onCancel,
          content: 'Test'
        }
      });

      const backdrop = container.querySelector('.modal-backdrop');
      expect(backdrop).toHaveAttribute('aria-label', 'Close modal');
    });
  });

  describe('Svelte 5 Snippets', () => {
    it('renders children snippet correctly', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      render(ModalTestWrapper, {
        props: {
          open: true,
          title: 'Test Modal',
          onConfirm,
          onCancel,
          content: 'Simple content'
        }
      });

      expect(screen.getByText('Simple content')).toBeInTheDocument();
    });

    it('handles complex children content (multiple elements)', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      render(ModalTestWrapper, {
        props: {
          open: true,
          title: 'Test Modal',
          onConfirm,
          onCancel,
          content: 'Line 1 Line 2 Line 3'
        }
      });

      expect(screen.getByText(/Line 1 Line 2 Line 3/)).toBeInTheDocument();
    });
  });
});
