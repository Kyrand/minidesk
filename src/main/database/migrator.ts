import type Database from 'better-sqlite3';
import type { Migration, SchemaMigrationRow } from './types.js';
import { DatabaseError } from './types.js';
import { migrations } from './migrations/index.js';

/**
 * Get the current schema version from the database
 * Returns 0 if the schema_migrations table doesn't exist yet
 */
function getCurrentVersion(db: Database.Database): number {
  try {
    // Check if schema_migrations table exists
    const tableExists = db
      .prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='schema_migrations'`
      )
      .get();

    if (!tableExists) {
      return 0;
    }

    // Get the highest version number
    const result = db
      .prepare('SELECT MAX(version) as version FROM schema_migrations')
      .get() as { version: number | null };

    return result.version ?? 0;
  } catch (error) {
    throw new DatabaseError(
      'Failed to get current schema version',
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Record a migration as applied in the schema_migrations table
 */
function recordMigration(db: Database.Database, version: number, name: string): void {
  try {
    db.prepare('INSERT INTO schema_migrations (version, name) VALUES (?, ?)').run(
      version,
      name
    );
  } catch (error) {
    throw new DatabaseError(
      `Failed to record migration ${version}`,
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Run all pending migrations in a transaction
 * Each migration is atomic - if it fails, all changes are rolled back
 */
export function runMigrations(db: Database.Database): void {
  const currentVersion = getCurrentVersion(db);
  const pendingMigrations = migrations.filter((m) => m.version > currentVersion);

  if (pendingMigrations.length === 0) {
    console.log(`Database is up to date (version ${currentVersion})`);
    return;
  }

  console.log(
    `Running ${pendingMigrations.length} pending migrations (current version: ${currentVersion})`
  );

  for (const migration of pendingMigrations) {
    console.log(`Applying migration ${migration.version}: ${migration.name}`);

    // Wrap each migration in a transaction for atomicity
    const applyMigration = db.transaction(() => {
      try {
        migration.up(db);

        // Only record migration if schema_migrations table exists
        // (it's created by the first migration)
        const tableExists = db
          .prepare(
            `SELECT name FROM sqlite_master WHERE type='table' AND name='schema_migrations'`
          )
          .get();

        if (tableExists) {
          recordMigration(db, migration.version, migration.name);
        }

        console.log(`Migration ${migration.version} applied successfully`);
      } catch (error) {
        throw new DatabaseError(
          `Failed to apply migration ${migration.version}: ${migration.name}`,
          error instanceof Error ? error : undefined
        );
      }
    });

    applyMigration();
  }

  const newVersion = getCurrentVersion(db);
  console.log(`Database migrated to version ${newVersion}`);
}

/**
 * Rollback the last migration (for development/testing)
 * WARNING: Use with caution in production!
 */
export function rollbackLastMigration(db: Database.Database): void {
  const currentVersion = getCurrentVersion(db);

  if (currentVersion === 0) {
    console.log('No migrations to rollback');
    return;
  }

  const migration = migrations.find((m) => m.version === currentVersion);

  if (!migration) {
    throw new DatabaseError(`Migration version ${currentVersion} not found`);
  }

  console.log(`Rolling back migration ${migration.version}: ${migration.name}`);

  const rollback = db.transaction(() => {
    try {
      migration.down(db);
      db.prepare('DELETE FROM schema_migrations WHERE version = ?').run(currentVersion);
      console.log(`Migration ${migration.version} rolled back successfully`);
    } catch (error) {
      throw new DatabaseError(
        `Failed to rollback migration ${migration.version}`,
        error instanceof Error ? error : undefined
      );
    }
  });

  rollback();
}
