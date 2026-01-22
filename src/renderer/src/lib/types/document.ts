/**
 * Document entity (matches main process Document type)
 */
export interface Document {
  id: number;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  isShared: boolean;
}

/**
 * Request to create a new document
 */
export interface CreateDocumentRequest {
  title: string;
  content?: string;
}

/**
 * Request to update an existing document
 */
export interface UpdateDocumentRequest {
  id: number;
  title?: string;
  content?: string;
  isShared?: boolean;
}

/**
 * Request to get a document by ID
 */
export interface GetDocumentRequest {
  id: number;
}

/**
 * Request to delete a document
 */
export interface DeleteDocumentRequest {
  id: number;
}

/**
 * Request to search documents by title
 */
export interface SearchDocumentRequest {
  query: string;
}

/**
 * Response containing a single document (may be null if not found)
 */
export type DocumentResponse = Document | null;

/**
 * Response containing an array of documents
 */
export type DocumentsResponse = Document[];

/**
 * Response for delete operation
 */
export interface DeleteDocumentResponse {
  success: boolean;
}
