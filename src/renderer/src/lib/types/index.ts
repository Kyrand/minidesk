/**
 * Central export point for all type definitions
 */

// Document types
export type {
  Document,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  GetDocumentRequest,
  DeleteDocumentRequest,
  SearchDocumentRequest,
  DocumentResponse,
  DocumentsResponse,
  DeleteDocumentResponse,
} from './document.js';

// IPC types
export type {
  ErrorResponse,
  IPCResponse,
} from './ipc.js';

export {
  unwrapIPCResponse,
  successResponse,
  errorResponse,
} from './ipc.js';
