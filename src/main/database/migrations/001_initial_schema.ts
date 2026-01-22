import type { Migration } from '../types.js';

/**
 * Initial schema migration
 * Creates the documents and schema_migrations tables
 */
export const migration001: Migration = {
  version: 1,
  name: 'initial_schema',

  up: (db) => {
    // Create schema_migrations table first to track migrations
    db.exec(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version INTEGER NOT NULL UNIQUE,
        name TEXT NOT NULL,
        applied_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      );
    `);

    // Create documents table
    db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL CHECK(length(title) <= 255),
        content TEXT NOT NULL DEFAULT '',
        createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        isShared INTEGER NOT NULL DEFAULT 0 CHECK(isShared IN (0, 1))
      );
    `);

    console.log('Created documents and schema_migrations tables');
  },

  down: (db) => {
    // Drop tables in reverse order
    db.exec(`
      DROP TABLE IF EXISTS documents;
      DROP TABLE IF EXISTS schema_migrations;
    `);

    console.log('Dropped documents and schema_migrations tables');
  },
};
