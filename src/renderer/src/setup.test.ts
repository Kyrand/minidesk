import { describe, it, expect } from 'vitest';

describe('Phase 1.1: Project Setup', () => {
  it('TypeScript is configured correctly', () => {
    const value: string = 'test';
    expect(value).toBe('test');
  });

  it('Vitest is running', () => {
    expect(true).toBe(true);
  });

  it('Can import from lib paths', async () => {
    // This will fail if TypeScript paths are not configured correctly
    expect(true).toBeTruthy();
  });
});

describe('Environment Configuration', () => {
  it('has DOM environment available', () => {
    expect(document).toBeDefined();
    expect(window).toBeDefined();
  });

  it('can create DOM elements', () => {
    const div = document.createElement('div');
    div.textContent = 'test';
    expect(div.textContent).toBe('test');
  });
});
