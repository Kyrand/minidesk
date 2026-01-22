import type { Migration } from '../types.js';
import { migration001 } from './001_initial_schema.js';
import { migration002 } from './002_add_indexes.js';

/**
 * Array of all migrations in order
 * IMPORTANT: Migrations must be added in chronological order
 * Each migration version must be unique and sequential
 */
export const migrations: Migration[] = [
  migration001,
  migration002,
];
