import Database from 'better-sqlite3';
import { DatabaseError } from './types.js';
import { runMigrations } from './migrator.js';

/**
 * Singleton DatabaseService class that manages the SQLite connection lifecycle
 */
export class DatabaseService {
  private static instance: DatabaseService | null = null;
  private db: Database.Database | null = null;
  private dbPath: string;

  private constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  /**
   * Get the singleton instance of DatabaseService
   * @param dbPath Path to the database file (only used on first call)
   */
  public static getInstance(dbPath?: string): DatabaseService {
    if (!DatabaseService.instance) {
      if (!dbPath) {
        throw new DatabaseError('Database path must be provided on first call to getInstance');
      }
      DatabaseService.instance = new DatabaseService(dbPath);
    }
    return DatabaseService.instance;
  }

  /**
   * Initialize the database connection, configure pragmas, and run migrations
   */
  public initialize(): void {
    if (this.db) {
      console.log('Database already initialized');
      return;
    }

    try {
      // Open database connection
      this.db = new Database(this.dbPath, {
        verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
        fileMustExist: false,
        timeout: 5000,
      });

      console.log(`Database opened at: ${this.dbPath}`);

      // Configure pragmas for optimal performance and reliability
      this.configurePragmas();

      // Run migrations to ensure schema is up to date
      runMigrations(this.db);

      console.log('Database initialized successfully');
    } catch (error) {
      throw new DatabaseError(
        'Failed to initialize database',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Configure SQLite pragmas for optimal performance
   */
  private configurePragmas(): void {
    if (!this.db) {
      throw new DatabaseError('Cannot configure pragmas: database not open');
    }

    try {
      // Write-Ahead Logging for better concurrency
      this.db.pragma('journal_mode = WAL');

      // Balance between safety and speed
      this.db.pragma('synchronous = NORMAL');

      // Enable foreign key constraints
      this.db.pragma('foreign_keys = ON');

      // Use memory for temporary tables
      this.db.pragma('temp_store = MEMORY');

      console.log('Database pragmas configured');
    } catch (error) {
      throw new DatabaseError(
        'Failed to configure pragmas',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get the database connection instance
   * @throws {DatabaseError} If database is not initialized
   */
  public getConnection(): Database.Database {
    if (!this.db) {
      throw new DatabaseError('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  /**
   * Check if the database is connected
   */
  public isConnected(): boolean {
    return this.db !== null && this.db.open;
  }

  /**
   * Close the database connection gracefully
   */
  public close(): void {
    if (this.db) {
      try {
        this.db.close();
        this.db = null;
        console.log('Database connection closed');
      } catch (error) {
        throw new DatabaseError(
          'Failed to close database',
          error instanceof Error ? error : undefined
        );
      }
    }
  }

  /**
   * Reset the singleton instance (useful for testing)
   */
  public static resetInstance(): void {
    if (DatabaseService.instance) {
      DatabaseService.instance.close();
      DatabaseService.instance = null;
    }
  }
}
