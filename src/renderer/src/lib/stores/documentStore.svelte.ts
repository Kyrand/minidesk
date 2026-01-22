import type {
  Document,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  DeleteDocumentRequest,
  SearchDocumentRequest,
  IPCResponse,
} from '../types/index.js';
import { unwrapIPCResponse } from '../types/index.js';

/**
 * Document store using Svelte 5 runes for reactive state management
 */
class DocumentStore {
  documents = $state<Document[]>([]);
  currentDocument = $state<Document | null>(null);
  loading = $state<boolean>(false);
  error = $state<string | null>(null);

  /**
   * Load all documents
   */
  async loadAll(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const response = await window.api.document.getAll() as IPCResponse<Document[]>;
      const documents = unwrapIPCResponse(response);
      this.documents = documents;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load documents';
      console.error('Error loading documents:', err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Load recent documents with optional limit
   */
  async loadRecent(limit: number = 20): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const response = await window.api.document.getRecent(limit) as IPCResponse<Document[]>;
      const documents = unwrapIPCResponse(response);
      this.documents = documents;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load recent documents';
      console.error('Error loading recent documents:', err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Load a document by ID
   */
  async loadById(id: number): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const response = await window.api.document.get({ id }) as IPCResponse<Document | null>;
      const document = unwrapIPCResponse(response);
      this.currentDocument = document;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load document';
      console.error('Error loading document:', err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Create a new document
   */
  async create(title: string, content: string = ''): Promise<Document | null> {
    this.loading = true;
    this.error = null;

    try {
      const request: CreateDocumentRequest = { title, content };
      const response = await window.api.document.create(request) as IPCResponse<Document>;
      const document = unwrapIPCResponse(response);

      // Add to local state
      this.documents = [document, ...this.documents];
      this.currentDocument = document;

      return document;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to create document';
      console.error('Error creating document:', err);
      return null;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Update an existing document
   */
  async update(
    id: number,
    updates: { title?: string; content?: string; isShared?: boolean }
  ): Promise<Document | null> {
    this.loading = true;
    this.error = null;

    try {
      const request: UpdateDocumentRequest = { id, ...updates };
      const response = await window.api.document.update(request) as IPCResponse<Document>;
      const document = unwrapIPCResponse(response);

      // Update local state
      const index = this.documents.findIndex((d) => d.id === id);
      if (index !== -1) {
        this.documents[index] = document;
        // Trigger reactivity by reassigning
        this.documents = [...this.documents];
      }

      if (this.currentDocument?.id === id) {
        this.currentDocument = document;
      }

      return document;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to update document';
      console.error('Error updating document:', err);
      return null;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Delete a document
   */
  async delete(id: number): Promise<boolean> {
    this.loading = true;
    this.error = null;

    try {
      const request: DeleteDocumentRequest = { id };
      const response = await window.api.document.delete(request) as IPCResponse<{ success: boolean }>;
      const result = unwrapIPCResponse(response);

      if (result.success) {
        // Remove from local state
        this.documents = this.documents.filter((d) => d.id !== id);

        if (this.currentDocument?.id === id) {
          this.currentDocument = null;
        }
      }

      return result.success;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to delete document';
      console.error('Error deleting document:', err);
      return false;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Search documents by title
   */
  async search(query: string): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const request: SearchDocumentRequest = { query };
      const response = await window.api.document.search(request) as IPCResponse<Document[]>;
      const documents = unwrapIPCResponse(response);
      this.documents = documents;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to search documents';
      console.error('Error searching documents:', err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Load shared documents
   */
  async loadShared(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const response = await window.api.document.getShared() as IPCResponse<Document[]>;
      const documents = unwrapIPCResponse(response);
      this.documents = documents;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load shared documents';
      console.error('Error loading shared documents:', err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Set the current document
   */
  setCurrentDocument(document: Document | null): void {
    this.currentDocument = document;
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.error = null;
  }
}

// Export a singleton instance
export const documentStore = new DocumentStore();
