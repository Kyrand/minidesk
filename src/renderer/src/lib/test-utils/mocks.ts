import { vi } from 'vitest';
import type { Document } from '../types';

/**
 * Create mock document for testing
 */
export function createMockDocument(overrides: Partial<Document> = {}): Document {
  return {
    id: 1,
    title: 'Test Document',
    content: 'Test content',
    isShared: false,
    createdAt: Date.now() - 86400000, // 1 day ago
    updatedAt: Date.now(),
    ...overrides
  };
}

/**
 * Create mock documentStore
 */
export function createMockDocumentStore(overrides = {}) {
  return {
    documents: [],
    currentDocument: null,
    loading: false,
    error: null,
    loadRecent: vi.fn().mockResolvedValue(undefined),
    search: vi.fn().mockResolvedValue(undefined),
    create: vi.fn().mockResolvedValue(createMockDocument()),
    update: vi.fn().mockResolvedValue(createMockDocument()),
    delete: vi.fn().mockResolvedValue(true),
    ...overrides
  };
}

/**
 * Create array of mock documents
 */
export function createMockDocuments(count: number): Document[] {
  return Array.from({ length: count }, (_, i) => createMockDocument({
    id: i + 1,
    title: `Document ${i + 1}`,
    content: `Content for document ${i + 1}`
  }));
}
