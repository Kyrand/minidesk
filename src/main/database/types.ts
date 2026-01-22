import type Database from 'better-sqlite3';

/**
 * Raw SQLite output for Document table rows
 */
export interface DocumentRow {
  id: number;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  isShared: number; // SQLite stores booleans as integers (0 or 1)
}

/**
 * Domain entity for Document
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
 * Raw SQLite output for schema_migrations table rows
 */
export interface SchemaMigrationRow {
  id: number;
  version: number;
  name: string;
  applied_at: number;
}

/**
 * Migration definition interface
 */
export interface Migration {
  version: number;
  name: string;
  up: (db: Database.Database) => void;
  down: (db: Database.Database) => void;
}

/**
 * Custom error classes for database operations
 */
export class DatabaseError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class DocumentNotFoundError extends DatabaseError {
  constructor(id: number) {
    super(`Document with id ${id} not found`);
    this.name = 'DocumentNotFoundError';
  }
}

export class ValidationError extends DatabaseError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Mapper function to convert raw SQLite row to Document entity
 */
export function mapRowToDocument(row: DocumentRow): Document {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    isShared: row.isShared === 1,
  };
}

/**
 * Mapper function to convert boolean to SQLite integer
 */
export function boolToInt(value: boolean): number {
  return value ? 1 : 0;
}

/**
 * Mapper function to convert SQLite integer to boolean
 */
export function intToBool(value: number): boolean {
  return value === 1;
}
