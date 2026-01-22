import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMockDocument, createMockDocuments } from '../../lib/test-utils/mocks';

// Mock the documentStore before importing the component
vi.mock('../../lib/stores/documentStore.svelte', () => {
  return {
    documentStore: {
      documents: [],
      currentDocument: null,
      loading: false,
      error: null,
      loadRecent: vi.fn(),
      search: vi.fn(),
      create: vi.fn()
    }
  };
});

// Import after mocking
import DocumentList from './DocumentList.svelte';
import { documentStore as mockDocumentStore } from '../../lib/stores/documentStore.svelte';

describe('DocumentList.svelte', () => {
  beforeEach(() => {
    // Reset mock store state before each test
    mockDocumentStore.documents = [];
    mockDocumentStore.currentDocument = null;
    mockDocumentStore.loading = false;
    mockDocumentStore.error = null;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering States', () => {
    it('renders loading spinner when documentStore.loading is true', () => {
      mockDocumentStore.loading = true;

      render(DocumentList);

      const spinner = document.querySelector('.loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('renders empty state when no documents exist', () => {
      mockDocumentStore.loading = false;
      mockDocumentStore.documents = [];

      render(DocumentList);

      expect(screen.getByText('No documents yet')).toBeInTheDocument();
      expect(screen.getByText(/Create your first document/)).toBeInTheDocument();
    });

    it('renders document list when documents exist', () => {
      const mockDocs = createMockDocuments(3);
      mockDocumentStore.loading = false;
      mockDocumentStore.documents = mockDocs;

      render(DocumentList);

      expect(screen.getByText('Document 1')).toBeInTheDocument();
      expect(screen.getByText('Document 2')).toBeInTheDocument();
      expect(screen.getByText('Document 3')).toBeInTheDocument();
    });

    it('renders search input', () => {
      render(DocumentList);

      const searchInput = screen.getByPlaceholderText('Search documents...');
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Document List Display', () => {
    it('renders DocumentCard for each document', () => {
      const mockDocs = createMockDocuments(2);
      mockDocumentStore.documents = mockDocs;

      const { container } = render(DocumentList);

      const cards = container.querySelectorAll('.card');
      expect(cards.length).toBe(2);
    });

    it('marks current document as selected', () => {
      const mockDocs = createMockDocuments(3);
      mockDocumentStore.documents = mockDocs;
      mockDocumentStore.currentDocument = mockDocs[1]; // Select second document

      const { container } = render(DocumentList);

      const cards = container.querySelectorAll('.card');
      // Second card should have ring styling
      expect(cards[1]).toHaveClass('ring-2', 'ring-primary');
      expect(cards[0]).not.toHaveClass('ring-2');
      expect(cards[2]).not.toHaveClass('ring-2');
    });

    it('passes correct props to DocumentCard', () => {
      const mockDoc = createMockDocument({
        id: 1,
        title: 'Test Doc',
        content: 'Test content'
      });
      mockDocumentStore.documents = [mockDoc];

      render(DocumentList);

      expect(screen.getByText('Test Doc')).toBeInTheDocument();
      expect(screen.getByText(/Test content/)).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('debounces search input (300ms delay)', async () => {
      vi.useFakeTimers();

      render(DocumentList);

      const searchInput = screen.getByPlaceholderText('Search documents...') as HTMLInputElement;

      // Type in search input
      await fireEvent.input(searchInput, { target: { value: 'test query' } });

      // Should not call immediately
      expect(mockDocumentStore.search).not.toHaveBeenCalled();

      // Fast-forward 300ms
      vi.advanceTimersByTime(300);

      // Now it should be called
      await waitFor(() => {
        expect(mockDocumentStore.search).toHaveBeenCalledWith('test query');
      });
    });

    it('calls documentStore.search() with query', async () => {
      vi.useFakeTimers();

      render(DocumentList);

      const searchInput = screen.getByPlaceholderText('Search documents...') as HTMLInputElement;

      await fireEvent.input(searchInput, { target: { value: 'my search' } });
      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockDocumentStore.search).toHaveBeenCalledWith('my search');
      });
    });

    it('calls documentStore.loadRecent() when search is cleared', async () => {
      vi.useFakeTimers();

      render(DocumentList);

      const searchInput = screen.getByPlaceholderText('Search documents...') as HTMLInputElement;

      // First add a search query
      await fireEvent.input(searchInput, { target: { value: 'test' } });
      vi.advanceTimersByTime(300);

      // Clear search
      await fireEvent.input(searchInput, { target: { value: '' } });
      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockDocumentStore.loadRecent).toHaveBeenCalledWith(20);
      });
    });

    it('trims whitespace from search query', async () => {
      vi.useFakeTimers();

      render(DocumentList);

      const searchInput = screen.getByPlaceholderText('Search documents...') as HTMLInputElement;

      // Search with whitespace only should trigger loadRecent
      await fireEvent.input(searchInput, { target: { value: '   ' } });
      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockDocumentStore.loadRecent).toHaveBeenCalledWith(20);
        expect(mockDocumentStore.search).not.toHaveBeenCalled();
      });
    });
  });

  describe('User Interactions', () => {
    it('sets currentDocument when DocumentCard is clicked', async () => {
      const mockDocs = createMockDocuments(2);
      mockDocumentStore.documents = mockDocs;

      const { container } = render(DocumentList);

      const cards = container.querySelectorAll('.card');
      await fireEvent.click(cards[0]);

      // Check that currentDocument was set
      expect(mockDocumentStore.currentDocument).toEqual(mockDocs[0]);
    });

    it('creates first document when empty state action clicked', async () => {
      mockDocumentStore.documents = [];
      const newDoc = createMockDocument({ title: 'New Document' });
      mockDocumentStore.create.mockResolvedValue(newDoc);

      render(DocumentList);

      const createButton = screen.getByText('Create Your First Document');
      await fireEvent.click(createButton);

      await waitFor(() => {
        expect(mockDocumentStore.create).toHaveBeenCalled();
      });

      // Check that currentDocument was set to the new document
      await waitFor(() => {
        expect(mockDocumentStore.currentDocument).toEqual(newDoc);
      });
    });
  });

  describe('Empty State', () => {
    it('shows empty state with correct title and description', () => {
      mockDocumentStore.documents = [];

      render(DocumentList);

      expect(screen.getByText('No documents yet')).toBeInTheDocument();
      expect(screen.getByText('Create your first document to get started with MiniDesk.')).toBeInTheDocument();
    });

    it('calls createFirstDocument when action button clicked', async () => {
      mockDocumentStore.documents = [];
      const newDoc = createMockDocument();
      mockDocumentStore.create.mockResolvedValue(newDoc);

      render(DocumentList);

      const actionButton = screen.getByText('Create Your First Document');
      await fireEvent.click(actionButton);

      await waitFor(() => {
        expect(mockDocumentStore.create).toHaveBeenCalled();
      });
    });
  });
});
