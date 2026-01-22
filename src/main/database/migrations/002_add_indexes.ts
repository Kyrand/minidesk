import type { Migration } from '../types.js';

/**
 * Add performance indexes to documents table
 */
export const migration002: Migration = {
  version: 2,
  name: 'add_indexes',

  up: (db) => {
    // Index for sorting documents by update time (DESC for most recent first)
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_documents_updatedAt
      ON documents(updatedAt DESC);
    `);

    // Index for filtering shared documents
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_documents_isShared
      ON documents(isShared);
    `);

    console.log('Created performance indexes on documents table');
  },

  down: (db) => {
    // Drop indexes in reverse order
    db.exec(`
      DROP INDEX IF EXISTS idx_documents_isShared;
      DROP INDEX IF EXISTS idx_documents_updatedAt;
    `);

    console.log('Dropped performance indexes from documents table');
  },
};
