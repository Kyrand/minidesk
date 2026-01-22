import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import DocumentCard from './DocumentCard.svelte';
import { createMockDocument } from '../../lib/test-utils/mocks';

describe('DocumentCard.svelte', () => {
  describe('Rendering', () => {
    it('renders document title', () => {
      const mockDoc = createMockDocument({ title: 'My Test Document' });
      const onClick = vi.fn();

      render(DocumentCard, {
        props: {
          document: mockDoc,
          onClick
        }
      });

      expect(screen.getByText('My Test Document')).toBeInTheDocument();
    });

    it('renders "Untitled" when document has no title', () => {
      const mockDoc = createMockDocument({ title: '' });
      const onClick = vi.fn();

      render(DocumentCard, {
        props: {
          document: mockDoc,
          onClick
        }
      });

      expect(screen.getByText('Untitled')).toBeInTheDocument();
    });

    it('renders document excerpt truncated to 100 chars', () => {
      const longContent = 'a'.repeat(150);
      const mockDoc = createMockDocument({ content: longContent });
      const onClick = vi.fn();

      render(DocumentCard, {
        props: {
          document: mockDoc,
          onClick
        }
      });

      // Should show truncated content with ellipsis
      const excerpt = screen.getByText(/a+\.\.\./);
      expect(excerpt).toBeInTheDocument();
      // Content should be truncated to 100 + 3 for ellipsis
      expect(excerpt.textContent?.length).toBeLessThanOrEqual(103);
    });

    it('renders formatted date', () => {
      const now = Date.now();
      const mockDoc = createMockDocument({ updatedAt: now });
      const onClick = vi.fn();

      render(DocumentCard, {
        props: {
          document: mockDoc,
          onClick
        }
      });

      // Should show "Today" for current date
      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    it('shows "Shared" badge when document.isShared is true', () => {
      const mockDoc = createMockDocument({ isShared: true });
      const onClick = vi.fn();

      render(DocumentCard, {
        props: {
          document: mockDoc,
          onClick
        }
      });

      expect(screen.getByText('Shared')).toBeInTheDocument();
    });

    it('does not show badge when document.isShared is false', () => {
      const mockDoc = createMockDocument({ isShared: false });
      const onClick = vi.fn();

      render(DocumentCard, {
        props: {
          document: mockDoc,
          onClick
        }
      });

      expect(screen.queryByText('Shared')).not.toBeInTheDocument();
    });
  });

  describe('Selection State', () => {
    it('applies ring styling when selected=true', () => {
      const mockDoc = createMockDocument();
      const onClick = vi.fn();

      const { container } = render(DocumentCard, {
        props: {
          document: mockDoc,
          selected: true,
          onClick
        }
      });

      const button = container.querySelector('button');
      expect(button).toHaveClass('ring-2', 'ring-primary');
    });

    it('does not apply ring styling when selected=false', () => {
      const mockDoc = createMockDocument();
      const onClick = vi.fn();

      const { container } = render(DocumentCard, {
        props: {
          document: mockDoc,
          selected: false,
          onClick
        }
      });

      const button = container.querySelector('button');
      expect(button).not.toHaveClass('ring-2');
      expect(button).not.toHaveClass('ring-primary');
    });
  });

  describe('User Interactions', () => {
    it('calls onClick when card is clicked', async () => {
      const mockDoc = createMockDocument();
      const onClick = vi.fn();

      const { container } = render(DocumentCard, {
        props: {
          document: mockDoc,
          onClick
        }
      });

      const button = container.querySelector('button') as HTMLElement;
      await fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('has hover state (bg-base-200)', () => {
      const mockDoc = createMockDocument();
      const onClick = vi.fn();

      const { container } = render(DocumentCard, {
        props: {
          document: mockDoc,
          onClick
        }
      });

      const button = container.querySelector('button');
      expect(button).toHaveClass('hover:bg-base-200');
    });
  });

  describe('Content Formatting', () => {
    it('truncates long content to 100 characters', () => {
      const longContent = 'This is a very long content that should be truncated. '.repeat(5);
      const mockDoc = createMockDocument({ content: longContent });
      const onClick = vi.fn();

      render(DocumentCard, {
        props: {
          document: mockDoc,
          onClick
        }
      });

      const excerpt = screen.getByText(/\.\.\./);
      expect(excerpt.textContent?.length).toBeLessThanOrEqual(103); // 100 + '...'
    });

    it('handles empty content gracefully', () => {
      const mockDoc = createMockDocument({ content: '' });
      const onClick = vi.fn();

      render(DocumentCard, {
        props: {
          document: mockDoc,
          onClick
        }
      });

      expect(screen.getByText('No content yet...')).toBeInTheDocument();
    });

    it('formats dates correctly', () => {
      // Test yesterday
      const yesterday = Date.now() - (24 * 60 * 60 * 1000);
      const mockDoc = createMockDocument({ updatedAt: yesterday });
      const onClick = vi.fn();

      render(DocumentCard, {
        props: {
          document: mockDoc,
          onClick
        }
      });

      expect(screen.getByText('Yesterday')).toBeInTheDocument();
    });
  });
});
