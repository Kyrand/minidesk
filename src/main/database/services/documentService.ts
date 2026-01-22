import type Database from 'better-sqlite3';
import type { Document, DocumentRow } from '../types.js';
import {
  mapRowToDocument,
  boolToInt,
  DatabaseError,
  DocumentNotFoundError,
  ValidationError,
} from '../types.js';

/**
 * Document service for CRUD operations on documents
 */
export class DocumentService {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  /**
   * Validate document title
   */
  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new ValidationError('Document title cannot be empty');
    }
    if (title.length > 255) {
      throw new ValidationError('Document title cannot exceed 255 characters');
    }
  }

  /**
   * Create a new document
   * @param title Document title (required, max 255 chars)
   * @param content Document content (optional, default empty string)
   * @returns The created document with auto-generated ID and timestamps
   */
  create(title: string, content: string = ''): Document {
    this.validateTitle(title);

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const result = this.db
        .prepare(
          `INSERT INTO documents (title, content, createdAt, updatedAt, isShared)
           VALUES (?, ?, ?, ?, 0)`
        )
        .run(title, content, timestamp, timestamp);

      const id = result.lastInsertRowid as number;

      return {
        id,
        title,
        content,
        createdAt: timestamp,
        updatedAt: timestamp,
        isShared: false,
      };
    } catch (error) {
      throw new DatabaseError(
        'Failed to create document',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get a document by ID
   * @param id Document ID
   * @returns The document or null if not found
   */
  getById(id: number): Document | null {
    try {
      const row = this.db
        .prepare('SELECT * FROM documents WHERE id = ?')
        .get(id) as DocumentRow | undefined;

      return row ? mapRowToDocument(row) : null;
    } catch (error) {
      throw new DatabaseError(
        `Failed to get document with id ${id}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get all documents ordered by most recently updated
   * @returns Array of all documents
   */
  getAll(): Document[] {
    try {
      const rows = this.db
        .prepare('SELECT * FROM documents ORDER BY updatedAt DESC')
        .all() as DocumentRow[];

      return rows.map(mapRowToDocument);
    } catch (error) {
      throw new DatabaseError(
        'Failed to get all documents',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Update a document
   * @param id Document ID
   * @param updates Partial document updates
   * @returns The updated document
   * @throws {DocumentNotFoundError} If document doesn't exist
   */
  update(
    id: number,
    updates: { title?: string; content?: string; isShared?: boolean }
  ): Document {
    // Validate that document exists
    const existing = this.getById(id);
    if (!existing) {
      throw new DocumentNotFoundError(id);
    }

    // Validate title if provided
    if (updates.title !== undefined) {
      this.validateTitle(updates.title);
    }

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const fieldsToUpdate: string[] = [];
      const values: any[] = [];

      if (updates.title !== undefined) {
        fieldsToUpdate.push('title = ?');
        values.push(updates.title);
      }

      if (updates.content !== undefined) {
        fieldsToUpdate.push('content = ?');
        values.push(updates.content);
      }

      if (updates.isShared !== undefined) {
        fieldsToUpdate.push('isShared = ?');
        values.push(boolToInt(updates.isShared));
      }

      // Always update the updatedAt timestamp
      fieldsToUpdate.push('updatedAt = ?');
      values.push(timestamp);

      // Add ID for WHERE clause
      values.push(id);

      const sql = `UPDATE documents SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
      this.db.prepare(sql).run(...values);

      // Return the updated document
      const updated = this.getById(id);
      if (!updated) {
        throw new DatabaseError('Failed to retrieve updated document');
      }

      return updated;
    } catch (error) {
      if (error instanceof DocumentNotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to update document with id ${id}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Delete a document
   * @param id Document ID
   * @returns true if deleted, false if not found
   */
  delete(id: number): boolean {
    try {
      const result = this.db.prepare('DELETE FROM documents WHERE id = ?').run(id);
      return result.changes > 0;
    } catch (error) {
      throw new DatabaseError(
        `Failed to delete document with id ${id}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get recent documents with optional limit
   * @param limit Maximum number of documents to return (default 20)
   * @returns Array of recent documents
   */
  getRecentDocuments(limit: number = 20): Document[] {
    try {
      const rows = this.db
        .prepare('SELECT * FROM documents ORDER BY updatedAt DESC LIMIT ?')
        .all(limit) as DocumentRow[];

      return rows.map(mapRowToDocument);
    } catch (error) {
      throw new DatabaseError(
        'Failed to get recent documents',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get all shared documents
   * @returns Array of shared documents
   */
  getSharedDocuments(): Document[] {
    try {
      const rows = this.db
        .prepare('SELECT * FROM documents WHERE isShared = 1 ORDER BY updatedAt DESC')
        .all() as DocumentRow[];

      return rows.map(mapRowToDocument);
    } catch (error) {
      throw new DatabaseError(
        'Failed to get shared documents',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Search documents by title using simple LIKE search
   * @param query Search query
   * @returns Array of matching documents
   */
  searchByTitle(query: string): Document[] {
    try {
      const rows = this.db
        .prepare(
          `SELECT * FROM documents
           WHERE title LIKE ?
           ORDER BY updatedAt DESC`
        )
        .all(`%${query}%`) as DocumentRow[];

      return rows.map(mapRowToDocument);
    } catch (error) {
      throw new DatabaseError(
        'Failed to search documents',
        error instanceof Error ? error : undefined
      );
    }
  }
}
