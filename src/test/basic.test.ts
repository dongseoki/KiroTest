// Basic test to verify setup
import { describe, it, expect } from 'vitest';

describe('Project Setup', () => {
  it('should have working test environment', () => {
    expect(true).toBe(true);
  });

  it('should have localStorage mock available', () => {
    expect(window.localStorage).toBeDefined();
    expect(typeof window.localStorage.getItem).toBe('function');
  });

  it('should have navigator mock available', () => {
    expect(window.navigator).toBeDefined();
    expect(window.navigator.onLine).toBe(true);
  });
});