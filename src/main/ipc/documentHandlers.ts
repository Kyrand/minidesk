import { ipcMain } from 'electron';
import type { DocumentService } from '../database/services/documentService.js';
import { DatabaseError, ValidationError, DocumentNotFoundError } from '../database/types.js';

/**
 * IPC response wrapper types
 */
type IPCResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code?: string } };

/**
 * Helper to create success response
 */
function successResponse<T>(data: T): IPCResponse<T> {
  return { success: true, data };
}

/**
 * Helper to create error response
 */
function errorResponse(error: unknown): IPCResponse<never> {
  if (error instanceof ValidationError) {
    return {
      success: false,
      error: { message: error.message, code: 'VALIDATION_ERROR' },
    };
  }

  if (error instanceof DocumentNotFoundError) {
    return {
      success: false,
      error: { message: error.message, code: 'NOT_FOUND' },
    };
  }

  if (error instanceof DatabaseError) {
    return {
      success: false,
      error: { message: error.message, code: 'DATABASE_ERROR' },
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: { message: error.message, code: 'UNKNOWN_ERROR' },
    };
  }

  return {
    success: false,
    error: { message: 'An unknown error occurred', code: 'UNKNOWN_ERROR' },
  };
}

/**
 * Register all document-related IPC handlers
 */
export function registerDocumentHandlers(documentService: DocumentService): void {
  /**
   * Create a new document
   */
  ipcMain.handle(
    'document:create',
    async (
      _,
      request: { title: string; content?: string }
    ): Promise<IPCResponse<any>> => {
      try {
        const document = documentService.create(request.title, request.content);
        return successResponse(document);
      } catch (error) {
        console.error('Error creating document:', error);
        return errorResponse(error);
      }
    }
  );

  /**
   * Get a document by ID
   */
  ipcMain.handle(
    'document:get',
    async (_, request: { id: number }): Promise<IPCResponse<any>> => {
      try {
        const document = documentService.getById(request.id);
        return successResponse(document);
      } catch (error) {
        console.error('Error getting document:', error);
        return errorResponse(error);
      }
    }
  );

  /**
   * Get all documents
   */
  ipcMain.handle('document:getAll', async (): Promise<IPCResponse<any>> => {
    try {
      const documents = documentService.getAll();
      return successResponse(documents);
    } catch (error) {
      console.error('Error getting all documents:', error);
      return errorResponse(error);
    }
  });

  /**
   * Update a document
   */
  ipcMain.handle(
    'document:update',
    async (
      _,
      request: {
        id: number;
        title?: string;
        content?: string;
        isShared?: boolean;
      }
    ): Promise<IPCResponse<any>> => {
      try {
        const { id, ...updates } = request;
        const document = documentService.update(id, updates);
        return successResponse(document);
      } catch (error) {
        console.error('Error updating document:', error);
        return errorResponse(error);
      }
    }
  );

  /**
   * Delete a document
   */
  ipcMain.handle(
    'document:delete',
    async (_, request: { id: number }): Promise<IPCResponse<any>> => {
      try {
        const success = documentService.delete(request.id);
        return successResponse({ success });
      } catch (error) {
        console.error('Error deleting document:', error);
        return errorResponse(error);
      }
    }
  );

  /**
   * Get recent documents
   */
  ipcMain.handle(
    'document:getRecent',
    async (_, limit?: number): Promise<IPCResponse<any>> => {
      try {
        const documents = documentService.getRecentDocuments(limit);
        return successResponse(documents);
      } catch (error) {
        console.error('Error getting recent documents:', error);
        return errorResponse(error);
      }
    }
  );

  /**
   * Get shared documents
   */
  ipcMain.handle('document:getShared', async (): Promise<IPCResponse<any>> => {
    try {
      const documents = documentService.getSharedDocuments();
      return successResponse(documents);
    } catch (error) {
      console.error('Error getting shared documents:', error);
      return errorResponse(error);
    }
  });

  /**
   * Search documents by title
   */
  ipcMain.handle(
    'document:search',
    async (_, request: { query: string }): Promise<IPCResponse<any>> => {
      try {
        const documents = documentService.searchByTitle(request.query);
        return successResponse(documents);
      } catch (error) {
        console.error('Error searching documents:', error);
        return errorResponse(error);
      }
    }
  );

  console.log('Document IPC handlers registered');
}
